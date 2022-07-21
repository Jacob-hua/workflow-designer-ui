<template>
  <div class="wrapper">
    <el-collapse v-model="activeName" accordion>
      <el-collapse-item v-for="({ title, component }, index) in panels" :key="index" :name="title">
        <template slot="title">
          {{ title }}
        </template>
        <component :is="component" :namespace="namespace" :lazyLoadUser="lazyLoadUser" />
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
import ConditionPanel from './components/ConditionPanel.vue'
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
    ConditionPanel,
  },
  props: {
    iBpmnModeler: {
      type: IBpmnModeler,
      required: true,
      default: () => new IBpmnModeler(),
    },
    userGroup: {
      type: Array,
      default: () => [],
    },
    lazyLoadUser: {
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
      conditionPanelInfo: {
        title: '条件',
        component: ConditionPanel,
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
        [BpmnShapeType.SEQUENCE_FLOW]: [this.baseInfoPanelInfo, this.conditionPanelInfo],
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
    userGroup(userGroup) {
      this.updateUserGroupOptions({
        newUserGroupOptions: userGroup,
      })
    },
  },
  beforeUpdate() {
    this.namespace = generateNamespace(this)
  },
  beforeDestroy() {
    this.unBridgingFunc()
  },
  methods: {
    updateUserGroupOptions(payload) {
      this.$store.commit({
        type: `${this.namespace}/config/updateUserGroupOptions`,
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
