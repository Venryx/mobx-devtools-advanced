const path = require("path");
const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const WebpackStringReplacer = require("webpack-string-replacer");
const config = require("../../src/shells/webextension/webpack.config");
require("./prepare");

const {TARGET_BROWSER} = process.env;
const rootDir = path.join(__dirname, "../../");

const HR_PORT = 5000;

// hacky fix for webpack-dev-server causing the (non-extension) page to reload on any changes to dev-tools source!
// (normally, the changes are UI only, so no need to reload the content-script or page)
/*config.plugins.push(new WebpackStringReplacer({
	//logOutputFilePaths: true,
	logFileMatches: true,
	//logFileMatchContents: 1000,
	//logAroundPatternMatches: 200,
	rules: [{
		applyStage: "optimizeChunkAssets",
		outputFileInclude: [
			"injectGlobalHook.js",
			"backend.js",
			"contentScript.js",
		],
		outputFileMatchCount: {min: 1},
		replacements: [
			{
				pattern: ".location.reload()",
				patternMatchCount: {min: 1},
				replacement: ";//.location.reload()",
			},
		],
	}],
}));*/

// maybe temp; disable warnings for webpack output (so webpack doesn't get flooded with them)
config.plugins.push({
	apply(compiler) {
		compiler.plugin("emit", (compilation, cb)=>{
			compilation.warnings = [];
			cb();
		});
	},
});

const compiler = webpack(config);

const server = new WebpackDevServer(compiler, {
	// host: `http://localhost:${HR_PORT}`,
	host: "localhost",
	port: HR_PORT,
	disableHostCheck: true,
	// sockHost: 'localhost',
	// sockPort: HR_PORT,
	// hot: true,
	hot: false,
	liveReload: true, // even though only live-reload is enabled, it somehow ends up refreshing the (non-extension) page itself as well!
	contentBase: path.join(rootDir, "lib", TARGET_BROWSER),
	headers: {"Access-Control-Allow-Origin": "*"},
	stats: {
		warnings: false,
	},
	//quiet: true, // stops message spam in page console (for when run locally)
});

server.listen(HR_PORT);