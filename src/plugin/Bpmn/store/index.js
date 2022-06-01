import modules, { mutationsEffectBill } from "./module";
import listeners from "./listener";
import { vuexNamespace } from "../config";

function listenBpmn(store) {
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
      const Convertor = mutationsEffectBill[mutation.type].convertor;
      if (!Convertor) {
        return;
      }
      const properties = new Convertor({ iBpmn, state: state.bpmn["panel"] }).convert();
      iBpmn.updateSelectedShapeExtensions(properties);
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
    return !mutationsEffectBill[mutation.type] || !mutationsEffectBill[mutation.type].effectBpmn;
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
    listenBpmn(store);
  } else {
    setTimeout(() => {
      listenBpmn(store);
    });
  }
};

export default bpmnVuexPlugin;
