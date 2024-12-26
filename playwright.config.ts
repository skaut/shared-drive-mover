import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  forbidOnly: process.env["CI"] !== undefined,
  fullyParallel: true,
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],
  reporter: process.env["CI"] !== undefined ? "html" : "list",
  retries: process.env["CI"] !== undefined ? 2 : 0,
  testDir: "./__tests__/frontend",
  use: {
    baseURL: "http://127.0.0.1:8080",
    trace: "on-first-retry",
  },
  webServer: {
    command: "npm run start",
    reuseExistingServer: process.env["CI"] === undefined,
    url: "http://127.0.0.1:8080",
  },
  // Opt out of parallel tests on CI.
  //workers: process.env["CI"] !== undefined ? 1 : undefined,
});
