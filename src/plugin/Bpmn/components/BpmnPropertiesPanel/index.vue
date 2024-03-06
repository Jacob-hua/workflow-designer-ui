<template>
  <div class="wrapper">
    <el-collapse v-model="activeName" accordion>
      <el-collapse-item
        v-for="({ title, component }, index) in panels"
        :key="index"
        :name="title"
      >
        <template slot="title">
          {{ title }}
        </template>
        <component
          :is="component"
          :namespace="namespace"
          :lazyLoadUser="lazyLoadUser"
        />
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import IBpmnModeler from '../../IBpmnModeler';
import BpmnShapeType from '../../enum/shapeType';
import BaseInfoPanel from './components/BaseInfoPanel.vue';
import DocumentationPanel from './components/DocumentationPanel.vue';
import SignalMessagePanel from './components/SignalMessagePanel.vue';
import MultiInstancePanel from './components/MultiInstancePanel.vue';
import TimerPanel from './components/TimerPanel.vue';
import ConditionPanel from './components/ConditionPanel.vue';
import bridgingBpmn, { generateNamespace } from '../../utils/bridging-bpmn';
import bridgingModuleFunc from './store';
import shapeType from '../../enum/shapeType';
import { deepCopy, deepEquals } from '../../utils/object';

export default {
  name: 'BpmnPropertiesPanel',
  components: {
    BaseInfoPanel,
    SignalMessagePanel,
    MultiInstancePanel,
    TimerPanel,
    ConditionPanel,
  },
  props: {
    iBpmnModeler: {
      type: IBpmnModeler,
      required: true,
      default: () => new IBpmnModeler(),
    },
    projectData: {
      type: Object,
      default: () => {},
    },
    lazyLoadUser: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    const namespace = generateNamespace(this);
    const unBridgingFunc = bridgingBpmn(
      this.$store,
      namespace,
      this.$options.propsData.iBpmnModeler,
      bridgingModuleFunc
    );
    return {
      namespace,
      unBridgingFunc,
      activeName: '基础信息',
      baseInfoPanelInfo: {
        title: '基础信息',
        component: BaseInfoPanel,
      },
      documentationPanelInfo: {
        title: '任务类型',
        component: DocumentationPanel,
      },
      timerPanelInfo: {
        title: '定时器',
        component: TimerPanel,
      },
      conditionPanelInfo: {
        title: '条件',
        component: ConditionPanel,
      },
      // executeListenerPanelInfo: {
      //   title: '执行监听器',
      //   component: ExecuteListenerPanel,
      // },
      // inputOutputPanelInfo: {
      //   title: '输入/输出',
      //   component: InputOutputPanel,
      // },
      // elementTaskPanelInfo: {
      //   title: '任务',
      //   component: ElementTaskPanel,
      // },
      multiInstancePanelInfo: {
        title: '多实例',
        component: MultiInstancePanel,
      },
      // actionButtonPanelInfo: {
      //   title: '操作按钮配置',
      //   component: ActionButtonPanel,
      // },
    };
  },
  computed: {
    shapeType() {
      return this.$store.state[this.namespace].panel.shapeType;
    },
    baseInfo() {
      return this.$store.state[this.namespace].panel.baseInfo;
    },
    rootBaseInfo() {
      return this.$store.state[this.namespace].panel.rootBaseInfo;
    },
    userTask() {
      return this.$store.state[this.namespace].panel.userTask;
    },
    multiInstance(){
      return this.$store.state[this.namespace].panel.multiInstance
    },
    panels() {
      const elementPanels = {
        [BpmnShapeType.START_EVENT]: [this.baseInfoPanelInfo],
        [BpmnShapeType.TIMER_START_EVENT]: [
          this.baseInfoPanelInfo,
          this.timerPanelInfo,
        ],
        [BpmnShapeType.TIMER_NON_INTERRUPTING_BOUNDARY_EVENT]: [
          this.baseInfoPanelInfo,
          this.timerPanelInfo,
        ],
        [BpmnShapeType.END_EVENT]: [this.baseInfoPanelInfo],
        [BpmnShapeType.USER_TASK]: [
          this.baseInfoPanelInfo,
          this.documentationPanelInfo,
        ],
        [BpmnShapeType.EXCLUSIVE_GATEWAY]: [this.baseInfoPanelInfo],
        [BpmnShapeType.SEQUENCE_FLOW]:
          this.baseInfo.sourceRefType === shapeType.START_EVENT
            ? [this.baseInfoPanelInfo]
            : [this.baseInfoPanelInfo, this.conditionPanelInfo],
      };
      return elementPanels[this.shapeType] ?? [this.baseInfoPanelInfo];
    },
  },
  watch: {
    rootBaseInfo(newVal, oldVal){
      if(!deepEquals(oldVal, newVal)){
        this.$emit('getBaseInfo', newVal)
      }
    },
    userTask(value) {
      const emptyUserTask = {
        displayAssignee: {},
        displayCandidateUsers: [],
        displayCandidateGroups: [],
      };
      if (deepEquals(value, emptyUserTask) && this.shapeType === BpmnShapeType.USER_TASK) {
        const processId = this.iBpmnModeler.getSelectedShapeInfo().id;
        const newUserTask = {
          displayAssignee: {
            key: '${' + processId + '_assignee}',
            value: '${' + processId + '_assignee}',
          },
          displayCandidateUsers: [
            {
              key: '${' + processId + '_ca_users}',
              value: '${' + processId + '_ca_users}',
            },
          ],
          displayCandidateGroups: [
            {
              key: '${' + processId + '_ca_groups}',
              value: '${' + processId + '_ca_groups}',
            },
          ],
        };
        this.updateUserTask({newUserTask: deepCopy(newUserTask)})
      }
    },
    multiInstance(value){
      const {collection, loopCharacteristics} = value;
      if(collection || !loopCharacteristics) return;
      const processId = this.iBpmnModeler.getSelectedShapeInfo().id;
      const newMultiInstance = {
        loopCharacteristics,
        collection: '${' + processId + '_userlist}',
        elementVariable: 'user',
        completionCondition: '${nrOfCompletedInstances == nrOfInstances}'
      }
      this.updateMultiInstance({ newMultiInstance: deepCopy(newMultiInstance) });
      const newUserTask = {
          displayAssignee: {
            key: '${user}',
            value: '${user}',
          },
          displayCandidateUsers: [
            {
              key: '${' + processId + '_ca_users}',
              value: '${' + processId + '_ca_users}',
            },
          ],
          displayCandidateGroups: [
            {
              key: '${' + processId + '_ca_groups}',
              value: '${' + processId + '_ca_groups}',
            },
          ],
        };
        this.updateUserTask({newUserTask: deepCopy(newUserTask)})
    },
    iBpmnModeler: {
      deep: true,
      handler(iBpmnModeler) {
        this.unBridgingFunc();
        this.unBridgingFunc = bridgingBpmn(
          this.$store,
          this.namespace,
          iBpmnModeler,
          bridgingModuleFunc
        );
        this.updateBaseInfo({
          newBaseInfo: {
            name: this.iBpmnModeler.getRootShapeInfo().name,
            id: this.iBpmnModeler.getRootShapeInfo().id,
          },
        });
        this.updateRootBaseInfo({
          rootBaseInfo: {
            processName: this.projectData.processName,
            processDesc: this.projectData.processDesc,
          },
        });
        this.updateParentDocumentationInfo({
          documentation:
            this.iBpmnModeler.getRootShapeInfo().parentDocumentation,
        });
      },
    },
  },
  beforeUpdate() {
    this.namespace = generateNamespace(this);
  },
  beforeDestroy() {
    this.unBridgingFunc();
  },
  methods: {
    updateUserGroupOptions(payload) {
      this.$store.commit({
        type: `${this.namespace}/config/updateUserGroupOptions`,
        ...payload,
      });
    },
    updateBaseInfo(payload) {
      this.$store.commit({
        type: `${this.namespace}/panel/updateBaseInfo`,
        ...payload,
      });
    },
    updateRootBaseInfo(payload) {
      this.$store.commit({
        type: `${this.namespace}/panel/updateRootBaseInfo`,
        ...payload,
      });
    },
    updateUserTask(payload){
      this.$store.commit({
        type: `${this.namespace}/panel/updateUserTask`,
        ...payload,
      });
    },
    updateMultiInstance(payload) {
      this.$store.commit({
        type: `${this.namespace}/panel/updateMultiInstance`,
        ...payload,
      })
    },
    updateParentDocumentationInfo(payload) {
      this.$store.commit(
        `${this.namespace}/panel/updateParentDocumentation`,
        payload
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  width: 600px;
  overflow: auto;
}
</style>
