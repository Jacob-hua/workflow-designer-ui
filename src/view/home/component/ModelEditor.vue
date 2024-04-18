<template>
  <div v-if="visible">
    <el-dialog
      title="部署工作流"
      :visible="visible"
      @close="onCancel"
      fullscreen
    >
      <div class="deploy-wrapper">
        <div>
          <workflow-info
            :form="formContent"
            :xml="workflow.processFile"
            :workflow="workflow"
            :processDisplayInfo="processDisplayInfo"
            :modelTaskConfig="modelTaskConfig"
            canRemoveForm
            @canvasLoaded="onCanvasLoaded"
            @selectedShape="onSelectedShape"
            @changeTaskConfigs="changeTaskConfigs"
          />
        </div>
        <div class="form-list-wrapper">
          <div class="title">表单筛选</div>
          <div class="search-form">
            <el-input
              v-model="formName"
              placeholder="请输入内容"
              @keyup.native.enter="fetchFormList"
            ></el-input>
          </div>
          <div class="content-wrapper">
            <div v-for="(ele, index) in formList" :key="ele.formId">
              <div>{{ ele.formName }}</div>
              <el-select
                v-model="formList[index].selectedVersion"
                @change="handleChangeVersion(ele)"
              >
                <el-option
                  v-for="(item, index) in ele.versionList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <div class="operations">
                <el-popover placement="right" width="400" trigger="click">
                  <!-- <preview
                    :itemList="fields"
                    :formConf="config"
                    class="preview-popper"
                  ></preview> -->
                  <span class="preview-button" slot="reference"> 查看 </span>
                </el-popover>
                <span class="link-button" v-if="canLink" @click="onLinked(ele)">
                  关联
                </span>
              </div>
            </div>
            <el-pagination
              v-if="pageInfo.total"
              @size-change="onSizeChange"
              @current-change="onPageChange"
              :current-page="pageInfo.page"
              :page-size="pageInfo.limit"
              layout="prev, pager, next, jumper"
              :total="pageInfo.total"
            >
            </el-pagination>
          </div>
        </div>
      </div>
      <span slot="footer">
        <!-- <el-button class="deploy-button" @click="onDeploy"> 部署 </el-button> -->
        <el-button class="save-button" @click="onSave">保存</el-button>
        <el-button class="cancel-button" @click="onCancel">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import WorkflowInfo from './WorkflowInfo.vue';
import { mapState, mapMutations } from 'vuex';
import BpmnShapeType from '../../../plugin/Bpmn/enum/shapeType';
import {
  fetchFormList,
  fetchFormVersionList,
  fetchFormVersion,
} from '../../../api/workflowForm';
import { fetchModelInfo, updateModel } from '../../../api/workflowModel';

