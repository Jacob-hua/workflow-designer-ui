<template>
  <div class="container">
    <bpmn-info
      :processDisplayInfo="processDisplayInfo"
      :xml="xml"
      @loaded="onLoaded"
      @selectedShape="onSelectedShape"
      :showProcess="true"
    />
    <div class="ticket-wrapper">
      <div class="ticket-left">
        <div
          v-if="taskInfo.taskType !== 'ExclusiveGateway'"
          class="ticket-info"
        >
          <div class="title">执行人员</div>
          <div class="content-wrapper">
            <div v-if="alterFlag" class="info">
              <div>
                <span>流程节点:</span><span>{{ taskInfo.taskName }}</span>
              </div>
              <div>
                <span>固定执行人员:</span>
                <span v-if="sourceFixed.length <= 0">暂无</span>
                <span v-else v-for="item in sourceFixed" :key="item.value">{{
                  item.label
                }}</span>
                <el-button
                  :disabled="!taskInfo.taskDefKey"
                  @click="handleChangeUser"
                  >变更</el-button
                >
              </div>
              <div>
                <span>其他节点指定:</span
                ><span>{{ dynamicSet.label ? dynamicSet.label : '暂无' }}</span>
                <el-button
                  :disabled="!taskInfo.taskDefKey"
                  @click="handleChangeNodeUser('dynamic_set')"
                  >变更</el-button
                >
              </div>
              <div>
                <span>同一节点执行人:</span
                ><span>{{
                  taskEecutor.label ? taskEecutor.label : '暂无'
                }}</span>
                <el-button
                  :disabled="!taskInfo.taskDefKey"
                  @click="handleChangeNodeUser('task_executor')"
                  >变更</el-button
                >
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="taskInfo.taskType === 'ExclusiveGateway'"
          class="ticket-info"
        >
          <div class="title">网关</div>
          <div class="content-wrapper gateway">
            <div>
              <span>网关字段条件:</span
              ><span>{{
                gatewayCondition.label ? gatewayCondition.label : '暂无'
              }}</span>
              <el-button
                :disabled="!taskInfo.taskDefKey"
                @click="handleChangeGateway()"
                >变更</el-button
              >
            </div>
          </div>
        </div>
        <div class="operation-config">
          <div class="title">操作配置</div>
          <div class="content-wrapper config">
            <div v-if="alterFlag">
              <div class="noData" v-if="taskActios.length === 0">
                未选择节点
              </div>
              <el-checkbox-group v-model="selectedTaskActions">
                <el-checkbox
                  v-for="{ actionCode, actionName } in taskActios"
                  :label="actionCode"
                  :key="actionCode"
                  >{{ actionName }}</el-checkbox
                >
              </el-checkbox-group>
            </div>
          </div>
        </div>
      </div>
      <div class="ticket-form">
        <div class="title">
          <div>
            <span>任务执行内容</span>
            <div v-if="formShow">
              <span>表单名称：{{ formShow.formName }}</span>
              <span>版本名称：{{ formShow.formVersionTag }}</span>
            </div>
          </div>
          <el-button
            class="remove-button"
            v-if="formShow && canRemoveForm"
            @click="onRemoveForm"
            >移除表单</el-button
          >
        </div>
        <div class="content-wrapper form">
          <div v-if="formShow">
            <div v-if="taskInfo.taskType === 'StartEvent'">
              <label>表单名称</label>
              <el-input placeholder="请输入表单名称"></el-input>
            </div>
            <form-preview :formTree="formShow.formVersionFile"></form-preview>
          </div>
          <div v-else class="empty-data">当前未关联表单</div>
        </div>
      </div>
    </div>
    <specify-user
      :userDialogVisible="userDialogVisible"
      @closeUserDialog="closeUserDialog"
      :organization="organization"
      :selectedFixed="selectedFixed"
      @saveUser="saveUser"
    ></specify-user>
    <specify-node
      :nodeDialogVisible="nodeDialogVisible"
      :xml="xml"
      :flag="flag"
      :taskInfo="taskInfo"
      :historySelected="selectedNode"
      @closeNodeDialog="closeNodeDialog"
      :processId="workflow.processId"
      @saveNode="saveNode"
    ></specify-node>
    <specify-gateway
      :gatewayDialogVisible="gatewayDialogVisible"
      :xml="xml"
      :taskInfo="taskInfo"
      :processId="workflow.processId"
      @saveGateway="saveGateway"
      @closeGatewayDialog="closeGatewayDialog"
    ></specify-gateway>
  </div>
