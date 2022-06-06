import modules, { mutationsEffectBill, eventsListenerBill } from "./module";
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

  regisetrBpmnListeners(store);

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

  function regisetrBpmnListeners(store) {
    Object.keys(eventsListenerBill).forEach((eventName) => {
      const { module, listeners } = eventsListenerBill[eventName];
      registerBpmnListener(eventName, listeners, store, module);
    });
  }

  function registerBpmnListener(eventName, listeners, store, module) {
    const iBpmn = store._vm.$iBpmn;
    listeners.forEach((listener) => {
      iBpmn.on(eventName, (event) => {
        listener(event, moduleCommit(store, module), iBpmn);
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
