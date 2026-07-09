import { defineConfig, devices } from "@playwright/test";
import process from "node:process";

// Runs against the *built* Storybook (storybook-static/), not the dev server — the same
// artifact CI produces via build-storybook, so a green run here means a green run in CI.
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"], ["html", { open: "never", outputFolder: "playwright-report" }]],
  use: {
    baseURL: "http://127.0.0.1:6006",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "pnpm exec http-server storybook-static -p 6006 -s",
    url: "http://127.0.0.1:6006",
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
