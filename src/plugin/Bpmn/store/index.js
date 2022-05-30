import bpmn, { iBpmnListener } from "./module/bpmn";

const MODULE_NAME = "bpmn";
const REFRESH_STATE_MUTATION = "refreshBpmnState";

function listenBpmn(store) {
  const iBpmn = store._vm.$iBpmn;

  if (!store.hasModule(MODULE_NAME)) {
    store.registerModule(MODULE_NAME, bpmn);
  }

  mutationBpmnProperties(iBpmn, store);

  registerBpmnListener(iBpmn, iBpmnListener);

  function mutationBpmnProperties(iBpmn, store) {
    store.subscribe((mutation, state) => {
      if (!isBpmnMutation(mutation) || mutation.type === `${MODULE_NAME}/${REFRESH_STATE_MUTATION}`) {
        return;
      }
      iBpmn.updateSelectedShapeProperties(state.bpmn);
    });
  }

  function registerBpmnListener(iBpmn, bpmnListeners = {}) {
    Object.keys(bpmnListeners).forEach((eventName) => {
      iBpmn.on(eventName, (event) => {
        const modelElementInfo = bpmnListeners[eventName](event);
        if (modelElementInfo) {
          refreshBpmnState(modelElementInfo);
        }
      });
    });
  }

  function refreshBpmnState(payload = {}) {
    store.commit(`${MODULE_NAME}/${REFRESH_STATE_MUTATION}`, payload);
  }

  function isBpmnMutation(mutation) {
    const mutationType = mutation.type ?? "";
    return mutationType.startsWith(`${MODULE_NAME}/`);
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
