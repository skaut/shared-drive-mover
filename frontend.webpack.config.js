import HtmlWebpackPlugin from "html-webpack-plugin";
import path from "path";
import sveltePreprocess from "svelte-preprocess";

export default (_, options) => ({
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
        test: /\.svelte$/u,
        use: {
          loader: "svelte-loader",
          options: {
            preprocess: sveltePreprocess({
              tsconfigFile: "./frontend.tsconfig.json",
              sourceMap: options.mode === "development",
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
  resolve: {
    alias: {
      svelte: path.resolve("node_modules", "svelte/src/runtime"),
    },
    conditionNames: ["svelte", "require", "node"],
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
});
