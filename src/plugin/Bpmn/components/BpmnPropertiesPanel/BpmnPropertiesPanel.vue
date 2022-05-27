<template>
  <div>
    {{test}}
    <base-info-panel />
    <execute-listener-panel />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import BaseInfoPanel from './components/BaseInfoPanel.vue'
import ExecuteListenerPanel from './components/ExecuteListenerPanel.vue'

export default {
  name: 'bpmnPropertiesPanel',
  components: {
    BaseInfoPanel,
    ExecuteListenerPanel,
  },
  computed: {
    ...mapState('bpmn/config', ['test']),
  },
}
</script>

<style>
</style>