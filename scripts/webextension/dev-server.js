const WebpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const config = require('../../src/shells/webextension/webpack.config.js');
const path = require('path');
const StringReplacerPlugin = require('webpack-string-replacer');

const { TARGET_BROWSER } = process.env;
const rootDir = path.join(__dirname, '../../');

require('./prepare');

const HR_PORT = 5000;

/* for (const entryName in config.entry) {
  if (Object.prototype.hasOwnProperty.call(config.entry, entryName)) {
    config.entry[entryName] = [
      // `webpack-dev-server/client?http://localhost:${HR_PORT}/`,
      // 'webpack-dev-server/client', // old; this already gets added automatically by WebpackDevServer below
      // 'webpack/hot/dev-server',
    ].concat(config.entry[entryName]);
    // console.log("Paths:", config.entry[entryName]);
  }
} */

// config.plugins = [new webpack.HotModuleReplacementPlugin()].concat(config.plugins || []);

// hacky fix for webpack-dev-server causing the (non-extension) page to reload on any changes to dev-tools source!
// (normally, the changes are UI only, so no need to reload the content-script or page)
config.plugins.push(new StringReplacerPlugin({
  rules: [{
    applyStage: 'optimizeChunkAssets',
    outputFileInclude: [
      'injectGlobalHook.js',
      'backend.js',
      'contentScript.js',
    ],
    replacements: [
      {
        pattern: '.location.reload()',
        replacement: ';//.location.reload()',
      },
    ],
  }],
}));

// maybe temp; disable warnings for webpack output (so webpack doesn't get flooded with them)
config.plugins.push({
  apply(compiler) {
    compiler.plugin('emit', (compilation, cb) => {
      compilation.warnings = [];
      cb();
    });
  },
});

const compiler = webpack(config);

const server = new WebpackDevServer(compiler, {
  // host: `http://localhost:${HR_PORT}`,
  host: 'localhost',
  port: HR_PORT,
  disableHostCheck: true,
  // sockHost: 'localhost',
  // sockPort: HR_PORT,
  // hot: true,
  hot: false,
  liveReload: true, // even though only live-reload is enabled, it somehow ends up refreshing the (non-extension) page itself as well!
  contentBase: path.join(rootDir, 'lib', TARGET_BROWSER),
  headers: { 'Access-Control-Allow-Origin': '*' },
  stats: {
    warnings: false,
  },
  quiet: true, // stops message spam in page console (for when run locally)
});

server.listen(HR_PORT);
