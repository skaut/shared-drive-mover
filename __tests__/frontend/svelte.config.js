const sveltePreprocess = require("svelte-preprocess");

module.exports = {
  preprocess: sveltePreprocess({
    tsconfigFile: "./frontend.tsconfig.json",
  }),
};
