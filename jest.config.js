/** @type {import('jest').Config} */
export default {
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.svelte",
    "src/**/*.ts",
    "!src/**/*.d.ts",
    "!src/backend/index.ts",
    "!src/frontend/index.ts",
  ],
  coverageDirectory: "coverage",
  coverageProvider: "babel",
  projects: [
    {
      displayName: "backend",
      injectGlobals: false,
      preset: "ts-jest/presets/default-esm",
      resetMocks: true,
      testMatch: ["<rootDir>/__tests__/backend/**/*.test.ts"],
    },
  ],
};
