import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./__tests__/frontend",
  fullyParallel: true,
  forbidOnly: process.env.CI !== undefined,
  retries: process.env.CI !== undefined ? 2 : 0,
  // Opt out of parallel tests on CI.
  //workers: process.env.CI !== undefined ? 1 : undefined,
  reporter: process.env.CI !== undefined ? "html" : "list",
  use: {
    baseURL: "http://127.0.0.1:8080",
    trace: "on-first-retry",
  },

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

  webServer: {
    command: "npm run start",
    url: "http://127.0.0.1:8080",
    reuseExistingServer: process.env.CI === undefined,
  },
});
