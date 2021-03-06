const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WriteFilePlugin = require("write-file-webpack-plugin");

const rootDir = path.join(__dirname, "../../../");

module.exports = {
	mode: "none",
	devtool: false,
	optimization: {
		// use paths as runtime identifiers for webpack modules (easier debugging)
		// namedModules: true, // commented; not needed, since "output.pathinfo=true"
		//noEmitOnErrors: true, // NoEmitOnErrorsPlugin
	},
	entry: {
		backend: path.join(__dirname, "backend.ts"),
		background: path.join(__dirname, "background.ts"),
		injectGlobalHook: path.join(__dirname, "injectGlobalHook.ts"),
		contentScript: path.join(__dirname, "contentScript.ts"),
		panel: path.join(__dirname, "panel.tsx"),
		"panel-loader": path.join(__dirname, "panel-loader.ts"),
		window: path.join(__dirname, "window.tsx"),
		icons: path.join(__dirname, "icons"),
	},
	output: {
		path: `${rootDir}/lib/${process.env.TARGET_BROWSER}`,
		filename: "[name].js",
		pathinfo: true, // include comments next to require-funcs saying path (easier debugging)
	},
	module: {
		rules: [
			{test: /\.tsx?$/, loader: "ts-loader"},
			{
				test: /\.jsx?$/,
				loader: "babel-loader",
				exclude: /node_modules/,
				query: {
					cacheDirectory: true,
					presets: [
						"@babel/env",
						"@babel/react",
					],
					plugins: [
						[
							"@babel/plugin-proposal-decorators",
							{
								//decoratorsBeforeExport: true,
								legacy: true,
							},
						],
						"transform-class-properties",
					],
				},
			},
			{
				test: /icons[/\\].*\.(png|svg)$/,
				loader: "file-loader?name=icons/[name].[ext]",
				exclude: /node_modules/,
			},
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				loader: "eslint-loader",
				options: {
					failOnWarning: false,
					failOnError: process.env.NODE_ENV !== "development",
					//fix: process.env.NODE_ENV === "development",
					cache: false,
				},
			},
			{
				test: /\.(png|svg)$/,
				loader: "url-loader",
				exclude: /icons\//,
			},
			{
				test: /\.(eot|ttf|woff2?)$/,
				loader: "file-loader?name=fonts/[name].[ext]",
			},
			{
				test: /\.css$/,
				loaders: ["style-loader", "css-loader"],
			},
		],
	},
	resolve: {
		extensions: [".js", ".jsx", ".ts", ".tsx"],
		alias: {
			// custom removed; don't see why need submodule for it
			/*"mobx-react": `${rootDir}/mobx-react/src`,
			mobx: `${rootDir}/mobx/src/mobx.ts`,*/
			aphrodite: "aphrodite/no-important",
		},
	},
	plugins: [
		new webpack.DefinePlugin({
			"process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
			__DEV__: JSON.stringify(process.env.NODE_ENV === "development"),
			__DEBUG_CONNECTION__: JSON.stringify(process.env.DEBUG_CONNECTION === "true"),
			__TARGET__: JSON.stringify("browser"),
		}),
		new HtmlWebpackPlugin({
			template: path.join(__dirname, "html/window.html"),
			filename: "window.html",
			chunks: ["window"],
		}),
		new HtmlWebpackPlugin({
			template: path.join(__dirname, "html/panel-loader.html"),
			filename: "panel-loader.html",
			chunks: ["panel-loader"],
		}),
		new HtmlWebpackPlugin({
			template: path.join(__dirname, "html/panel.html"),
			filename: "panel.html",
			chunks: ["panel"],
		}),
		new WriteFilePlugin(),
	],
};