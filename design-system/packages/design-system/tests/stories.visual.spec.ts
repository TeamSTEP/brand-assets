import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
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
// configured in .storybook/preview.ts (CLAUDE.md step 6).
const VIEWPORTS = [
  { name: "mobile", width: 390, height: 844 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1280, height: 800 },
] as const;

for (const story of stories) {
  for (const viewport of VIEWPORTS) {
    test(`${story.title} > ${story.name} @ ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto(`/iframe.html?id=${story.id}&viewMode=story`);
      await page.waitForLoadState("domcontentloaded");

      const accessibilityScanResults = await new AxeBuilder({ page })
        // These rules check document-level page structure (one <main>, one <h1>, all content
        // inside a landmark). Each story here renders a single component in isolation inside
        // Storybook's own iframe.html — that's the harness's document, not a page this design
        // system ships, so the rule is a structural false positive here, not a real a11y gap.
        // Component-level checks (aria-*, color-contrast, name/role/value, etc.) still run.
        .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
        .analyze();
      expect(accessibilityScanResults.violations).toEqual([]);

      await expect(page).toHaveScreenshot(`${story.id}-${viewport.name}.png`, {
        animations: "disabled",
      });
    });
  }
}
