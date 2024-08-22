import GasPlugin from "gas-webpack-plugin";

export default {
  mode: "production",
  plugins: [new GasPlugin()],
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
