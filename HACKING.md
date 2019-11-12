# Hacking

## Preparation

- Run: `git submodule update --init`
- Run: `yarn`

## Start the test project

- Run: `yarn start-playground-plain`


## Chrome extension

- Run: `yarn start:chrome`
- Copy the "html" and "icons" folders from "src/shells/webextension" into the "lib/chrome" folder.
- Go to `chrome://extensions`, check "developer mode", click "Loadunpacked extension", and select directory `lib/chrome`.
  
  
## Firefox extension

- Run: `yarn start:firefox`
- Go to `about:debugging`, check "Enable add-on debugging", click "Load Temporary Add-on", and select file `lib/firefox/manifest.json`.