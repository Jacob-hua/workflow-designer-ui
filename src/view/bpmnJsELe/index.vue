<template>
  <div class="bpmnEle">
    <bpmn-editor />
    <bpmn-properties-panel />
  </div>
</template>

<script>
import clickoutside from 'element-ui/lib/utils/clickoutside'

export default {
  name: 'bpmnEle',
  directives: {
    clickoutside: clickoutside,
  },
  props: {
    xmlString: {
      type: String,
      default: '',
    },
  },
}
</script>

<style scoped>
.bpmnEle {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
}
</style>
