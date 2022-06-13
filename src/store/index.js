function loadModules() {
  const requireModule = require.context("./module", false, /\.js$/);
  const modules = requireModule.keys().reduce((modules, modulePath) => {
    const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, "$1");
    modules[moduleName] = requireModule(modulePath).default;
    return modules;
  }, {});
  return modules;
}

export default loadModules();
