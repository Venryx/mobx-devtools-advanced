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

// maybe temp; disable warnings for webpack output (so webpack doesn't get flooded with them)
config.plugins.push({
  apply(compiler) {
    compiler.plugin('emit', (compilation, cb) => {
      compilation.warnings = [];
      cb();
    });
  },
});

// hacky fix for webpack-dev-server causing the (non-extension) page to reload on any changes to dev-tools source!
// (normally, the changes are UI only, so no need to reload the content-script or page)
// config.plugins.splice(0, 0, new StringReplacerPlugin({ // place at start, to fix bug
/* config.plugins.push(new StringReplacerPlugin({
  // logFileMatches: true,
  // logFileMatchContents: true,
  logAroundPatternMatches: 200,
  rules: [{
    // stage: "readFromDisk",
    // bundleInclude: {entryPath: /injectGlobalHook.js$/},
    chunkInclude: { name: 'injectGlobalHook' },
    chunkMatchCount: 1,
    // include: /injectGlobalHook.js$/,
    // fileInclude: /webpack-dev-server\//,
    // include: /webpack-dev-server\/.+\/index.js/,
    // include: /webpack-dev-server\/.+\/reloadApp.js$/,
    // fileMatchCount: {min: 1},
    replacements: [
      {
        // pattern: 'rootWindow.location.reload();',
        pattern: '.location.reload()',
        // pattern: /\.location\.reload\(\)/g,
        // patternMatchCount: {min: 1},
        patternMatchCount: 4,
        // replacement: ';//.location.reload()',
        replacement: ';//.location.reload()',
        // replacement: ';//cation.reload()', // must match length of pattern, due to bug
      },
    ],
  }],
})); */
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
        replacement: ';//.location...reload()',
      },
    ],
  }],
}));

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
  /* contentBase: [
    path.join(rootDir, 'lib', TARGET_BROWSER, "panel.js"),
    path.join(rootDir, 'lib', TARGET_BROWSER, "window.js"),
  ], */
  headers: { 'Access-Control-Allow-Origin': '*' },
  /* proxy: {
    /* {
      context: ['injectGlobalHook.js'],
    }, *#/
    '/injectGlobalHook.js': {
      target: 'http://localhost:[port]/',
      pathRewrite: { '^/injectGlobalHook.js': '' },
    },
  }, */
  stats: {
    warnings: false,
  },
});

server.listen(HR_PORT);
