/* eslint-env node */

import register from "@cypress/code-coverage/task";
import { defineConfig } from "cypress";

export default defineConfig({
  video: false,
  e2e: {
    setupNodeEvents(on, config) {
      register(on, config);
      return config;
    },
    specPattern: "__tests__/frontend/**/*.cy.ts",
  },
});
