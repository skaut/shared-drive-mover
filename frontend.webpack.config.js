import HtmlWebpackPlugin from "html-webpack-plugin";
import path from "path";
import { sveltePreprocess } from "svelte-preprocess";

export default (_, options) => ({
  entry: {
    index: "./src/frontend/index.ts",
  },
  mode: "production",
  module: {
    rules: [
      {
        test: /\.svelte$/u,
        use: {
          loader: "svelte-loader",
          options: {
            preprocess: sveltePreprocess({
              sourceMap: options.mode === "development",
              tsconfigFile: "./frontend.tsconfig.json",
            }),
          },
        },
      },
      {
        test: /\.ts$/u,
        use: {
          loader: "ts-loader",
          options: {
            onlyCompileBundledFiles: true,
          },
        },
      },
      {
        test: /\.css$/u,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(sa|sc)ss$/u,
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
  output: {
    filename: "[name].js",
    publicPath: "",
  },
  performance: {
    hints: false,
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: false,
      minify: false,
      template: "src/frontend/index.html",
    }),
  ],
  resolve: {
    alias: {
      svelte: path.resolve("node_modules", "svelte/src/runtime"),
    },
    conditionNames: ["svelte", "require", "node"],
    extensions: [".ts", ".js", ".svelte"],
    mainFields: ["svelte", "browser", "module", "main"],
  },
});
