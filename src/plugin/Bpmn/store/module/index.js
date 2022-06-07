import { vuexNamespace } from "../../config";
import { deepCopy } from "../../utils/object";

function loadModules() {
  const requireModule = require.context(".", false, /\.js$/);
  const modules = requireModule.keys().reduce((modules, modulePath) => {
    const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, "$1");
    if (moduleName === "index") {
      return modules;
    }
    modules[moduleName] = requireModule(modulePath).default;
    return modules;
  }, {});
  return modules;
}

function checkModules(modules, moduleTemplate) {
  Object.keys(modules).forEach((moduleName) => {
    patchModule(modules[moduleName], moduleTemplate);
  });
}

function patchModule(module, moduleTemplate) {
  Object.keys(moduleTemplate)
    .filter((property) => !module.hasOwnProperty(property))
    .forEach((property) => {
      module[property] = moduleTemplate[property]();
    });
}

function cacheModuleState(modules) {
  const cache = Object.keys(modules).reduce((cache, moduleName) => {
    const module = modules[moduleName];
    cache[moduleName] = deepCopy(module.state ?? {});
    return cache;
  }, {});
  return cache;
}

function injectCommonMutations(modules, commonMutations) {
  Object.keys(modules).forEach((moduleName) => {
    const module = modules[moduleName];
    Object.keys(commonMutations)
      .filter((mutationKey) => !module.mutations.hasOwnProperty(mutationKey))
      .forEach((mutationKey) => {
        module.mutations[mutationKey] = commonMutations[mutationKey](moduleName);
      });
  });
}

function makeMutationsEffectBill(modules) {
  const result = Object.keys(modules).reduce((mutationsEffectBill, moduleName) => {
    const module = modules[moduleName];
    const bill = Object.keys(module.mutationsEffect).reduce(
      (effectBill, mutation) => ({
        ...effectBill,
        [`${vuexNamespace}/${moduleName}/${mutation}`]: {
          effect: module.mutationsEffect[mutation],
          module: moduleName,
        },
      }),
      {}
    );
    return { ...mutationsEffectBill, ...bill };
  }, {});
  return result;
}

function makeEventsListenerBill(modules) {
  const result = Object.keys(modules).reduce((eventsListener, moduleName) => {
    const module = modules[moduleName];
    Object.keys(module.eventsListener).forEach((eventName) => {
      if (!eventsListener[eventName]) {
        eventsListener[eventName] = {
          module: moduleName,
          listeners: [],
        };
      }
      eventsListener[eventName].listeners.push(module.eventsListener[eventName]);
    });
    return eventsListener;
  }, {});
  return result;
}

const modules = loadModules();

checkModules(modules, {
  state: () => ({}),
  getters: () => ({}),
  mutations: () => ({}),
  actions: () => ({}),
  namespaced: () => true,
  mutationsEffect: () => ({}),
  eventsListener: () => ({}),
});

const initialModuleState = cacheModuleState(modules);

const commonMutations = {
  refreshState() {
    return function (state, payload = {}) {
      Object.keys(payload).forEach((key) => {
        state[key] = payload[key];
      });
    };
  },
  initState(moduleName) {
    return function () {
      this.commit(`${vuexNamespace}/${moduleName}/refreshState`, deepCopy(initialModuleState[moduleName]));
    };
  },
};

injectCommonMutations(modules, commonMutations);

const mutationsEffectBill = makeMutationsEffectBill(modules);

const eventsListenerBill = makeEventsListenerBill(modules);

export { mutationsEffectBill, eventsListenerBill };

export default modules;
