<template>
  <div>
    <base-info-panel />
    <execute-listener-panel />
  </div>
</template>

<script>
import BaseInfoPanel from './components/BaseInfoPanel.vue'
import ExecuteListenerPanel from './components/ExecuteListenerPanel.vue'

export default {
  name: 'bpmnPropertiesPanel',
  components: {
    BaseInfoPanel,
    ExecuteListenerPanel,
  },
}
</script>

<style>
</style>