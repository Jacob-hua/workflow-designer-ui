import modules, { mutationsEffectBill } from "./module";
import listeners from "./listener";
import { vuexNamespace } from "../config";

/**
 * 桥接Bpmn和Vuex
 * 主要工作：
 * - 动态注册bpmn的modules
 * - 注册bpmn事件监听
 * - 订阅Vuex的mutation提交
 * @param {*} store
 */
function bridgingBpmn(store) {
  if (!store.hasModule(vuexNamespace)) {
    store.registerModule(vuexNamespace, {
      modules,
      namespaced: true,
    });
  }

  regisetrBpmnListeners(listeners);

  mutationElementProperties(store);

  function mutationElementProperties(store) {
    store.subscribe((mutation, state) => {
      if (isNotEffectMutation(mutation)) {
        return;
      }
      const iBpmn = store._vm.$iBpmn;
      const effect = mutationsEffectBill[mutation.type].effect ?? (() => {});
      const module = mutationsEffectBill[mutation.type].module;
      effect(state[vuexNamespace][module], iBpmn);
    });
  }

  function regisetrBpmnListeners(listeners) {
    Object.keys(listeners).forEach((listenerKey) => {
      registerBpmnListener(store, listenerKey, listeners[listenerKey]);
    });
  }

  function registerBpmnListener(store, module, listeners = {}) {
    const iBpmn = store._vm.$iBpmn;
    Object.keys(listeners).forEach((eventName) => {
      iBpmn.on(eventName, (event) => {
        listeners[eventName](event, moduleCommit(store, module), iBpmn);
      });
    });
  }

  function isNotEffectMutation(mutation) {
    return !mutationsEffectBill[mutation.type];
  }

  function moduleCommit(store, module) {
    return function (path, payload = {}) {
      store.commit(generateCommitMutationPath(module, path), payload);
    };
  }

  function generateCommitMutationPath(module, path) {
    return `${vuexNamespace}/${module}/${path}`;
  }
}

const bpmnVuexPlugin = (store) => {
  if (store._vm.$iBpmn) {
    bridgingBpmn(store);
  } else {
    setTimeout(() => {
      bridgingBpmn(store);
    });
  }
};

export default bpmnVuexPlugin;
