/* eslint-env node */

const HtmlWebpackPlugin = require("html-webpack-plugin");
const sveltePreprocess = require("svelte-preprocess");

const path = require("path");

module.exports = {
  mode: "production",
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/frontend/index.html",
      minify: false,
      inject: false,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.svelte$/,
        use: {
          loader: "svelte-loader",
          options: {
            preprocess: sveltePreprocess({
              tsconfigFile: "./frontend.tsconfig.json",
            }),
          },
        },
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "sass-loader",
            options: {
              sassOptions: {
                includePaths: ["./src/frontend", "./node_modules"],
              },
            },
          },
        ],
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
    publicPath: "",
  },
  performance: {
    hints: false,
  },
};
