import modules from "./module";
import listeners from "./listener";
import { vuexNamespace } from "../config";
import ListenerConvertor from "./convertor/ListenerConvertor";

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
      if (isNotBpmnMutation(mutation) || isRefreshStateMutation(mutation)) {
        return;
      }
      const iBpmn = store._vm.$iBpmn;
      iBpmn.updateSelectedShapeProperties(state.bpmn["panel"]);
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

  function isNotBpmnMutation(mutation) {
    const mutationType = mutation?.type ?? "";
    return !mutationType.startsWith(`${vuexNamespace}/panel`);
  }

  function isRefreshStateMutation(mutation) {
    const reg = new RegExp(`^${vuexNamespace}\/[a-zA-Z\d]*\/refreshState$`);
    return reg.test(mutation?.type ?? "");
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
