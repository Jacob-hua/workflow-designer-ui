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
            canRemoveForm
            @canvasLoaded="onCanvasLoaded"
            @selectedShape="onSelectedShape"
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
            <div
              v-for="(ele) in formList"
              :key="ele.formId"
            >
            {{ ele.formName }}
              <el-select v-model="formList[index].selectedVersion" @change="handleChangeVersion(ele)">
                <div slot="prefix">{{ ele.formName }}</div>
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
                <span
                  class="link-button"
                  v-if="canLink"
                  @click="onLinked({ id, docName, fields, config })"
                >
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
        <el-button class="deploy-button" @click="onDeploy"> 部署 </el-button>
        <el-button class="save-button" @click="onSave">保存</el-button>
        <el-button class="cancel-button" @click="onCancel">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import WorkflowInfo from './WorkflowInfo.vue';
import { mapState } from 'vuex';
import BpmnShapeType from '../../../plugin/Bpmn/enum/shapeType';
import {
  fetchFormList,
  fetchFormVersionList,
  fetchFormVersion,
} from '../../../api/workflowForm';

export default {
  name: 'DeployOptions',
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
    };
  },
  computed: {
    ...mapState('account', ['tenantId', 'userInfo']),
    processDisplayInfo() {
      return [
        {
          label: '流程编码',
          value: this.workflow.processCode,
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
  },
  methods: {
    onCancel() {
      this.$emit('cancel');
      this.onClose();
    },
    onLinked({ id, docName, fields, config }) {
      if (!this.iBpmn.getSelectedShape()) {
        return;
      }
      this.iBpmn.updateSelectedShapeProperties({
        'camunda:formKey': 'camunda-forms:deployment:' + docName,
      });
      this.iBpmn.updateSelectedShapeProperties({
        'camunda:formId': id,
      });
      this.formContent = {
        fields,
        config,
      };
    },
    onSelectedShape(element) {
      if (
        !element ||
        this.iBpmn.getShapeType(element) !== BpmnShapeType.USER_TASK
      ) {
        this.canLink = false;
        return;
      }
      this.canLink = true;
    },
    onCanvasLoaded(iBpmn) {
      this.iBpmn = iBpmn;
    },
    onClose() {
      this.formName = '';
      this.formContent = {};
      this.$emit('update:visible', false);
    },
    generateWorkflowFormData() {
      const formIds = this.iBpmn
        .elementRegistryFilter(({ type }) => type === 'bpmn:UserTask')
        .map((element) => this.iBpmn.getShapeInfo(element)['formId'])
        .filter((formId) => formId)
        .join(',');

      const formData = new FormData();
      const formDataFactory = {
        enabled: (formData) => {
          formData.append('processId', this.workflow.id);
        },
        drafted: (formData) => {
          formData.append('processId', this.workflow.processId);
          formData.append('id', this.workflow.id);
        },
      };
      formDataFactory[this.workflow.status](formData);
      formData.append('createBy', this.userInfo.account);
      formData.append('deployName', this.workflow.deployName);
      formData.append('draftId', this.workflow.id);
      formData.append('operatorId', '1');
      formData.append('operatorName', this.userInfo.account);
      formData.append(
        'systemType',
        this.workflow.systemType || this.workflow.business
      );
      formData.append('updateBy', this.userInfo.account);
      formData.append('tenantId', this.tenantId);
      formData.append('formIds', formIds);
      formData.append('triggerModel', this.workflow.triggerModel);
      return formData;
    },
    async getXMLInfo() {
      const newProcessId = await this.$generateUUID();
      this.iBpmn.updateRootShapeId(`process_${newProcessId}`);
      const { xml } = await this.iBpmn.saveXML({ format: true });
      const { name: processName, id: processId } =
        this.iBpmn.getRootShapeInfo();
      const file = new File([xml], processName + '.bpmn', {
        type: 'bpmn20-xml',
      });
      return {
        file,
        processId,
      };
    },
    async onDeploy() {
    },
    async onSave() {
    },
    async fetchFormList() {
      console.log(this.workflow, 'adada');
      const { data, code, msg } = await fetchFormList({
        tenantId: this.workflow.tenantId,
        projectId: this.workflow.projectId,
        applicationId: this.workflow.projectId,
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
      this.formList = dataList.map(async (item) => {
        const versionList = await fetchFormVersionList(item.formId);
        return {
          ...item,
          selectedVersion: versionList[0].value,
          versionList,
        };
      });
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
        ({ formVersionId, formVersion, formVersionTag, formVersionFile }) => {
          const versionInfo = {
            formVersionId,
            formVersionFile: JSON.parse(formVersionFile),
          };
          return {
            label: `${formVersionTag}_${formVersion}`,
            value: JSON.stringify(versionInfo),
          };
        }
      );
    },

    async fetchFormVersion() {},
    disableForm(form) {
      const newForm = { ...form };
      newForm.formContent = JSON.parse(newForm.content);
      newForm.formContent.fields = newForm.formContent.list;
      newForm.formContent.config &&
        (newForm.formContent.config.disabled = true);
      return newForm;
    },

    onSizeChange(val) {
      this.pageInfo.limit = val;
      // this.fetchWorkflowList()
    },
    onPageChange(val) {
      this.pageInfo.page = val;
      // this.fetchWorkflowList()
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
      border: 1px solid $border-color;
      background-color: $card-bg-color-1;
      margin-top: 20px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      padding: 6px 20px;
      font-size: 14px;

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
