<template>
  <div v-if="visible">
    <el-dialog
      title="部署工作流"
      :visible="visible"
      @close="onCancel"
      fullscreen
      :close-on-click-modal="false"
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
            @removeForm="removeForm"
          />
        </div>
        <div class="form-list-wrapper">
          <div class="title">表单筛选</div>
          <div class="search-form">
            <el-input
              v-model="formName"
              placeholder="请输入表单名称"
              @keyup.native.enter="filterFormList"
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
                  <form-preview
                    :formTree="JSON.parse(ele.selectedVersion).formVersionFile"
                  ></form-preview>
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
import FormPreview from '../../../component/FormPreview.vue';
import { mapState, mapMutations } from 'vuex';
import BpmnShapeType from '../../../plugin/Bpmn/enum/shapeType';
import { fetchFormList, fetchFormVersionList } from '../../../api/workflowForm';
import { saveModel } from '../../../api/workflowModel';

export default {
  name: 'DeployOptions',
  components: {
    WorkflowInfo,
    FormPreview,
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
          value: this.workflow.modelName,
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
      }
    },
    changeTaskConfigs: {
      deep: true,
      handler() {},
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
        const gatewayNodeIndex = this.modelTaskConfigs.findIndex(
          ({ gatewayCondition }) => gatewayCondition
        );
        if (gatewayNodeIndex !== -1) {
          this.modelTaskConfigs[gatewayNodeIndex].gatewayCondition = {
            ...this.modelTaskConfigs[gatewayNodeIndex].gatewayCondition,
            pos: '',
            posLabel: '',
          };
        }
        if (index !== -1) {
          this.modelTaskConfigs[index].taskFormVersionId =
            formVersionInfo.formVersionId;
        } else {
          this.modelTaskConfig.taskFormVersionId =
            formVersionInfo.formVersionId;
          this.modelTaskConfigs.push(this.modelTaskConfig);
        }
      }
    },
    removeForm() {
      this.$delete(this.formContent, this.modelTaskConfig.taskDefKey);
      if (this.shapeType === BpmnShapeType.START_EVENT) {
        this.startFormVersionId = '';
        this.updateStartFormVersionId({
          startFormVersionId: this.startFormVersionId,
        });
      } else {
        const index = this.modelTaskConfigs.findIndex(
          ({ taskDefKey }) => taskDefKey === this.modelTaskConfig.taskDefKey
        );
        if (index !== -1) {
          this.modelTaskConfigs[index].taskFormVersionId = '';
        }
      }
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
      const bpmnElements = iBpmn.elementRegistryGetAll();
      bpmnElements.forEach(({ type, id }) => {
        if (type === 'bpmn:UserTask' || type === 'bpmn:ExclusiveGateway') {
          this.modelTaskConfigs.push({
            caUserConfig: null,
            gatewayCondition: null,
            mutilUserConfig: null,
            taskActions: null,
            taskDefKey: id,
            taskFormVersionId: '',
          });
        }
      });
    },
    onClose() {
      this.formName = '';
      this.formContent = {};
      this.modelTaskConfigs = [];
      this.resetModelTaskConfig();
      this.updateStartFormVersionId({ startFormVersionId: '' });
      this.updateModelTaskConfigs({ modelTaskConfigs: [] });
      this.$emit('update:visible', false);
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
        // this.modelTaskConfigs[index] = this.modelTaskConfig;
        this.modelTaskConfigs.splice(index, 1, this.modelTaskConfig);
      } else {
        if (this.modelTaskConfig.taskDefKey)
          this.modelTaskConfigs.push(this.modelTaskConfig);
      }
    },
    async onSave() {
      const { code, msg } = await saveModel({
        tenantId: this.workflow.tenantId ?? '',
        projectId: this.workflow.projectId ?? '',
        applicationId: this.workflow.applicationId ?? '',
        modelInfoConfig: {
          modelDesc: this.workflow.modelDesc,
          modelName: this.workflow.modelName,
          processId: this.workflow.processId,
          startFormVersionId: this.startFormVersionId,
        },
        modelTaskConfigs: this.modelTaskConfigs,
      });
      if (code !== '200') {
        this.$message.error(msg);
        return;
      }
      this.$message.success('保存成功');
      this.$emit('deployed');
      this.onClose();
    },
    filterFormList() {
      this.pageInfo.page = 1;
      this.fetchFormList();
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
            formVersion,
          };
          return {
            label: `${formVersionTag}_${formVersion}`,
            value: JSON.stringify(versionInfo),
          };
        }
      );
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
