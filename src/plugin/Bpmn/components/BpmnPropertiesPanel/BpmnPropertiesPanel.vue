<template>
  <div class="wrapper">
    <el-collapse v-model="activeName" accordion>
      <el-collapse-item v-for="({ title, component }, index) in panels" :key="index" :name="title">
        <template slot="title">
          {{ title }}
        </template>
        <component :is="component" />
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import BaseInfoPanel from './components/BaseInfoPanel.vue'
import ExecuteListenerPanel from './components/ExecuteListenerPanel.vue'
import InputOutputPanel from './components/InputOutputPanel.vue'
import SignalMessagePanel from './components/SignalMessagePanel.vue'
import ElementTaskPanel from './components/ElementTaskPanel.vue'
import MultiInstancePanel from './components/MultiInstancePanel.vue'
import ActionButtonPanel from './components/ActionButtonPanel.vue'
import { mapState } from 'vuex'

export default {
  name: 'BpmnPropertiesPanel',
  components: {
    BaseInfoPanel,
    ExecuteListenerPanel,
    SignalMessagePanel,
    InputOutputPanel,
    ElementTaskPanel,
    MultiInstancePanel,
    ActionButtonPanel,
  },
  data() {
    return {
      activeName: '基础信息',
      baseInfoPanelInfo: {
        title: '基础信息',
        component: BaseInfoPanel,
      },
      executeListenerPanelInfo: {
        title: '执行监听器',
        component: ExecuteListenerPanel,
      },
      inputOutputPanelInfo: {
        title: '输入/输出',
        component: InputOutputPanel,
      },
      elementTaskPanelInfo: {
        title: '任务',
        component: ElementTaskPanel,
      },
      multiInstancePanelInfo: {
        title: '多实例',
        component: MultiInstancePanel,
      },
      actionButtonPanelInfo: {
        title: '操作按钮配置',
        component: ActionButtonPanel,
      },
    }
  },
  computed: {
    ...mapState('bpmn/panel', ['shapeType']),
    panels() {
      const elementPanels = {
        StartEvent: [this.baseInfoPanelInfo, this.executeListenerPanelInfo, this.inputOutputPanelInfo],
        EndEvent: [this.baseInfoPanelInfo, this.executeListenerPanelInfo, this.inputOutputPanelInfo],
        UserTask: [
          this.baseInfoPanelInfo,
          this.executeListenerPanelInfo,
          this.inputOutputPanelInfo,
          this.elementTaskPanelInfo,
          this.multiInstancePanelInfo,
          this.actionButtonPanelInfo,
        ],
        ExclusiveGateway: [this.baseInfoPanelInfo, this.executeListenerPanelInfo],
      }
      return elementPanels[this.shapeType.type] ?? [this.baseInfoPanelInfo]
    },
  },
}
</script>

<style lang="scss" scoped>
.wrapper {
  width: 500px;
  overflow: auto;
}
</style>
