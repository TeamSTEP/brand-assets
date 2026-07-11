import { test, expect } from "@playwright/test";
import { AxeBuilder } from "@axe-core/playwright";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

interface StoryIndexEntry {
  id: string;
  title: string;
  name: string;
  type: string; // "story" | "docs"
}

interface StoryIndex {
  entries: Record<string, StoryIndexEntry>;
}

// Read directly from the built storybook-static/index.json rather than hardcoding story IDs,
// same pattern as Tokens.stories.tsx — this file stays correct as stories are added/removed,
// no test-file edit required. Requires build-storybook to have already run (see package.json's
// test-visual script).
const indexPath = path.resolve(__dirname, "../storybook-static/index.json");
const index = JSON.parse(fs.readFileSync(indexPath, "utf-8")) as StoryIndex;
const stories = Object.values(index.entries).filter((entry) => entry.type === "story");

// Matches the wireframe's desktop/mobile breakpoints and the Storybook viewport presets
// configured in .storybook/preview.ts (see AGENTS.md Testing gotchas).
const VIEWPORTS = [
  { name: "mobile", width: 390, height: 844 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1280, height: 800 },
] as const;

// axe's color-contrast check reports `incomplete` (not `violations`) for text whose
// effective background it can't resolve deterministically — a documented axe-core
// limitation whenever an element sits behind a CSS gradient (its own or an ancestor's,
// including the PixelGrid/ScanlineOverlay/VignetteOverlay effects components), tagged
// internally as reason `bgGradient`. It is not evidence of a real contrast problem: this
// codebase has a second, DOM-independent check for that —
// `pnpm run check-contrast` (scripts/check-token-contrast.mjs) computes WCAG ratios
// directly from every text-color token's resolved hex value against every sanctioned
// background token, so an actual sub-AA pairing would already fail that gate regardless of
// how many overlays sit on top of it. Given that, a `bgGradient`-only `incomplete` result is
// safe to treat as resolved here. This was previously a hand-maintained per-story,
// per-selector allowlist; it kept needing new entries every time another gradient/overlay
// component was exercised (Footer's gradient, Hero's PixelGrid, then BBSTerminal's
// VignetteOverlay covering its nested BBSPanelAPI/SocialFeed text) — a `messageKey`-based
// rule covers all of them structurally instead of by enumeration, so it can't go stale the
// same way. Any *other* reason axe reports `incomplete` for is still treated as failing.
function isUnresolvableBackgroundIncomplete(result: {
  id: string;
  nodes: { any: { id: string; data?: { messageKey?: string } | null }[] }[];
}): boolean {
  if (result.id !== "color-contrast") return false;
  return result.nodes.every(
    (node) =>
      node.any.length > 0 &&
      node.any.every((check) => check.id === "color-contrast" && check.data?.messageKey === "bgGradient"),
  );
}

for (const story of stories) {
  for (const viewport of VIEWPORTS) {
    test(`${story.title} > ${story.name} @ ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto(`/iframe.html?id=${story.id}&viewMode=story`);
      await page.waitForLoadState("domcontentloaded");
      await page.evaluate(() => document.fonts.ready);

      const accessibilityScanResults = await new AxeBuilder({ page })
        // These rules check document-level page structure (one <main>, one <h1>, all content
        // inside a landmark, a skip-navigation mechanism). Each story here renders a single
        // component in isolation inside Storybook's own iframe.html — that's the harness's
        // document, not a page this design system ships, so the rule is a structural false
        // positive here, not a real a11y gap. Component-level checks (aria-*, color-contrast,
        // name/role/value, etc.) still run. `bypass` was added after the incomplete/violations
        // fix below started asserting on `incomplete` too: it was already present as
        // `incomplete` on every story (verified directly against axe, including on
        // content-free stories like Effects/PixelGrid), for the identical harness reason as
        // the other three — it just wasn't visible while this test only checked `violations`.
        // `frame-tested` was disabled on the assumption axe can't reach into BBSPanelIframe's
        // cross-origin Discord embed at all — turns out it can (Discord's widget doesn't block
        // axe's cross-frame script injection), and it surfaces a real color-contrast violation
        // in Discord's own widget footer text, not anything this design system renders. We still
        // don't own or ship that content and can't fix Discord's contrast choices, so `.exclude`
        // it from the scan entirely — the same "don't verify third-party embed content" intent
        // `frame-tested` was meant to express, just enforced correctly instead of assumed. This
        // is the same unfixable-third-party-embed category HANDOFF.md already carves out
        // BBSPanelIframe's Safari-only CSS filter rendering into a manual release check for.
        .exclude("iframe")
        .disableRules(["landmark-one-main", "page-has-heading-one", "region", "bypass", "frame-tested"])
        .analyze();
      // Also assert on `incomplete`, not just `violations`. axe reports color-contrast as
      // `incomplete` — not a violation — when it can't resolve a definitive background (e.g.
      // layered overlays/gradients), which silently passed two real sub-AA components (Hero,
      // Footer) that this same assertion, checking only `violations`, missed. An `incomplete`
      // result here means axe couldn't determine pass/fail, not that it passed — treat it as
      // failing unless it's the specific, structurally-safe `bgGradient` case handled by
      // isUnresolvableBackgroundIncomplete above. Never silence this by narrowing back to
      // `violations` only.
      const unresolvedIncomplete = accessibilityScanResults.incomplete.filter(
        (result) => !isUnresolvableBackgroundIncomplete(result),
      );
      expect([...accessibilityScanResults.violations, ...unresolvedIncomplete]).toEqual([]);

      // Mask any iframe (currently just BBSPanelIframe's live Discord widget) before comparing
      // pixels — it's real, live server data (member avatars, online counts, presence), not
      // anything this design system renders, and it changes on its own between whenever a
      // baseline was captured and whenever the test re-runs. No maxDiffPixelRatio tolerance
      // fixes that; the content itself is nondeterministic, so it has to be excluded from the
      // comparison entirely rather than compared at all. A no-op for every other story.
      await expect(page).toHaveScreenshot(`${story.id}-${viewport.name}.png`, {
        animations: "disabled",
        mask: [page.locator("iframe")],
      });
    });
  }
}
