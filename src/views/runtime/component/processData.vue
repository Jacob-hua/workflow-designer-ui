<template>
  <div class="Process-bpmn">
    <span class="bpmn-Main-title">BPMN流程</span>
    <div class="my-process-designer__canvas" ref="bpmn-canvas"></div>
  </div>
</template>

<script>
  import BpmnModeler from "bpmn-js/lib/Modeler";
  export default {
    data:
    methods: {
      initBpmnModeler() {
        if (this.bpmnModeler) return;
        this.bpmnModeler = new BpmnModeler({
          container: this.$refs["bpmn-canvas"],
          additionalModules: [],
          moddleExtensions: [],
        });
        this.bpmnModeler.on("selection.changed", ({ newSelection }) => {
            this.$emit('selection', newSelection[0] || null, this.bpmnModeler)
        });
        window.bpmnInstances = {
          modeler: this.bpmnModeler,
          modeling: this.bpmnModeler.get("modeling"),
          moddle: this.bpmnModeler.get("moddle"),
          eventBus: this.bpmnModeler.get("eventBus"),
          bpmnFactory: this.bpmnModeler.get("bpmnFactory"),
          elementFactory: this.bpmnModeler.get("elementFactory"),
          elementRegistry: this.bpmnModeler.get("elementRegistry"),
          replace: this.bpmnModeler.get("replace"),
          selection: this.bpmnModeler.get("selection")
        };
      },
    }
  }
</script>

<style scoped="scoped">
  
</style>
