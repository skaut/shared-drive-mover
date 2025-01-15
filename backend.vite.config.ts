import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: ["backend/index.ts"],
      fileName: () => "backend.gs",
      formats: ["es"],
      name: "backend",
    },
    minify: false,
    outDir: "../dist",
  },
  root: "src",
  test: {
    coverage: {
      include: ["src/backend/**/*.ts"],
    },
    dir: "tests/backend",
    mockReset: true,
    root: ".",
  },
});
