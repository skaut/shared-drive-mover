/* eslint-env node */

const GasPlugin = require("gas-webpack-plugin");

module.exports = {
  mode: "production",
  plugins: [new GasPlugin()],
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: "ts-loader",
          options: {
            configFile: "backend.tsconfig.json",
            onlyCompileBundledFiles: true,
          },
        },
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  entry: {
    doGet: "./src/backend/index.ts",
  },
  output: {
    filename: "backend.gs",
  },
};
