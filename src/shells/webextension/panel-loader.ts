// This is the entry point for the dev-tools panel, within the standard chrome dev-tools container (F12).

/* global chrome */

let panelCreated = false;
let loadCheckInterval;
function createPanelIfMobxLoaded() {
	if (panelCreated) {
		return;
	}
	chrome.devtools.inspectedWindow.eval(
		"!!(Object.keys(window.__MOBX_DEVTOOLS_GLOBAL_HOOK__.collections).length)",
		//"window.__MOBX_DEVTOOLS_GLOBAL_HOOK__ != null",
		pageHasMobx=>{
			//console.log("Page has mobx:", pageHasMobx);
			if (!pageHasMobx) {
				//console.log("MobX dev-tools: MobX not found on page, so not creating extension's dev-tools panel.");
				return;
			}
			if (panelCreated) {
				//console.log("MobX dev-tools: Extension panel already created, so not recreating.");
				return;
			}
			console.log("MobX dev-tools: Creating extension panel.");

			clearInterval(loadCheckInterval);
			panelCreated = true;
			chrome.devtools.panels.create("MobX+", "", "panel.html", ()=>{});
		},
	);
}

chrome.devtools.network.onNavigated.addListener(createPanelIfMobxLoaded);

loadCheckInterval = setInterval(createPanelIfMobxLoaded, 1000);

createPanelIfMobxLoaded();