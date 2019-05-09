const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');

module.exports = {
  mode: 'development',
  plugins: [
    new CopyPlugin([
      {from: 'src/appsscript.json', to: '.'},
      {from: 'src/backend', to: '.'},
      {from: 'src/frontend', to: '.'}
    ]),
    new HtmlWebpackPlugin({
      inlineSource: '.(js)$',
      template: 'src/frontend/index.html'
    }),
    new HtmlWebpackInlineSourcePlugin()
  ],
  entry: {
    frontend: './src/frontend/index.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  }
};
