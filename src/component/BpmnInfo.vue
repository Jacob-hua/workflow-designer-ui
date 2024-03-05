<template>
  <div>
    <div class="process-title">
      <el-card class="process-base-info">
        <div
          v-for="({ label, value }, index) in processDisplayInfo"
          :key="index"
        >
          <span>{{ label }}</span>
          :
          <span>{{ value }}</span>
        </div>
      </el-card>
    </div>
    <slot></slot>
    <div class="tip-box" @click="handleShowProcess">
      <div v-show="!showProcessMsg">
        <span>查看流程信息</span>
        <i class="el-icon-arrow-right" />
      </div>
      <div v-show="showProcessMsg">
        <span>关闭流程信息</span>
        <i class="el-icon-arrow-down" />
      </div>
    </div>
    <div class="process-canvas" v-show="showProcessMsg">
      <bpmn-viewer
        :visible="showProcessMsg"
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
  name: 'BpmnInfo',
  props: {
    xml: {
      type: String,
      default: '',
    },
    processDisplayInfo: {
      type: Array,
      default: () => [],
    },
    showProcess: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showProcessMsg: this.showProcess,
      iBpmnViewer: null,
    };
  },
  methods: {
    onBpmnViewerLoaded(iBpmnViewer) {
      this.iBpmnViewer = iBpmnViewer;
      this.$emit('loaded', iBpmnViewer);
    },
    onSelectedChange(shape, iBpmnViewer) {
      this.$emit('selectedShape', shape, iBpmnViewer);
    },
    handleShowProcess() {
      this.showProcessMsg = !this.showProcessMsg;
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

.process-base-info{
  width: 100%;
  color: #fff;

  /deep/.el-card__body{
    display: grid;
    grid-template-columns: repeat(3,auto);
    border-radius: 10px;
    background-color: #272938;
  }
}
</style>
