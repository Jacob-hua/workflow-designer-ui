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
          <div class="content-wrapper info">
            <div>
              <span>流程节点:</span><span>{{ currentTaskModel.taskName }}</span>
            </div>
            <div>
              <span>固定执行人员:</span
              ><span v-for="item in sourceFixed" :key="item.value">{{
                item.label ?? '暂无'
              }}</span>
            </div>
            <div>
              <span>其他节点指定:</span
              ><span>{{ dynamicSet.label ?? '暂无' }}</span>
            </div>
            <div>
              <span>同一节点执行人:</span
              ><span>{{ taskEecutor.label ?? '暂无' }}</span>
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
              ><span>{{ gatewayCondition.label ?? '暂无' }}</span>
            </div>
          </div>
        </div>
        <div class="operation-config">
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
      <div class="ticket-form">
        <div class="title">
          <div>
            <span>任务执行内容</span
            ><span v-if="formShow"
              >{{ formContent.formName }}-{{ formContent.formVersionTag }}</span
            >
          </div>
        </div>
        <div class="content-wrapper form">
          <div v-if="formShow">
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
    };
  },
  computed: {
    ...mapState('account', ['tenantId', 'userInfo']),
    formShow() {
      return this.currentTaskModel.taskFormVersionId;
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
    'currentTaskModel.taskFormVersionId'(value) {
      if (value) {
        this.fetchFormVersion(value);
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
      if (!element) {
        this.taskInfo = {
          taskDefKey: '',
          taskType: '',
        };
        this.formContent = {};
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
    margin-top: 26px;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
  }
}

.form {
  padding: 20px 0px !important;
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
