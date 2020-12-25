/* eslint-env node */

const HtmlWebpackPlugin = require("html-webpack-plugin");
const ScriptExtHtmlWebPackPlugin = require("script-ext-html-webpack-plugin");

const path = require("path");

module.exports = {
  mode: "production",
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/frontend/index.html",
    }),
    new ScriptExtHtmlWebPackPlugin({
      inline: /\.js$/,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.svelte/,
        //exclude: /node_modules/,
        use: {
          loader: "svelte-loader",
          options: {
            preprocess: require("svelte-preprocess")({tsconfigFile: "./frontend.tsconfig.json"}),
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
  resolve: {
    alias: {
      svelte: path.resolve("node_modules", "svelte"),
    },
    extensions: [".ts", ".js", ".svelte"],
    mainFields: ["svelte", "browser", "module", "main"],
  },
  },
  entry: {
    index: "./src/frontend/index.ts",
  },
  output: {
    filename: "[name].js",
  },
};
