/* eslint-env node */

const { merge } = require("webpack-merge");
const prod = require("./frontend.webpack.config.js");

module.exports = (env, options) =>
  merge(
    {
      module: {
        rules: [
          {
            test: /src\/frontend\/.*\.(ts|svelte)$/,
            use: {
              loader: "coverage-istanbul-loader",
              options: {
                extension: [".svelte", ".js", ".ts"],
              },
            },
          },
        ],
      },
    },
    prod(env, options)
  );
