/* eslint-env node */

import { defineConfig } from "cypress";

export default defineConfig({
  video: false,
  e2e: {
    setupNodeEvents(on, config) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-var-requires
      require("@cypress/code-coverage/task")(on, config);
      return config;
    },
    specPattern: "__tests__/frontend/**/*.cy.ts",
  },
});
