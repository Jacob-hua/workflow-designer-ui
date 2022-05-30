const requireListener = require.context(".", false, /\.js$/);
const listeners = requireListener.keys().reduce((listeners, listenerPath) => {
  const listenerName = listenerPath.replace(/^\.\/(.*)\.\w+$/, "$1");
  if (listenerName === "index") {
    return listeners;
  }
  listeners[listenerName] = requireListener(listenerPath).default;
  return listeners;
}, {});

export default listeners;
