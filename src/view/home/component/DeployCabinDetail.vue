<template>
  <div>
    <el-dialog
      title="查看工作流"
      fullscreen
      :visible="visible"
      @close="onClose"
    >
      <div class="container">
        <bpmn-info
          :processDisplayInfo="processDisplayInfo"
          :xml="workflow.processFile"
          :showProcess="true"
        />
        <div class="search-wrapper">
          <div class="input-box">
            <el-input
              v-model="modelName"
              prefix-icon="el-icon-search"
              placeholder="请输入模型名称"
            ></el-input>
          </div>
        </div>
        <div class="detail-wrapper">
          <div v-if="totalModel <= 0">暂无数据</div>
          <div v-else class="details">
            <div
              class="detail"
              v-for="{
                modelId,
                modelName,
                creatorName,
                createTime,
              } in modelList"
              :key="modelId"
            >
              <div class="operation-box">
                <div class="detail-button" @click="onClickDetail(modelId)">
                  详情
                </div>
                <div class="edit-button" @click="onClickEdit(modelId)">
                  编辑
                </div>
              </div>
              <div>
                <div class="info">
                  <span>模型名称:</span>
                  <long-text
                    contentStyle="margin-left: 10px; width: 130px;"
                    :content="modelName"
                  />
                </div>
                <div class="info">
                  <span>部署人:</span>
                  <span>{{ creatorName }}</span>
                </div>
                <div class="info">
                  <span>部署时间:</span>
                  <span>{{ createTime }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
    <deploy-detail
      :visible.sync="deployDetailVisible"
      :modelId="modelId"
      :xml="workflow.processFile"
      @deleted="onDeletedDeploy"
    />
    <model-editor
      :visible.sync="modelEditorVisible"
      :modelId="modelId"
      :workflow="workflow"
      @saveSuccess="saveSuccess"
    ></model-editor>
  </div>
</template>

<script>
import BpmnInfo from '../../../component/BpmnInfo.vue';
import DeployDetail from './DeployDetail.vue';
import ModelEditor from './ModelEditor.vue';
import longText from '../../../component/LongText.vue';
import { fetchModelList } from '../../../api/workflowModel';

export default {
  name: 'DeployCabinDetail',
  components: {
    BpmnInfo,
    DeployDetail,
    longText,
    ModelEditor,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    workflow: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      modelList: [],
      deployDetailVisible: false,
      modelEditorVisible: false,
      modelId: '',
      modelName: '',
      totalModel: 0,
    };
  },
  computed: {
    processDisplayInfo() {
      return [
        {
          label: '流程编码',
          value: this.workflow.processCode,
        },
        {
          label: '流程名称',
          value: this.workflow.processName,
        },
        // {
        //   label: '创建时间',
        //   value: this.workflow.createTime,
        // },
        {
          label: '应用项目',
          value: this.workflow.processCode,
        },
        // {
        //   label: '部署人',
        //   value: this.workflow.createBy,
        // },
      ];
    },
  },
  watch: {
    visible(value) {
      if (value) {
        this.fetchModelList();
      }
    },
    modelName(newVal, oldVal) {
      if (newVal === oldVal) return;
      this.fetchModelList();
    },
  },
  methods: {
    onDeletedDeploy() {
      this.fetchModelList();
      this.$emit('deleted');
    },
    onClose() {
      this.$emit('cloase');
      this.$emit('update:visible', false);
    },
    onClickDetail(modelId) {
      this.modelId = modelId;
      this.deployDetailVisible = true;
    },
    onClickEdit(modelId) {
      this.modelId = modelId;
      this.modelEditorVisible = true;
    },
    saveSuccess() {
      this.fetchModelList()
    },
    async fetchModelList() {
      const { data, code, msg } = await fetchModelList({
        tenantId: this.workflow.tenantId,
        projectId: this.workflow.projectId,
        applicationId: this.workflow.applicationId,
        processId: this.workflow.processId,
        modelName: this.modelName,
        limit: 9999,
        page: 1,
      });
      if (code !== '200') {
        this.$message.error(msg);
        return;
      }
      this.totalModel = Number(data.total);
      this.modelList = data.dataList;
    },
  },
};
</script>

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
}

.search-wrapper {
  color: $font-color;
  padding: 30px 0;
  font-size: 12px;

  .input-box {
    width: 300px;
  }
}

.detail-wrapper {
  overflow: auto;
  height: 240px;

  .details {
    display: grid;
    grid-template-columns: repeat(auto-fill, 270px);
    row-gap: 20px;
    column-gap: 20px;
    padding: 20px 30px;
  }

  .detail {
    background-color: #212739;
    color: $font-color;
    font-size: 14px;
    padding: 10px;

    .info {
      display: flex;
      padding: 5px 0;
      & > span:first-child {
        width: 65px;
        text-align: end;
      }
      & > span:last-child {
        margin-left: 10px;
      }
    }
  }

  .operation-box {
    display: flex;
    justify-content: right;

    & > div {
      cursor: pointer;
      color: $button-submit-bg-color;
    }

    .detail-button{
      margin-right: 10px;
    }
  }
  // .detail-button {
  //   float: right;
  //   cursor: pointer;
  //   color: $button-submit-bg-color;
  // }
}
</style>
