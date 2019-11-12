const LS_KEY = '@@mobx-devtools';
const getLSSettings = () => {
  try {
    return JSON.parse(window.localStorage.getItem(LS_KEY)) || {};
  } catch (e) {
    return {};
  }
};
const setLSSettings = (settings) => {
  window.localStorage.setItem(LS_KEY, JSON.stringify(Object.assign({}, getLSSettings(), settings)));
};

const memoryStorage = {};

export default {
  get(...keys) {
    if (__DEV__ && typeof keys[0] !== 'string') {
      // eslint-disable-next-line no-console
      console.warn(`[preferences] get() expected strings, given ${typeof keys[0]}`);
    }
    return new Promise((resolve) => {
      if (chrome.storage) {
        chrome.storage.sync.get(keys, resolve);
      } else if (window.localStorage) {
        const settings = getLSSettings();
        resolve(keys.reduce((acc, key) => ({ ...acc, [key]: settings[key] }), {}));
      } else {
        resolve(keys.reduce((acc, key) => ({ ...acc, [key]: memoryStorage[key] })), {});
      }
    });
  },

  set(settings) {
    return new Promise((resolve) => {
      if (chrome.storage) {
        chrome.storage.sync.set(settings, resolve);
      } else if (window.localStorage) {
        setLSSettings(settings);
        resolve();
      } else {
        for (const key in settings) {
          if (Object.prototype.hasOwnProperty.call(settings, key)) {
            memoryStorage[key] = settings[key];
          }
        }
      }
    });
  },

  delete(key) {
    return new Promise((resolve) => {
      if (chrome.storage) {
        chrome.storage.sync.remove(key, resolve);
      } else if (window.localStorage) {
        setLSSettings({ [key]: undefined });
        resolve();
      } else {
        delete memoryStorage[key];
      }
    });
  },
};
