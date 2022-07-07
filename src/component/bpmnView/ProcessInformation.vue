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
      <bpmn-canvas
        :pelatteVisible="false"
        :headerVisible="false"
        :linterToggle="false"
        :xml="xml"
        :selectedChanged="onSelectedChange"
        @loaded="onCanvasLoaded"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProcessInformation',
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
    onCanvasLoaded(iBpmn) {
      this.$emit('loaded', iBpmn)
    },
    onSelectedChange(shape, iBpmn) {
      this.$emit('selectedShape', shape, iBpmn)
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
