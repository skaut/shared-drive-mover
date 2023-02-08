/* eslint-env node */

import { defineConfig } from "cypress";

export default defineConfig({
  video: false,
  e2e: {
    setupNodeEvents(on, config) {
      require("@cypress/code-coverage/task")(on, config);
      return config;
    },
    specPattern: "__tests__/frontend/**/*.cy.ts",
  },
});
