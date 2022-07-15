<template>
  <div>
    <div class="process-title">
      <div v-for="({ label, value }, index) in processDisplayInfo" :key="index">
        <span>{{ label }}</span>
        :
        <span>{{ value }}</span>
      </div>
    </div>
    <div class="process-canvas">
      <bpmn-viewer
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
  },
  methods: {
    onBpmnViewerLoaded(iBpmnViewer) {
      this.$emit('loaded', iBpmnViewer)
    },
    onSelectedChange(shape, iBpmnViewer) {
      this.$emit('selectedShape', shape, iBpmnViewer)
    },
  },
}
</script>

<style scoped lang="scss">
.process-title {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
  align-content: space-around;
  color: $font-color;
  line-height: 40px;
}

.process-canvas {
  height: 400px;
  border: 1px solid $border-color;
}
</style>
