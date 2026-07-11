import { defineConfig, devices } from "@playwright/test";
import process from "node:process";

// Runs against the *built* Storybook (storybook-static/), not the dev server — the same
// artifact CI produces via build-storybook, so a green run here means a green run in CI.
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: 1,
  // json reporter feeds the PR sticky-comment summary (.github/scripts/build-pr-summary.mjs) —
  // don't remove without updating that script.
  reporter: [
    ["list"],
    ["html", { open: "never", outputFolder: "playwright-report" }],
    ["json", { outputFile: "playwright-report/results.json" }],
  ],
  use: {
    baseURL: "http://127.0.0.1:6006",
    trace: "retain-on-failure",
  },
  expect: {
    toHaveScreenshot: {
      // Absorbs OS-level font-hinting/anti-aliasing drift between whatever environment
      // generated a baseline and whatever environment is verifying it (e.g. GitHub's hosted
      // ubuntu-latest runner picking up a fontconfig/freetype point release the baseline wasn't
      // generated against) — observed consistently around a 1% pixel ratio for genuinely
      // unchanged stories, never higher. A real visual regression (broken layout, wrong color,
      // missing element) moves far more than 2% of pixels, so this doesn't hide real breakage;
      // it only stops re-litigating rendering noise. See AGENTS.md Testing gotchas.
      maxDiffPixelRatio: 0.02,
    },
  },
  webServer: {
    command: "pnpm exec http-server storybook-static -p 6006 -s",
    url: "http://127.0.0.1:6006",
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
