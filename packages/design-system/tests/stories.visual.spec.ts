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

const indexPath = path.resolve(__dirname, "../storybook-static/index.json");
const index = JSON.parse(fs.readFileSync(indexPath, "utf-8")) as StoryIndex;
const stories = Object.values(index.entries).filter((entry) => entry.type === "story");

const VIEWPORTS = [
  { name: "mobile", width: 390, height: 844 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1280, height: 800 },
] as const;

// Incomplete color-contrast with these messageKeys = unresolved background; real fails have
// messageKey null + a measured ratio. Token AA is enforced by check-contrast.
const UNRESOLVABLE_CONTRAST_MESSAGE_KEYS = new Set([
  "bgGradient",
  "imgNode",
  "elmPartiallyObscured",
]);

function isUnresolvableBackgroundIncomplete(result: {
  id: string;
  nodes: { any: { id: string; data?: { messageKey?: string } | null }[] }[];
}): boolean {
  if (result.id !== "color-contrast") return false;
  return result.nodes.every(
    (node) =>
      node.any.length > 0 &&
      node.any.every(
        (check) =>
          check.id === "color-contrast" &&
          typeof check.data?.messageKey === "string" &&
          UNRESOLVABLE_CONTRAST_MESSAGE_KEYS.has(check.data.messageKey),
      ),
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
        // Page-level landmark/bypass rules and Discord iframe contrast are harness/third-party
        // false positives — component-level axe rules still run.
        .exclude("iframe")
        .disableRules(["landmark-one-main", "page-has-heading-one", "region", "bypass", "frame-tested"])
        .analyze();
      const unresolvedIncomplete = accessibilityScanResults.incomplete.filter(
        (result) => !isUnresolvableBackgroundIncomplete(result),
      );
      expect([...accessibilityScanResults.violations, ...unresolvedIncomplete]).toEqual([]);

      await expect(page).toHaveScreenshot(`${story.id}-${viewport.name}.png`, {
        animations: "disabled",
        mask: [page.locator("iframe")],
      });
    });
  }
}
