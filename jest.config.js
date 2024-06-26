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
      transform: {
        // eslint-disable-next-line @typescript-eslint/naming-convention -- The key is a glob.
        "^.+\\.ts$": [
          "ts-jest",
          {
            // ts-jest configuration goes here
            tsconfig: "backend.tsconfig.json",
          },
        ],
      },
      resetMocks: true,
      testMatch: ["<rootDir>/__tests__/backend/**/*.test.ts"],
    },
  ],
};
