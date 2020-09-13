const CopyPlugin = require('copy-webpack-plugin');
const IgnoreAssetsWebpackPlugin = require('ignore-assets-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
	mode: 'development',
	plugins: [
		//new CleanWebpackPlugin(),
		new CopyPlugin({
			patterns: [
				{from: 'src/appsscript.json', to: '.'}
			]
		}),
		new IgnoreAssetsWebpackPlugin({ignore: 'index.js'}),
	],
	entry: {
		index: './src/appsscript.json'
	}
};
