# Hacking

## Preparation

- Run: `git submodule update --init`
- Run: `npm install`

## Start the test project

- Run: `npm run start-playground-plain`

## Chrome extension

- Run: `npm run start:chrome`
- Go to `chrome://extensions`, check "developer mode", click "Load unpacked extension", and select directory `lib/chrome`.
  
## Firefox extension

- Run: `npm run start:firefox`
- Go to `about:debugging`, check "Enable add-on debugging", click "Load Temporary Add-on", and select file `lib/firefox/manifest.json`.