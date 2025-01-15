import { svelte, vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

export default defineConfig({
  build: {
    outDir: "../../dist",
  },
  plugins: [
    svelte({
      onwarn: (warning, defaultHandler) => {
        if (
          warning.code === "vite-plugin-svelte-preprocess-many-dependencies"
        ) {
          return;
        }
        defaultHandler?.(warning);
      },
      preprocess: vitePreprocess(),
    }),
    viteSingleFile({ removeViteModuleLoader: false }),
  ],
  root: "src/frontend/",
});
