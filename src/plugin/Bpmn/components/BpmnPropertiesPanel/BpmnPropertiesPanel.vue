<template>
  <div :style="{ width: '500px' }">
    <el-collapse>
      <el-collapse-item>
        <template slot="title">
          基础信息
        </template>
        <base-info-panel />
      </el-collapse-item>
      <el-collapse-item>
        <template slot="title">
          执行监听器
        </template>
        <execute-listener-panel />
      </el-collapse-item>
      <el-collapse-item>
        <template slot="title">
          信号与消息
        </template>
        <signal-message-panel />
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import BaseInfoPanel from './components/BaseInfoPanel.vue'
import ExecuteListenerPanel from './components/ExecuteListenerPanel.vue'
import SignalMessagePanel from './components/SignalMessagePanel.vue'

export default {
  name: 'BpmnPropertiesPanel',
  components: {
    BaseInfoPanel,
    ExecuteListenerPanel,
    SignalMessagePanel,
  },
}
</script>

<style>
</style>