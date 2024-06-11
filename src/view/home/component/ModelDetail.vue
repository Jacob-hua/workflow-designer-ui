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
          <div class="title">执行人员</div>
          <div class="content-wrapper info">
            <div>
              <span>流程节点:</span><span>{{ currentTaskModel.taskName }}</span>
            </div>
            <div>
              <span>固定执行人员:</span
              ><span v-for="item in sourceFixed" :key="item.value">{{
                item.label ? item.label : '暂无'
              }}</span>
            </div>
            <div>
              <span>其他节点指定:</span
              ><span>{{ dynamicSet.label ? dynamicSet.label : '暂无' }}</span>
            </div>
            <div>
              <span>同一节点执行人:</span
              ><span>{{ taskEecutor.label ? taskEecutor.label : '暂无' }}</span>
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
                }}-{{
                  gatewayCondition.posLabel ? gatewayCondition.posLabel : '暂无'
                }}</span
              >
            </div>
          </div>
        </div>
        <div class="operation-config" v-if="taskInfo.taskType === 'UserTask'">
          <div class="title">操作配置</div>
          <div class="content-wrapper config">
            <div class="noData" v-if="taskActios.length === 0">未选择节点</div>
            <el-checkbox-group v-model="selectedTaskActions">
              <el-checkbox
                v-for="{ actionCode, actionName } in taskActios"
                :label="actionCode"
                :key="actionCode"
                disabled
                >{{ actionName }}</el-checkbox
              >
            </el-checkbox-group>
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
          <span style="width: 110px; white-space: nowarap">任务执行内容</span>
          <div v-if="formShow" class="form-base-info">
            <span>表单名称：{{ formContent.formName }}</span>
            <span>版本名称：{{ formContent.formVersionTag }}</span>
            <span>版本号：{{ formContent.formVersion }}</span>
          </div>
        </div>
        <div class="content-wrapper form">
          <div v-if="formShow">
            <div v-if="taskInfo.taskType === 'StartEvent'" class="inner-box">
              <div class="inner-label">工单名称：</div>
              <el-input
                v-model="innerName"
                placeholder="请输入工单名称"
              ></el-input>
            </div>
            <form-preview
              :formTree="formContent.formVersionFile"
            ></form-preview>
          </div>
          <div v-else class="empty-data">当前未关联表单</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FormPreview from '@/component/FormPreview.vue';
import BpmnInfo from '../../../component/BpmnInfo.vue';
import { mapState } from 'vuex';
import { taskOperationsList } from '@/api/globalConfig';
import { fetchFormVersion } from '@/api/workflowForm';

export default {
  name: 'ModelDetail',
  components: {
    BpmnInfo,
    FormPreview,
  },
  props: {
    modelTasks: {
      type: Object,
      default: () => ({}),
    },
    modelInfo: {
      type: Object,
      default: () => ({}),
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
  },
  data() {
    return {
      iBpmn: {},
      taskInfo: {
        taskDefKey: '',
        taskName: '',
        taskType: '',
      },
      taskDefKey: '',
      taskActios: [],
      selectedTaskActions: [],
      formContent: {},
      isSignNode: false,
      innerName: '',
    };
  },
  computed: {
    ...mapState('account', ['tenantId', 'userInfo']),
    formShow() {
      return Object.keys(this.formContent).length;
    },
    gatewayCondition() {
      return this.currentTaskModel.gatewayCondition ?? {};
    },
    caUsers() {
      return this.isSignNode
        ? this.currentTaskModel.mutilUserConfig ?? []
        : this.currentTaskModel.caUserConfig ?? [];
    },
    sourceFixed() {
      return (
        this.caUsers.filter(({ source }) => source === 'source_fixed') ?? []
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
    currentTaskModel() {
      return this.modelTasks[this.taskInfo.taskDefKey] ?? {};
    },
    historyTaskActios() {
      return this.currentTaskModel.taskActions ?? [];
    },
  },
  watch: {
    'taskInfo.taskDefKey'() {
      if (this.taskInfo.taskType === 'StartEvent') {
        this.fetchFormVersion(this.modelInfo.startFormVersionId);
      } else {
        if (Object.keys(this.currentTaskModel).length <= 0) return;
        this.fetchFormVersion(this.currentTaskModel.taskFormVersionId);
      }
    },
    historyTaskActios(value) {
      if (value.length <= 0 || value === this.selectedTaskActions) return;
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
      this.formContent = {};
      if (!element) {
        this.taskInfo = {
          taskDefKey: '',
          taskType: '',
        };
        return;
      }
      this.innerName = '';
      this.taskInfo.taskType = element.type.split(':')[1];
      this.taskOperationsList();
      const shapeInfo = this.iBpmn.getSelectedShapeInfo();
      if (shapeInfo.loopCharacteristics) {
        this.isSignNode = true;
      } else {
        this.isSignNode = false;
      }
      this.taskInfo.taskDefKey = shapeInfo['id'];
    },

    async taskOperationsList() {
      const { data, code, msg } = await taskOperationsList();
      if (code !== '200') {
        this.$message.error(msg);
        return;
      }
      this.taskActios = data;
    },
    async fetchFormVersion(versionId) {
      if (!versionId) return;
      const { data, code, msg } = await fetchFormVersion({
        formVersionId: versionId,
      });
      if (code !== '200') {
        this.$message.error(msg);
        return;
      }
      this.formContent = {
        ...data,
        formVersionFile: JSON.parse(data.formVersionFile),
      };
    },
  },
  beforeDestroy() {
    this.formContent = {};
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
    line-height: 40px;
    font-size: 14px;
    display: flex;
    align-items: center;

    .form-base-info {
      display: grid;
      grid-auto-flow: column;
      grid-template-columns: repeat(3, 1fr);
      grid-gap: 10px;
      span {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }

  .content-wrapper {
    padding: 20px 30px;
    overflow: auto;
    border: 1px solid $border-color;
    // height: 100%;

    .inner-box {
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      .inner-label {
        width: 80px;
      }
    }
  }
}

.ticket-info {
  margin-top: 20px;
}

.ticket-form {
  flex: 3;
  margin: 20px 0px 0px 20px;
  display: flex;
  flex-direction: column;
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
  height: 230px;

  & > div {
    font-size: 14px;
    margin-top: 26px;
    display: flex;
    flex-direction: row;
  }

  & > div > span:first-child {
    text-align: end;
    margin-right: 20px;
  }

  & > div > span:last-child {
    text-align: start;
  }
}

.gateway {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  color: #999999;

  & > div {
    font-size: 14px;
    display: flex;
    flex-direction: row;
    align-items: center;
    grid-gap: 10px;
  }
}

.form {
  height: 333px;

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
