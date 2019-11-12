/* eslint-disable */

// For test environment
// Evaling so that webpack doesn't complain about using require.extensions.
const requireExtensions = eval("typeof require === 'function' && require.extensions");
if (module.webpackPolyfill === undefined && requireExtensions) {
  requireExtensions['.svg'] = module => `SKIPPED_SVG<${module.filename}>`;
}

export const panel = {
  position: 'fixed',
  height: '26px',
  backgroundColor: '#fff',
  color: 'rgba(0, 0, 0, 0.8)',
  borderRadius: '0 0 2px 2px',
  borderStyle: 'solid',
  borderWidth: '0 1px 1px',
  borderColor: 'rgba(0, 0, 0, 0.1)',
  zIndex: '65000',
  fontFamily: 'Helvetica, sans-serif',
  display: 'flex',
  padding: '0 5px',
};

export const button = {
  opacity: 0.45,
  background: 'transparent none center / 16px 16px no-repeat',
  width: '26px',
  margin: '0 10px',
  cursor: 'pointer',
  border: 'none',
  outline: 'none',
  hover: {
    opacity: 0.7,
  },
  active: {
    opacity: 1,
    ':hover': {
      opacity: 1,
    },
  },
};

export const buttonLog = {
  backgroundImage: `url(${require('./log.svg')})`,
};

export const buttonLogActive = {
  backgroundImage: `url(${require('./log-active.svg')})`,
};

export const buttonConsoleLog = {
  backgroundImage: `url(${require('./console-log.svg')})`,
};

export const buttonConsoleLogActive = {
  backgroundImage: `url(${require('./console-log-active.svg')})`,
};

export const buttonUpdates = {
  backgroundImage: `url(${require('./updates.svg')})`,
};

export const buttonUpdatesActive = {
  backgroundImage: `url(${require('./updates-active.svg')})`,
};

export const buttonGraph = {
  backgroundImage: `url(${require('./graph.svg')})`,
};

export const buttonGraphActive = {
  backgroundImage: `url(${require('./graph-active.svg')})`,
};

export const buttonClear = {
  backgroundImage: `url(${require('./clear.svg')})`,
};
