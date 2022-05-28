import bpmn, { iBpmnListener } from "../module/bpmn";

const MODULE_NAME = "bpmn";
const REFRESH_STATE_MUTATION = "refreshBpmnState";

function listenBpmn(store) {
  const iBpmn = store._vm.$iBpmn;

  if (!store.hasModule(MODULE_NAME)) {
    store.registerModule(MODULE_NAME, bpmn);
  }

  store.subscribe((mutation, state) => {
    if (!isBpmnMutation(mutation) || mutation.type === `${MODULE_NAME}/${REFRESH_STATE_MUTATION}`) {
      return;
    }
    iBpmn.updateSelectedShapeProperties(state.bpmn);
  });

  registerBpmnListener(iBpmnListener);

  function registerBpmnListener(bpmnListeners = {}) {
    Object.keys(bpmnListeners).forEach((eventName) => {
      iBpmn.on(eventName, (event) => {
        const modelElementInfo = bpmnListeners[eventName](event, refreshBpmnState);
        if (!modelElementInfo) {
          return;
        }
        refreshBpmnState(modelElementInfo);
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

const bpmnStorePlugin = (store) => {
  if (store._vm.$iBpmn) {
    listenBpmn(store);
  } else {
    setTimeout(() => {
      listenBpmn(store);
    });
  }
};

export default bpmnStorePlugin;
