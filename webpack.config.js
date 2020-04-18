const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebPackPlugin = require('script-ext-html-webpack-plugin');
const IgnoreAssetsWebpackPlugin = require('ignore-assets-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const GasPlugin = require("gas-webpack-plugin");

module.exports = [
	{
		mode: 'development',
		plugins: [
			new CleanWebpackPlugin(),
			new CopyPlugin([
				{from: 'src/appsscript.json', to: '.'}
			]),
			new IgnoreAssetsWebpackPlugin({ignore: 'index.js'}),
		],
		entry: {
			index: './src/appsscript.json'
		}
	},
	{
		mode: 'development',
		plugins: [
			new HtmlWebpackPlugin({
				template: 'src/frontend/index.html'
			}),
			new ScriptExtHtmlWebPackPlugin({
				inline: /\.js$/
			}),
			new IgnoreAssetsWebpackPlugin({ignore: 'index.js'}),
			new VueLoaderPlugin()
		],
		module: {
			rules: [
				{
					test: /\.vue$/,
					loader: 'vue-loader'
				},
				{
					test: /\.ts$/,
					loader: 'ts-loader',
					options: {
						appendTsSuffixTo: [/\.vue$/]
					},
					exclude: /node_modules/
				},
				{
					test: /\.css$/,
					use: ['vue-style-loader', 'css-loader']
				}
			]
		},
		resolve: {
			extensions: ['.ts', '.js']
		},
		entry: {
			index: './src/frontend/index.ts'
		},
		output: {
			filename: '[name].js',
			path: path.resolve(__dirname, 'dist')
		}
	},
	{
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
	}
];
