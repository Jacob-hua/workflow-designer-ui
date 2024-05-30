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
        <div v-if="taskInfo.taskType === 'UserTask'" class="ticket-info">
          <div class="title">流程节点执行人员</div>
          <div class="content-wrapper executor">
            <div v-if="alterFlag" class="info">
              <div>
                <span>流程节点:</span><span>{{ taskInfo.taskName }}</span>
              </div>
              <el-tabs v-model="activeName" type="card">
                <el-tab-pane label="固定执行人员" name="first">
                  <div class="user-selector">
                    <el-button
                      :disabled="!taskInfo.taskDefKey"
                      @click="handleChangeUser"
                      icon="el-icon-edit-outline"
                      >变更</el-button
                    >
                    <div class="fixed-user">
                      <span v-if="sourceFixed.length <= 0">暂无</span>
                      <span
                        v-else
                        v-for="item in sourceFixed"
                        :key="item.value"
                        >{{ item.label }}</span
                      >
                    </div>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="其他节点指定" name="second">
                  <div class="other-node-selector">
                    <el-button
                      :disabled="!taskInfo.taskDefKey"
                      @click="handleChangeNodeUser('dynamic_set')"
                      icon="el-icon-edit-outline"
                      >变更</el-button
                    >
                    <span>{{
                      dynamicSet.label ? dynamicSet.label : '暂无'
                    }}</span>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="同一节点执行人" name="third">
                  <div class="same-node-selector">
                    <el-button
                      :disabled="!taskInfo.taskDefKey"
                      @click="handleChangeNodeUser('task_executor')"
                      icon="el-icon-edit-outline"
                      >变更</el-button
                    >
                    <span>{{
                      taskEecutor.label ? taskEecutor.label : '暂无'
                    }}</span>
                  </div>
                </el-tab-pane>
              </el-tabs>
              <!-- <div>
                <span>固定执行人员:</span>
                <div class="fixed-user">
                  <span v-if="sourceFixed.length <= 0">暂无</span>
                  <span v-else v-for="item in sourceFixed" :key="item.value">{{
                    item.label
                  }}</span>
                </div>
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
              </div> -->
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
              ><span
                >{{
                  gatewayCondition.label ? gatewayCondition.label : '暂无'
                }}：{{
                  gatewayCondition.posLabel ? gatewayCondition.posLabel : '暂无'
                }}</span
              >
              <el-button
                :disabled="!taskInfo.taskDefKey"
                @click="handleChangeGateway()"
                >变更</el-button
              >
            </div>
          </div>
        </div>
        <div class="operation-config" v-if="taskInfo.taskType === 'UserTask'">
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
      <div
        class="ticket-form"
        v-if="
          taskInfo.taskType === 'UserTask' || taskInfo.taskType === 'StartEvent'
        "
      >
        <div class="title">
          <div class="title-form-info">
            <span style="width: 110px; flex-shrink: 0">任务执行内容</span>
            <div v-if="formShow" class="form-message">
              <span>表单名称：{{ formShow.formName }}</span>
              <span>版本名称：{{ formShow.formVersionTag }}</span>
              <span>版本号：{{ formShow.formVersion }}</span>
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
            <div v-if="taskInfo.taskType === 'StartEvent'" class="inner-box">
              <div class="inner-label">工单名称：</div>
              <antInput
                v-model="innerName"
                placeholder="请输入工单名称"
              ></antInput>
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
      :historyInfo="gatewayCondition"
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
import IBpmnViewer from '../../../plugin/Bpmn/IBpmnViewer';
import { Input as antInput } from 'ant-design-vue';

