const path = require('path');
const GasPlugin = require("gas-webpack-plugin");

module.exports = {
	mode: 'development',
	devtool: false,
	plugins: [
		new GasPlugin()
	],
	module: {
		rules: [
			{
				test: /\.ts$/,
				loader: 'ts-loader',
				exclude: /node_modules/
			},
		]
	},
	resolve: {
		extensions: ['.ts', '.js']
	},
	entry: {
		backend: './src/backend/backend.ts',
	},
	output: {
		filename: '[name].gs',
		path: path.resolve(__dirname, 'dist')
	}
};
