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
        <div class="ticket-info">
          <div class="title">执行人员</div>
          <div class="content-wrapper info">
            <div>
              <span>流程节点:</span><span>{{ taskInfo.taskName }}</span>
            </div>
            <div>
              <span>固定执行人员:</span
              ><span>{{ taskInfo.group ?? '暂无' }}</span>
              <el-button>变更</el-button>
            </div>
            <div>
              <span>其他节点指定:</span
              ><span>{{ taskInfo.assignee ?? '暂无' }}</span>
              <el-button>变更</el-button>
            </div>
            <div>
              <span>同一节点执行人:</span
              ><span>{{ taskInfo.assignee ?? '暂无' }}</span>
              <el-button>变更</el-button>
            </div>
          </div>
        </div>
        <div class="operation-config">
          <div class="title">操作配置</div>
          <div class="content-wrapper config">
            <div class="noData" v-if="taskActios.length === 0">未选择节点</div>
            <el-checkbox-group v-model="selectedTaskActons">
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
      <div class="ticket-form">
        <div class="title">
          <div>任务执行内容</div>
          <el-button
            class="remove-button"
            v-if="formShow && canRemoveForm"
            @click="onRemoveForm"
            >移除表单</el-button
          >
        </div>
        <div class="content-wrapper form">
          <div v-if="formShow">
            <!-- <preview
              :itemList="formContent.fields"
              :formConf="formContent.config"
            ></preview> -->
          </div>
          <div v-else class="empty-data">当前未关联表单</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FormPreview from '@/component/FormPreview.vue'
import BpmnInfo from '../../../component/BpmnInfo.vue';
import { mapState } from 'vuex';
import { taskOperationsList } from '@/api/globalConfig';
import { fetchTaskNodeList } from '../../../api/workflow';

export default {
  name: 'WorkflowInfo',
  components: {
    BpmnInfo,
    FormPreview
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
  },
  data() {
    return {
      iBpmn: {},
      taskInfo: {
        id: '',
        taskName: '',
        group: '',
        assignee: '',
      },
      taskDefKey: '',
      taskActios: [],
      selectedTaskActons: [],
      formContent: {},
    };
  },
  computed: {
    ...mapState('account', ['tenantId', 'userInfo']),
    formShow() {
      return Object.keys(this.formContent).length > 0;
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
          id: '',
          taskName: '',
          group: '',
          assignee: '',
        };
        this.formContent = {};
        return;
      }
      this.taskOperationsList();
      const shapeInfo = this.iBpmn.getSelectedShapeInfo();
      const displayCandidateGroups = JSON.parse(
        shapeInfo['displayCandidateGroups'] ?? '[]'
      );
      this.taskDefKey = shapeInfo['id'];
      const displayAssignee = JSON.parse(shapeInfo['displayAssignee'] ?? '{}');
      this.taskInfo.taskName = shapeInfo['name'];
      this.taskInfo.group = displayCandidateGroups
        .map(({ label }) => label)
        .join(',');
      this.taskInfo.assignee = displayAssignee.label;
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
      this.formContent = {};
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
    disableForm(form) {
      const newForm = { ...form };
      newForm.formContent = JSON.parse(newForm.content);
      newForm.formContent.fields = newForm.formContent.list;
      newForm.formContent.config &&
        (newForm.formContent.config.disabled = true);
      return newForm;
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

.form {
  padding: 20px 0px !important;

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
