import IBpmn from "./iBpmn";
import BpmnEditor from "./components/BpmnEditor";
import BpmnPropertiesPanel from "./components/BpmnPropertiesPanel";

import bpmnStore from "./store";

const components = [BpmnEditor, BpmnPropertiesPanel];

const install = (Vue, payload = {}) => {
  if (install.installed) {
    return;
  }
  if (Vue && !Vue.$iBpmn) {
    Vue.prototype.$iBpmn = new IBpmn(payload);
  }
  if (Vue && !Vue.$store) {
    // Vue.prototype.$store = store;
  }
  components.forEach((component) => Vue.component(component.name, component));
};

if (window && window.Vue) {
  install(window.Vue);
}

export default {
  install,
  BpmnEditor,
  BpmnPropertiesPanel,
  bpmnStore,
};
