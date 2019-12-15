/* eslint-disable camelcase */
const del = require('del');
const fs = require('fs');
const manifest = require('../../src/shells/webextension/manifest.json');
const path = require('path');
const lernaJson = require('../../lerna.json');
const { TARGET_BROWSER, NODE_ENV } = process.env;
const rootDir = path.join(__dirname, '../../');
if (!TARGET_BROWSER) {
    throw new Error('TARGET_BROWSER is required');
}
// Prepare folder
del.sync([path.join(rootDir, `lib/${TARGET_BROWSER}.zip`), path.join(rootDir, `lib/${TARGET_BROWSER}/**`)]);
if (!fs.existsSync(path.join(rootDir, 'lib')))
    fs.mkdirSync(path.join(rootDir, 'lib'));
if (!fs.existsSync(path.join(rootDir, `lib/${TARGET_BROWSER}`)))
    fs.mkdirSync(path.join(rootDir, `lib/${TARGET_BROWSER}`));
// Generate manifest.json
manifest.description = 'Dev-tools for MobX and React';
manifest.version = lernaJson.version;
manifest.version_name = lernaJson.version + (NODE_ENV === 'development' ? '-dev' : '');
if (TARGET_BROWSER === 'chrome') {
    delete manifest.applications;
}
fs.writeFileSync(path.join(rootDir, `lib/${TARGET_BROWSER}/manifest.json`), JSON.stringify(manifest));
