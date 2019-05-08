const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  plugins: [
    new CopyPlugin([
      {from: 'src/appsscript.json', to: '.'},
      {from: 'src/backend', to: '.'},
      {from: 'src/frontend', to: '.'}
    ])
  ],
  entry: './src/main.js',
  output: {
    filename: 'main.bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};
