/* eslint-env node */

import { defineConfig } from "cypress";

export default defineConfig({
  video: false,
  e2e: {
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      require("@cypress/code-coverage/task")(on, config);
      return config;
    },
    specPattern: "__tests__/frontend/**/*.cy.ts",
  },
});
