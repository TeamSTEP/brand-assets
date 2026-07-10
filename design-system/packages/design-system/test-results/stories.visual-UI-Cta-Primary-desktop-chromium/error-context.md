# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: stories.visual.spec.ts >> UI/Cta > Primary @ desktop
- Location: tests/stories.visual.spec.ts:38:5

# Error details

```
Error: A snapshot doesn't exist at /work/design-system/packages/design-system/tests/stories.visual.spec.ts-snapshots/ui-cta--primary-desktop-chromium-linux.png, writing actual.
```

# Page snapshot

```yaml
- link "▶ PLAY STEAM DEMO" [ref=e4] [cursor=pointer]:
  - /url: "#"
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | import { AxeBuilder } from "@axe-core/playwright";
  3  | import fs from "node:fs";
  4  | import path from "node:path";
  5  | import { fileURLToPath } from "node:url";
  6  | 
  7  | const __dirname = path.dirname(fileURLToPath(import.meta.url));
  8  | 
  9  | interface StoryIndexEntry {
  10 |   id: string;
  11 |   title: string;
  12 |   name: string;
  13 |   type: string; // "story" | "docs"
  14 | }
  15 | 
  16 | interface StoryIndex {
  17 |   entries: Record<string, StoryIndexEntry>;
  18 | }
  19 | 
  20 | // Read directly from the built storybook-static/index.json rather than hardcoding story IDs,
  21 | // same pattern as Tokens.stories.tsx — this file stays correct as stories are added/removed,
  22 | // no test-file edit required. Requires build-storybook to have already run (see package.json's
  23 | // test-visual script).
  24 | const indexPath = path.resolve(__dirname, "../storybook-static/index.json");
  25 | const index = JSON.parse(fs.readFileSync(indexPath, "utf-8")) as StoryIndex;
  26 | const stories = Object.values(index.entries).filter((entry) => entry.type === "story");
  27 | 
  28 | // Matches the wireframe's desktop/mobile breakpoints and the Storybook viewport presets
  29 | // configured in .storybook/preview.ts (CLAUDE.md step 6).
  30 | const VIEWPORTS = [
  31 |   { name: "mobile", width: 390, height: 844 },
  32 |   { name: "tablet", width: 768, height: 1024 },
  33 |   { name: "desktop", width: 1280, height: 800 },
  34 | ] as const;
  35 | 
  36 | for (const story of stories) {
  37 |   for (const viewport of VIEWPORTS) {
  38 |     test(`${story.title} > ${story.name} @ ${viewport.name}`, async ({ page }) => {
  39 |       await page.setViewportSize({ width: viewport.width, height: viewport.height });
  40 |       await page.goto(`/iframe.html?id=${story.id}&viewMode=story`);
  41 |       await page.waitForLoadState("domcontentloaded");
  42 |       await page.evaluate(() => document.fonts.ready);
  43 | 
  44 |       const accessibilityScanResults = await new AxeBuilder({ page })
  45 |         // These rules check document-level page structure (one <main>, one <h1>, all content
  46 |         // inside a landmark). Each story here renders a single component in isolation inside
  47 |         // Storybook's own iframe.html — that's the harness's document, not a page this design
  48 |         // system ships, so the rule is a structural false positive here, not a real a11y gap.
  49 |         // Component-level checks (aria-*, color-contrast, name/role/value, etc.) still run.
  50 |         .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
  51 |         .analyze();
  52 |       expect(accessibilityScanResults.violations).toEqual([]);
  53 | 
> 54 |       await expect(page).toHaveScreenshot(`${story.id}-${viewport.name}.png`, {
     |       ^ Error: A snapshot doesn't exist at /work/design-system/packages/design-system/tests/stories.visual.spec.ts-snapshots/ui-cta--primary-desktop-chromium-linux.png, writing actual.
  55 |         animations: "disabled",
  56 |       });
  57 |     });
  58 |   }
  59 | }
  60 | 
```