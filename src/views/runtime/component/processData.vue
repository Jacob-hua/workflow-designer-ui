<template>
  <div class="Process-bpmn">
    <span class="bpmn-Main-title">BPMN流程</span>
    <div class="my-process-designer__canvas" ref="bpmn-canvas"></div>
  </div>
</template>

<script>
  import BpmnModeler from "bpmn-js/lib/Modeler";
  import DefaultEmptyXML from "@/components/package/designer/plugins/defaultEmpty";
  import bpmnData from "@/assets/js/bpmnMock.js"
  export default {
    data() {
      return {

      }
    },
    methods: {
      initBpmnModeler() {
        if (this.bpmnModeler) return;
        this.bpmnModeler = new BpmnModeler({
          container: this.$refs["bpmn-canvas"],
          additionalModules: [],
          moddleExtensions: [],
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
        this.bpmnModeler.on("selection.changed", ({
          newSelection
        }) => {
          if (newSelection[0]) {
            window.bpmnInstances.elementRegistry.forEach((item) => {
             if (item.id !== 'task3') {
               window.bpmnInstances.modeling.setColor(item, {
                 'fill': '#ffffff'
               })
             }
            })
            window.bpmnInstances.modeling.setColor(newSelection[0], {
              'fill': '#b2b2ff',
            })
            this.$emit('selection', newSelection[0])
          }
        });
        this.createNewDiagram(bpmnData.value)
      },
      async createNewDiagram(xml) {
        // 将字符串转换成图显示出来
        let newId = this.processId || `Process_${new Date().getTime()}`;
        let newName = this.processName || `业务流程_${new Date().getTime()}`;
        let xmlString = xml || DefaultEmptyXML(newId, newName, this.prefix);
        try {
          let {
            warnings
          } = await this.bpmnModeler.importXML(xmlString);
          if (warnings && warnings.length) {
            warnings.forEach(warn => console.warn(warn));
          }
          let oneSet = window.bpmnInstances.elementRegistry.filter((element) => {
            return element.id === "task3"
          })
          window.bpmnInstances.modeling.setColor(oneSet[0], {
            'fill': '#cccccc',
            // 'stroke': '#1890ff'
          })
          // task3
        } catch (e) {
          console.error(`[Process Designer Warn]: ${e?.message || e}`);
        }
      },
    },
    mounted() {
      this.initBpmnModeler()
      this.$once("hook:beforeDestroy", () => {
        if (this.bpmnModeler) this.bpmnModeler.destroy();
        this.$emit("destroy", this.bpmnModeler);
        this.bpmnModeler = null;
      });
    },
    beforeDestroy() {
      window.bpmnInstances = null;
    }
  }
</script>

<style scoped="scoped">
  .Process-bpmn {
    height: 400px;
    border: 1px solid black;
    position: relative;
  }

  .bpmn-Main-title {
    position: absolute;
    font-weight: 700;
    color: black;
    font-size: 13px;
    top: 10px;
    left: 10px;
  }

  .my-process-designer__canvas {
    height: 100%;
  }

  /deep/ .djs-palette {
    display: none;
  }

  /deep/ .djs-context-pad {
    display: none;
  }
</style>