</template>

<script>
import FormPreview from '@/component/FormPreview.vue';
import BpmnInfo from '../../../component/BpmnInfo.vue';
import { mapState } from 'vuex';
import { taskOperationsList } from '@/api/globalConfig';
import SpecifyUser from './SpecifyUser.vue';
import SpecifyNode from './SpecifyNode.vue';
import SpecifyGateway from './SpecifyGateway.vue';

export default {
  name: 'WorkflowInfo',
  components: {
    BpmnInfo,
    FormPreview,
    SpecifyUser,
    SpecifyNode,
    SpecifyGateway,
  },
  props: {
    workflow: {
      type: Object,
      default: () => ({}),
      required: true,
    },
    xml: {
      type: String,
      default: '',
      required: true,
    },
    processDisplayInfo: {
      type: Array,
      default: () => [],
    },
    canRemoveForm: {
      type: Boolean,
      default: false,
    },
    form: {
      type: Object,
      default: () => ({}),
    },
    modelTaskConfig: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      iBpmn: {},
      taskInfo: {
        taskDefKey: '',
        taskName: '',
        taskType: '',
      },
      taskActios: [],
      selectedTaskActions: [],
      formContent: {},
      userDialogVisible: false,
      nodeDialogVisible: false,
      gatewayDialogVisible: false,
      organization: {},
      flag: '',
      isSignNode: false,
      selectedNode: null,
    };
  },
  computed: {
    ...mapState('account', ['tenantId', 'userInfo']),
    formShow() {
      const formContent = this.formContent;
      return formContent[this.taskInfo.taskDefKey];
    },
    gatewayCondition() {
      return this.modelTaskConfig.gatewayCondition ?? {};
    },
    caUsers() {
      return this.isSignNode
        ? this.modelTaskConfig.mutilUserConfig ?? []
        : this.modelTaskConfig.caUserConfig ?? [];
    },
    sourceFixed() {
      return (
        this.caUsers.filter(({ source }) => source === 'source_fixed') ?? []
      );
    },
    selectedFixed() {
      return (
        this.sourceFixed.map(({ label, value }) => {
          return {
            key: value,
            label,
          };
        }) ?? []
      );
    },
    dynamicSet() {
      return this.caUsers.find(({ source }) => source === 'dynamic_set') ?? {};
    },
    taskEecutor() {
      return (
        this.caUsers.find(({ source }) => source === 'task_executor') ?? {}
      );
    },
    historyTaskActios() {
      return this.modelTaskConfig.taskActions ?? [];
    },
    alterFlag() {
      return this.taskInfo.taskType === 'UserTask';
    },
  },
  watch: {
    form: {
      deep: true,
      immediate: true,
      handler(form) {
        if (!form) {
          return;
        }
        this.formContent = { ...form };
      },
    },
    selectedTaskActions(value) {
      this.$emit('changeTaskConfigs', {
        type: 'taskActions',
        data: value,
        mode: 'replace',
      });
    },
    historyTaskActios(value) {
      if (value === this.selectedTaskActions) return;
      this.selectedTaskActions = value;
    },
  },
  methods: {
    onLoaded(iBpmn) {
      this.iBpmn = iBpmn;
      this.$emit('canvasLoaded', iBpmn);
    },
    onSelectedShape(element, iBpmn) {
      this.$emit('selectedShape', element);
      this.iBpmn = iBpmn;
      if (!element) {
        this.taskInfo = {
          taskDefKey: '',
          taskName: '',
          taskType: '',
        };
        this.taskActios = [];
        return;
      }
      this.taskInfo.taskType = element.type.split(':')[1];
      this.taskOperationsList();
      const shapeInfo = this.iBpmn.getSelectedShapeInfo();
      if (shapeInfo.loopCharacteristics) {
        this.isSignNode = true;
      } else {
        this.isSignNode = false;
      }
      this.taskInfo.taskDefKey = shapeInfo['id'];
      this.taskInfo.taskName = shapeInfo['name'];
    },
    onRemoveForm() {
      if (!this.iBpmn.getSelectedShape()) {
        return;
      }
      this.iBpmn.updateSelectedShapeProperties({
        'camunda:formKey': '',
      });
      this.iBpmn.updateSelectedShapeProperties({
        'camunda:formId': '',
      });
      delete this.formContent[this.taskInfo.taskDefKey];
      this.$emit('removeForm', this.workflow);
    },

    async taskOperationsList() {
      const { data, code, msg } = await taskOperationsList();
      if (code !== '200') {
        this.$message.error(msg);
        return;
      }
      this.taskActios = data;
    },

    handleChangeUser() {
      this.organization = {
        tenantId: this.workflow.tenantId ?? '',
        projectId: this.workflow.projectId ?? '',
        applicationId: this.workflow.applicationId ?? '',
      };
      this.userDialogVisible = true;
    },
    closeUserDialog() {
      this.userDialogVisible = false;
    },
    saveUser(value) {
      const mode = 'push';
      const type = this.isSignNode ? 'mutilUserConfig' : 'caUserConfig';
      const data = value.map(({ key, label }) => {
        return {
          pos: '',
          label,
          source: 'source_fixed',
          value: key,
        };
      });
      this.$emit('changeTaskConfigs', {
        type,
        mode,
        data,
        source: 'source_fixed',
      });
      // this.closeUserDialog();
    },
    handleChangeNodeUser(flag) {
      this.flag = flag;
      if (flag === 'dynamic_set') {
        this.selectedNode = this.dynamicSet;
      } else {
        this.selectedNode = this.taskEecutor;
      }
      this.nodeDialogVisible = true;
    },
    closeNodeDialog() {
      this.nodeDialogVisible = false;
    },
    saveNode({ selectedData, flag }) {
      const mode = 'push';
      const type = this.isSignNode ? 'mutilUserConfig' : 'caUserConfig';
      // const data = { ...selectedData, source: flag };
      const data = selectedData.map((item) => {
        return {
          ...item,
          source: flag,
        };
      });
      this.$emit('changeTaskConfigs', {
        type,
        mode,
        data: data,
        source: flag,
      });
      // this.closeNodeDialog();
    },
    handleChangeGateway() {
      this.gatewayDialogVisible = true;
    },
    closeGatewayDialog() {
      this.gatewayDialogVisible = false;
    },
    saveGateway({ selectedData, selectForm }) {
      const gatewayCondition = {
        label: selectedData.label,
        value: selectedData.value,
        pos: selectForm.value,
        posLabel: selectForm.label,
        source: 'task_form',
      };
      this.$emit('changeTaskConfigs', {
        type: 'gatewayCondition',
        mode: 'replace',
        data: gatewayCondition,
      });
      // this.closeGatewayDialog();
    },
  },
};
</script>

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
}

.ticket-wrapper {
  display: grid;
  grid-template-columns: 1fr 2fr;
  color: $font-color;

  .title {
    line-height: 40px;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .content-wrapper {
    padding: 20px 30px;
    overflow: auto;
    border: 1px solid $border-color;
  }
}

.ticket-info {
  margin-top: 20px;
}

.ticket-form {
  flex: 3;
  margin: 20px 0px 0px 20px;
  .title {
    span:first-child {
      margin-right: 10px;
    }
  }
}

.info {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  color: #999999;

  & > div {
    font-size: 14px;
    margin-top: 26px;
    display: flex;
    flex-direction: row;
  }

  & > div:not(:first-child) {
    justify-content: space-around;
  }

  & > div > span:first-child {
    text-align: end;
    margin-right: 20px;
  }

  & > div > span:last-child {
    text-align: start;
    color: $font-color;
  }
}

.gateway {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  color: #999999;

  & > div {
    font-size: 14px;
    margin-top: 26px;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
  }
}

.form {
  // padding: 20px 0px !important;
  min-height: 200px;

  .empty-data {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.remove-button {
  @include resetBtn;
}
</style>
