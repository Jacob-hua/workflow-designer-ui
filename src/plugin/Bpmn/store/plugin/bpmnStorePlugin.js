import { iBpmnListener } from "../module/bpmn";

function listenBpmn(store) {
  const iBpmn = store._vm.$iBpmn;
  store.$iBpmn = iBpmn;

  function refreshBpmnState(payload = {}) {
    store.commit("bpmn/refreshBpmnState", payload);
  }

  function handleIBpmnEvent(eventName) {
    return function (event) {
      iBpmnListener[eventName](event, refreshBpmnState);
    };
  }

  Object.keys(iBpmnListener).forEach((eventName) => {
    iBpmn.on(eventName, handleIBpmnEvent(eventName));
  });
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