export default {
  name: 'ModelEditor',
  components: {
    WorkflowInfo,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    workflow: {
      type: Object,
      default: () => ({}),
      required: true,
    },
    modelId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      iBpmn: {},
      formContent: {},
      formList: [],
      formName: '',
      canLink: false,
      pageInfo: {
        limit: 10,
        page: 1,
        total: 0,
      },
      modelTaskConfigs: [],
      modelTaskConfig: {
        caUserConfig: null,
        gatewayCondition: null,
        mutilUserConfig: null,
        taskActions: null,
        taskDefKey: '',
        taskFormVersionId: '',
      },
      shapeType: null,
      startFormVersionId: '',
      modelInfo: {},
    };
  },
  computed: {
    // ...mapState('model', ['modelTaskConfigs']),
    processDisplayInfo() {
      return [
        {
          label: '流程名称',
          value: this.workflow.processName,
        },
        {
          label: '模型名称',
          value: this.modelInfo.modelName,
        },
        // {
        //   label: "部署时间",
        //   value: this.workflow.createTime,
        // },
        {
          label: '应用项目',
          value: this.workflow.projectName,
        },
        // {
        //   label: "部署人",
        //   value: this.workflow.createBy,
        // },
      ];
    },
  },
  watch: {
    visible(value) {
      if (value) {
        this.fetchFormList();
        this.fetchModelInfo();
      }
    },
    modelTaskConfigs: {
      deep: true,
      handler(value) {
        this.updateModelTaskConfigs({ modelTaskConfigs: value });
      },
    },
  },
  methods: {
    ...mapMutations('model', [
      'updateModelTaskConfigs',
      'updateStartFormVersionId',
    ]),
    resetModelTaskConfig(taskDefKey = '') {
      this.modelTaskConfig = {
        caUserConfig: null,
        gatewayCondition: null,
        mutilUserConfig: null,
        taskActions: null,
        taskDefKey: taskDefKey,
        taskFormVersionId: '',
      };
    },
    onCancel() {
      this.$emit('cancel');
      this.onClose();
    },
    onLinked(form) {
      if (!this.iBpmn.getSelectedShape()) {
        return;
      }
      const formVersionInfo = JSON.parse(form.selectedVersion);
      this.iBpmn.updateSelectedShapeProperties({
        'camunda:formKey': 'camunda-forms:deployment:' + form.formName,
      });
      this.iBpmn.updateSelectedShapeProperties({
        'camunda:formId': form.formId,
      });
      this.$set(
        this.formContent,
        this.modelTaskConfig.taskDefKey,
        formVersionInfo
      );
      if (this.shapeType === BpmnShapeType.START_EVENT) {
        this.startFormVersionId = formVersionInfo.formVersionId;
        this.updateStartFormVersionId({
          startFormVersionId: this.startFormVersionId,
        });
      } else {
        const index = this.modelTaskConfigs.findIndex(
          ({ taskDefKey }) => taskDefKey === this.modelTaskConfig.taskDefKey
        );
        if (index !== -1) {
          this.modelTaskConfigs[index].taskFormVersionId =
            formVersionInfo.formVersionId;
          // const
        } else {
          this.modelTaskConfig.taskFormVersionId =
            formVersionInfo.formVersionId;
          this.modelTaskConfigs.push(this.modelTaskConfig);
        }
      }
      // this.modelTaskConfig.taskFormVersionId = formVersionInfo.formVersionId;
    },
    onSelectedShape(element) {
      if (!element) {
        this.canLink = false;
        this.resetModelTaskConfig();
        return;
      }
      const taskShape = this.iBpmn.getShapeType(element);
      if (
        taskShape === BpmnShapeType.USER_TASK ||
        taskShape === BpmnShapeType.START_EVENT
      ) {
        this.shapeType = taskShape;
        this.modelTaskConfig = this.modelTaskConfigs.find(
          ({ taskDefKey }) => taskDefKey === element.id
        );
        if (!this.modelTaskConfig) {
          this.resetModelTaskConfig(element.id);
        }
        this.canLink = true;
        this.fetchFormVersion();
      } else if (taskShape === BpmnShapeType.EXCLUSIVE_GATEWAY) {
        this.shapeType = taskShape;
        this.modelTaskConfig = this.modelTaskConfigs.find(
          ({ taskDefKey }) => taskDefKey === element.id
        );
        if (!this.modelTaskConfig) {
          this.resetModelTaskConfig(element.id);
        }
        this.canLink = false;
      } else {
        this.canLink = false;
        this.resetModelTaskConfig();
      }
    },
    onCanvasLoaded(iBpmn) {
      this.iBpmn = iBpmn;
    },
    onClose() {
      this.formName = '';
      this.formContent = {};
      this.$emit('update:visible', false);
      this.updateModelTaskConfigs({ modelTaskConfigs: [] });
    },
    changeTaskConfigs({ type, mode, data, source }) {
      if (!data) return;
      // if (data instanceof Array && !data.length) return;
      if (mode === 'push') {
        if (!this.modelTaskConfig[type]) {
          this.modelTaskConfig[type] = [];
          if (data.length) this.modelTaskConfig[type].push(...data);
        } else {
          this.modelTaskConfig[type] = this.modelTaskConfig[type].filter(
            (item) => source !== item.source
          );
          if (data.length) this.modelTaskConfig[type].push(...data);
        }
      } else {
        this.modelTaskConfig[type] = data;
      }
      const index = this.modelTaskConfigs.findIndex(
        ({ taskDefKey }) => taskDefKey === this.modelTaskConfig.taskDefKey
      );
      if (index !== -1) {
        this.modelTaskConfigs.splice(index, 1, this.modelTaskConfig);
      } else {
        if (this.modelTaskConfig.taskDefKey)
          this.modelTaskConfigs.push(this.modelTaskConfig);
      }
    },
    async onSave() {
      const { code, msg } = await updateModel({
        modelId: this.modelId,
        modelDesc: this.workflow.modelDesc,
        modelName: this.workflow.modelName,
        startFormVersionId: this.startFormVersionId,
        modelTaskConfigs: this.modelTaskConfigs,
      });
      if (code !== '200') {
        this.$message.error(msg);
        return;
      }
      this.$message.success('保存成功');
      this.$emit('saveSuccess');
      this.onClose();
    },
    async fetchModelInfo() {
      const { data, code, msg } = await fetchModelInfo({
        modelId: this.modelId,
      });
      if (code !== '200') {
        this.$message.error(msg);
        return;
      }
      this.modelTaskConfigs = Object.values(data.modelTasks);
      this.modelInfo = data.modelInfo;
    },
    async fetchFormList() {
      const { data, code, msg } = await fetchFormList({
        tenantId: this.workflow.tenantId,
        projectId: this.workflow.projectId,
        applicationId: this.workflow.applicationId,
        bindType: 'bind',
        formName: this.formName,
        limit: this.pageInfo.limit,
        page: this.pageInfo.page,
      });
      if (code !== '200') {
        this.$message.error(msg);
        return;
      }
      const dataList = data.dataList;
      const formData = await Promise.all(
        dataList.map(async (item) => {
          const versionList = await this.fetchFormVersionList(item.formId);
          return {
            ...item,
            selectedVersion: versionList[0].value,
            versionList,
          };
        })
      );
      this.formList = formData;
      this.pageInfo.total = Number(data.total);
    },
    async fetchFormVersionList(formId) {
      const { data, code, msg } = await fetchFormVersionList({
        formId: formId,
        limit: 9999,
        page: 1,
      });
      if (code !== '200') {
        this.$message.error(msg);
        return [];
      }
      return data.dataList.map(
        ({
          formName,
          formVersionId,
          formVersion,
          formVersionTag,
          formVersionFile,
        }) => {
          const versionInfo = {
            formVersionId,
            formVersionFile: JSON.parse(formVersionFile),
            formName,
            formVersionTag,
          };
          return {
            label: `${formVersionTag}_${formVersion}`,
            value: JSON.stringify(versionInfo),
          };
        }
      );
    },
    async fetchFormVersion() {
      const { data, code, msg } = await fetchFormVersion({
        formVersionId:
          this.shapeType === BpmnShapeType.START_EVENT
            ? this.modelInfo.startFormVersionId
            : this.modelTaskConfig.taskFormVersionId,
      });
      if (code !== '200') {
        this.$message.error(msg);
        return;
      }
      this.$set(this.formContent, this.modelTaskConfig.taskDefKey, {
        ...data,
        formVersionFile: JSON.parse(data.formVersionFile),
      });
    },

    onSizeChange(val) {
      this.pageInfo.limit = val;
      this.fetchFormList();
    },
    onPageChange(val) {
      this.pageInfo.page = val;
      this.fetchFormList();
    },
    updatePageNum() {
      const totalPage = Math.ceil(
        (this.pageInfo.total - 1) / this.pageInfo.limit
      );
      this.pageInfo.page =
        this.pageInfo.page > totalPage ? totalPage : this.pageInfo.page;
      this.pageInfo.page = this.pageInfo.page < 1 ? 1 : this.pageInfo.page;
    },
  },
};
</script>

