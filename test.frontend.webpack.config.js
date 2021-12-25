/* eslint-env node */

const { merge } = require("webpack-merge");
const prod = require("./frontend.webpack.config.js");

module.exports = merge(
  {
    module: {
      rules: [
        {
          test: /\.(ts|svelte)$/,
          use: {
            loader: "babel-loader",
            options: {
              plugins: [
                [
                  "istanbul",
                  {
                    extension: [".svelte", ".js", ".ts"],
                  },
                ],
              ],
            },
          },
        },
      ],
    },
  },
  prod
);