export default {
  name: 'WorkflowInfo',
  components: {
    BpmnInfo,
    FormPreview,
    SpecifyUser,
    SpecifyNode,
    SpecifyGateway,
    antInput
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
      innerName: '',
      activeName: 'first',
    };
  },
  computed: {
    ...mapState('account', ['tenantId', 'userInfo']),
    formShow() {
      const formContent = JSON.parse(JSON.stringify(this.formContent));
      if (formContent[this.taskInfo.taskDefKey]) {
        return formContent[this.taskInfo.taskDefKey];
      }
      return null;
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
            userId: value,
            userName: label,
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
      this.innerName = '';
      this.taskInfo.taskType = element.type.split(':')[1];
      const shapeInfo = this.iBpmn.getSelectedShapeInfo();
      if (shapeInfo.loopCharacteristics) {
        this.isSignNode = true;
      } else {
        this.isSignNode = false;
      }
      this.taskOperationsList();
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
      this.$emit('removeForm');
    },

    async taskOperationsList() {
      const { data, code, msg } = await taskOperationsList();
      if (code !== '200') {
        this.$message.error(msg);
        return;
      }
      this.taskActios = data.filter(({ actionCode }) => {
        if (actionCode === 'update_executor') {
          if (!this.isSignNode) {
            return false;
          }
        }
        return true;
      });
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
      const data = value.map(({ userId, userName }) => {
        return {
          pos: '',
          label: userName,
          source: 'source_fixed',
          value: userId,
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
      let gatewayCondition = null;
      if (!selectedData) {
        gatewayCondition = {};
      } else {
        gatewayCondition = {
          label: selectedData.label,
          value: selectedData.value,
          pos: selectForm?.value ?? '',
          posLabel: selectForm?.label ?? '',
          source: 'task_form',
        };
      }
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
  display: flex;
  color: $font-color;

  .title {
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #cccccc;
  }

  .content-wrapper {
    padding: 0px 10px;
    overflow: auto;
    height: 100%;

    .inner-box {
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      .inner-label {
        width: 80px;
      }
    }
  }

  .executor {
    height: 287px;
  }

  .form {
    height: 390px;
    padding: 10px 10px;
  }
}

.ticket-info {
  margin-top: 20px;
  border: 1px solid $border-color;
  border-radius: 4px;
  background: $card-bg-color-2;
  .title {
    padding: 20px;
    border-bottom: 1px solid $border-color;
  }
}

.operation-config {
  margin-top: 20px;
  border: 1px solid $border-color;
  border-radius: 4px;
  background: $card-bg-color-2;
  .title {
    padding: 20px;
    border-bottom: 1px solid $border-color;
  }

  .config {
    padding: 20px 10px;
  }
}

.ticket-left {
  flex-grow: 0;
  flex-shrink: 0;
}

.ticket-form {
  flex: 1;
  margin: 20px 0px 0px 20px;
  display: flex;
  flex-direction: column;
  border: 1px solid $border-color;
  border-radius: 4px;
  background: $card-bg-color-2;
  .title {
    padding: 20px;
    border-bottom: 1px solid $border-color;
    .title-form-info {
      display: flex;
      .form-message {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        white-space: nowrap;
        grid-gap: 10px;

        span {
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
    span {
      margin-right: 10px;
    }
  }
}

.info {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  color: #bbbbbb;

  /deep/ .el-tabs--card {
    .el-tabs__header {
      border-bottom: none;
    }
    .el-tabs__nav {
      background: $tabs-header-bg-color;
      border: 1px solid transparent;

      .el-tabs__item {
        color: #cccccc;
        border: 1px solid transparent;

        &:first-child {
          border-radius: 4px 0px 0 4px;
        }
        &:last-child {
          border-radius: 0 4px 4px 0;
        }
      }
      .is-active {
        color: #ffffff;
        background: #0b71e8;
      }
    }
  }

  & > div {
    font-size: 14px;
    margin-top: 10px;
  }

  .fixed-user {
    // display: flex;
    // flex-wrap: wrap;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 5px;

    span {
      border: 1px solid;
      border-radius: 4px;
      padding: 4px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  & > div:not(:first-child) {
    grid-gap: 10px;
  }

  & > div > span:first-child {
    text-align: start;
    margin-right: 20px;
    min-width: 100px;
  }

  & > div > span:last-child {
    text-align: start;
    color: #dddddd;
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
    align-items: center;
    grid-gap: 10px;
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
