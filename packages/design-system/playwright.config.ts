import { defineConfig, devices } from "@playwright/test";
import process from "node:process";

// Against built storybook-static/ (same artifact as CI).
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: 1,
  // json reporter feeds .github/scripts/build-pr-summary.mjs
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
      // Font-hinting drift across runners; real layout/color regressions exceed this.
      maxDiffPixelRatio: 0.02,
    },
  },
  snapshotPathTemplate: "{testDir}/{testFileDir}/{testFileName}-snapshots/{arg}-{projectName}-linux.png",
  webServer: {
    command: "pnpm exec http-server storybook-static -p 6006 -s",
    url: "http://127.0.0.1:6006",
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
