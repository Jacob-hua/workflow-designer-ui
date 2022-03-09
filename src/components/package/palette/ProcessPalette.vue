<template>
  <div class="my-process-palette">
    
  </div>
</template>

<script>
import { assign } from "min-dash";

export default {
  name: "MyProcessPalette",
  data() {
    return {};
  },
  mounted() {},
  methods: {
    createElement(event, type, options = {}) {
      const ElementFactory = window.bpmnInstances.elementFactory;
      const create = window.bpmnInstances.modeler.get("create");
      const shape = ElementFactory.createShape(assign({ type: `bpmn:${type}` }, options));
      if (options) {
        shape.businessObject.di.isExpanded = options.isExpanded;
      }
      create.start(event, shape);
    },
    startTool(event, type) {
      if (type === "handTool") {
        window.bpmnInstances.modeler.get("handTool").activateHand(event);
      }
      if (type === "lassoTool") {
        window.bpmnInstances.modeler.get("lassoTool").activateSelection(event);
      }
      if (type === "connectTool") {
        window.bpmnInstances.modeler.get("globalConnect").toggle(event);
      }
    }
  }
};
</script>

<style scoped lang="scss">
.my-process-palette {
  box-sizing: border-box;
  padding: 8px;
  .custom-button {
    box-sizing: border-box;
    padding: 4px 8px;
    border-radius: 4px;
    border: 1px solid rgba(24, 144, 255, 0.8);
    cursor: pointer;
    margin-bottom: 8px;
    &:first-child {
      margin-top: 8px;
    }
  }
}
</style>