<style lang="scss">
.preview-popper {
  max-height: 500px;
  overflow: auto;

  &::-webkit-scrollbar {
    display: none;
  }
}
</style>

<style scoped lang="scss">
.deploy-wrapper {
  display: flex;
  flex-direction: row;

  & > div:first-child {
    flex-grow: 1;
  }

  & > div:last-child {
    color: $font-color;
    width: 510px;
  }
}

.form-list-wrapper {
  width: 468px;
  height: 680px;
  padding: 0 38px;

  .title {
    font-size: 14px;
    line-height: 20px;
    font-weight: 400;
  }

  .search-form {
    margin-top: 25px;
  }

  .content-wrapper {
    height: 650px;
    overflow: scroll;
    margin: 10px 0;

    & > div {
      border: 1px solid #666666;
      background-color: #212739;
      margin-top: 20px;
      display: grid;
      grid-auto-flow: column;
      grid-template-columns: 3fr 2fr 1.5fr;
      align-items: center;
      padding: 6px 20px;
      font-size: 14px;

      .el-select {
        width: 100px;

        /deep/.el-input__inner {
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
      .info {
        display: flex;
        flex-direction: row;
        color: #999999;

        & > div:first-child {
          width: 150px;
        }
      }

      .operations {
        display: flex;
        flex-direction: row;
      }
    }
  }
}

.preview-button {
  margin-right: 20px;
  color: #0199f3;
  cursor: pointer;
}

.link-button {
  color: #0dd5ef;
  cursor: pointer;
}

.deploy-button {
  @include primaryBtn;
}

.save-button {
  @include primaryBtn;
}

.cancel-button {
  @include cancelBtn;
}
</style>
