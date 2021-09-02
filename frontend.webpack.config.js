/* eslint-env node */

const HtmlWebpackPlugin = require("html-webpack-plugin");
const sveltePreprocess = require("svelte-preprocess");
const TerserPlugin = require("terser-webpack-plugin");

const path = require("path");

module.exports = {
  mode: "production",
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        //extractComments: false,
      }),
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/frontend/index.html",
      minify: false,
      inject: false,
      //scriptLoading: "blocking",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.svelte/,
        use: {
          loader: "svelte-loader",
          options: {
            preprocess: sveltePreprocess({
              tsconfigFile: "./frontend.tsconfig.json",
              scss: {
                includePaths: ["src/frontend"],
              },
            }),
          },
        },
      },
    ],
  },
  resolve: {
    alias: {
      svelte: path.resolve("node_modules", "svelte"),
    },
    extensions: [".ts", ".js", ".svelte"],
    mainFields: ["svelte", "browser", "module", "main"],
  },
  entry: {
    index: "./src/frontend/index.ts",
  },
  output: {
    filename: "[name].js",
  },
  performance: {
    hints: false,
  },
};
