<template>
  <div>
    <div class="process-title">
      <div v-for="({ label, value }, index) in processDisplayInfo" :key="index">
        <span>{{ label }}</span>
        :
        <span>{{ value }}</span>
      </div>
    </div>
    <slot></slot>
    <div class="tip-box" @click="handleShowProcess">
      <div v-show="!showProcess">
        <span>查看流程信息</span>
        <i class="el-icon-arrow-right" />
      </div>
      <div v-show="showProcess">
        <span>关闭流程信息</span>
        <i class="el-icon-arrow-down" />
      </div>
    </div>
    <div class="process-canvas" v-show="showProcess">
      <bpmn-viewer
        :visible="showProcess"
        :xml="xml"
        :prop="{
          bpmnRenderer: {
            defaultFillColor: 'none',
            defaultStrokeColor: '#666666',
            defaultLabelColor: '#666666',
          },
        }"
        :selectedChanged="onSelectedChange"
        @loaded="onBpmnViewerLoaded"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "BpmnInfo",
  props: {
    xml: {
      type: String,
      default: "",
    },
    processDisplayInfo: {
      type: Array,
      default: () => [],
    },
    showProcess: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      showProcess: false,
      iBpmnViewer: null,
    };
  },
  methods: {
    onBpmnViewerLoaded(iBpmnViewer) {
      this.iBpmnViewer = iBpmnViewer;
      this.$emit("loaded", iBpmnViewer);
    },
    onSelectedChange(shape, iBpmnViewer) {
      this.$emit("selectedShape", shape, iBpmnViewer);
    },
    handleShowProcess() {
      this.showProcess = !this.showProcess;
    },
  },
};
</script>

<style scoped lang="scss">
.process-title {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  align-content: space-around;
  color: $font-color;
  line-height: 40px;
}
.tip-box {
  cursor: pointer;
  color: #009efb;
  margin: 20px;
}

.process-canvas {
  height: 400px;
  border: 1px solid $border-color;
}
</style>
