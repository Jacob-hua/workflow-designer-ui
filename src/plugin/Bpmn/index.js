import IBpmn from "./iBpmn";
import BpmnEditor from "./components/BpmnEditor";
import BpmnPropertiesPanel from "./components/BpmnPropertiesPanel";

import bpmnVuexPlugin from "./store";

const components = [BpmnEditor, BpmnPropertiesPanel];

const install = (Vue, payload = {}) => {
  if (install.installed) {
    return;
  }
  if (Vue && !Vue.$iBpmn) {
    Vue.prototype.$iBpmn = new IBpmn(payload);
  }
  components.forEach((component) => Vue.component(component.name, component));
};

if (window && window.Vue) {
  install(window.Vue);
}

export { bpmnVuexPlugin };

export default {
  install,
  BpmnEditor,
  BpmnPropertiesPanel,
};
