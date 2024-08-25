import { merge } from "webpack-merge";

import prod from "./frontend.webpack.config.js";

export default (env, options) =>
  merge(
    {
      module: {
        rules: [
          {
            test: /src\/frontend\/.*\.(ts|svelte)$/,
            use: {
              loader: "webpack-plugin-istanbul/loader",
              options: {
                extension: [".svelte", ".js", ".ts"],
              },
            },
          },
        ],
      },
    },
    prod(env, options),
  );
