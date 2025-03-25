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
        defaultHandler(warning);
      },
      preprocess: vitePreprocess(),
    }),
    viteSingleFile({ removeViteModuleLoader: false }),
    {
      generateBundle: (_, bundle): void => {
        for (const asset of Object.values(bundle)) {
          if (asset.type === "chunk") {
            asset.code = asset.code.replace(/:\/\//gu, ":\\/\\/");
          }
        }
      },
      name: "double-slash-fixer",
    },
  ],
  root: "src/frontend/",
});
