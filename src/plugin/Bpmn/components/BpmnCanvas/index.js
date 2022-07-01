import BpmnCanvas from "./BpmnCanvas.vue";

BpmnCanvas.install = (Vue) => {
  Vue.compoent(BpmnCanvas.name, BpmnCanvas)
};

export default BpmnCanvas;
