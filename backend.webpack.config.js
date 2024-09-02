import GasPlugin from "gas-webpack-plugin";

export default {
  entry: {
    doGet: "./src/backend/index.ts",
  },
  mode: "production",
  module: {
    rules: [
      {
        test: /\.ts$/u,
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
  output: {
    filename: "backend.gs",
  },
  plugins: [new GasPlugin()],
  resolve: {
    extensions: [".ts", ".js"],
  },
};
