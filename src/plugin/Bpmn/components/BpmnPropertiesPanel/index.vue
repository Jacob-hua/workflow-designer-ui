<template>
  <div class="wrapper">
    <el-collapse v-model="activeName" accordion>
      <el-collapse-item v-for="({ title, component }, index) in panels" :key="index" :name="title">
        <template slot="title">
          {{ title }}
        </template>
        <component :is="component" :namespace="namespace" />
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import IBpmnModeler from '../../IBpmnModeler'
import BpmnShapeType from '../../enum/shapeType'
import BaseInfoPanel from './components/BaseInfoPanel.vue'
import ExecuteListenerPanel from './components/ExecuteListenerPanel.vue'
import InputOutputPanel from './components/InputOutputPanel.vue'
import SignalMessagePanel from './components/SignalMessagePanel.vue'
import ElementTaskPanel from './components/ElementTaskPanel.vue'
import MultiInstancePanel from './components/MultiInstancePanel.vue'
import ActionButtonPanel from './components/ActionButtonPanel.vue'
import TimerPanel from './components/TimerPanel.vue'
import bridgingBpmn, { generateNamespace } from '../../utils/bridging-bpmn'
import bridgingModuleFunc from './store'

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
    TimerPanel,
  },
  props: {
    iBpmnModeler: {
      type: IBpmnModeler,
      required: true,
      default: () => new IBpmnModeler(),
    },
    fetchUserGroup: {
      type: Function,
      default: () => {},
    },
    fetchUser: {
      type: Function,
      default: () => {},
    },
    fetchId: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    const namespace = generateNamespace(this)
    const unBridgingFunc = bridgingBpmn(
      this.$store,
      namespace,
      this.$options.propsData.iBpmnModeler,
      bridgingModuleFunc
    )
    return {
      namespace,
      unBridgingFunc,
      activeName: '基础信息',
      baseInfoPanelInfo: {
        title: '基础信息',
        component: BaseInfoPanel,
      },
      timerPanelInfo: {
        title: '定时器',
        component: TimerPanel,
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
    shapeType() {
      return this.$store.state[this.namespace].panel.shapeType
    },
    panels() {
      const elementPanels = {
        [BpmnShapeType.START_EVENT]: [this.baseInfoPanelInfo, this.executeListenerPanelInfo, this.inputOutputPanelInfo],
        [BpmnShapeType.TIMER_START_EVENT]: [
          this.baseInfoPanelInfo,
          this.timerPanelInfo,
          this.executeListenerPanelInfo,
          this.inputOutputPanelInfo,
        ],
        [BpmnShapeType.END_EVENT]: [this.baseInfoPanelInfo, this.executeListenerPanelInfo, this.inputOutputPanelInfo],
        [BpmnShapeType.USER_TASK]: [
          this.baseInfoPanelInfo,
          this.executeListenerPanelInfo,
          this.inputOutputPanelInfo,
          this.elementTaskPanelInfo,
          this.multiInstancePanelInfo,
          this.actionButtonPanelInfo,
        ],
        [BpmnShapeType.EXCLUSIVE_GATEWAY]: [this.baseInfoPanelInfo, this.executeListenerPanelInfo],
      }
      return elementPanels[this.shapeType] ?? [this.baseInfoPanelInfo]
    },
  },
  watch: {
    iBpmnModeler: {
      deep: true,
      handler(iBpmnModeler) {
        this.unBridgingFunc()
        this.unBridgingFunc = bridgingBpmn(this.$store, this.namespace, iBpmnModeler, bridgingModuleFunc)
      },
    },
    fetchUserGroup: {
      immediate: true,
      handler(newFunc) {
        this.updateRequestUserGroupFunc({ newFunc })
      },
    },
    fetchUser: {
      immediate: true,
      handler(newFunc) {
        console.log('设置RequestUserFunc', newFunc)
        this.updateRequestUserFunc({ newFunc })
      },
    },
    fetchId: {
      immediate: true,
      handler(newFunc) {
        this.updateGenerateIdFunc({ newFunc })
      },
    },
  },
  beforeUpdate() {
    this.namespace = generateNamespace(this)
  },
  beforeDestroy() {
    this.unBridgingFunc()
  },
  methods: {
    dispatchRequestUserGroup(payload) {
      this.$store.dispatch({
        type: `${this.namespace}/config/dispatchRequestUserGroup`,
        ...payload,
      })
    },
    updateRequestUserGroupFunc(payload) {
      this.$store.commit({
        type: `${this.namespace}/config/updateRequestUserGroupFunc`,
        ...payload,
      })
    },
    updateRequestUserFunc(payload) {
      this.$store.commit({
        type: `${this.namespace}/config/updateRequestUserFunc`,
        ...payload,
      })
    },
    updateGenerateIdFunc(payload) {
      this.$store.commit({
        type: `${this.namespace}/config/updateGenerateIdFunc`,
        ...payload,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.wrapper {
  width: 550px;
  overflow: auto;
}
</style>
