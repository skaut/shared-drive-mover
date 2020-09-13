const HtmlWebpackPlugin = require("html-webpack-plugin");
const ScriptExtHtmlWebPackPlugin = require("script-ext-html-webpack-plugin");
const VueLoaderPlugin = require("vue-loader/lib/plugin");

module.exports = {
  mode: "development",
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/frontend/index.html",
    }),
    new ScriptExtHtmlWebPackPlugin({
      inline: /\.js$/,
    }),
    new VueLoaderPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader",
      },
      {
        test: /\.ts$/,
        loader: "ts-loader",
        options: {
          appendTsSuffixTo: [/\.vue$/],
        },
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          "vue-style-loader",
          {
            loader: "css-loader",
            options: {
              esModule: false,
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  entry: {
    index: "./src/frontend/index.ts",
  },
  output: {
    filename: "[name].js",
  },
};
