<template>
  <div v-if="visible">
    <el-dialog
      title="部署工作流"
      :visible="visible"
      @close="onCancel"
      fullscreen
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :destroy-on-close="true"
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
        <div class="form-list-wrapper" v-show="canLink">
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
              <div class="form-name">{{ ele.formName }}</div>
              <el-select v-model="formList[index].selectedVersion">
                <el-option
                  v-for="(item, idx) in ele.versionList"
                  :key="idx"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <div class="operations">
                <!-- <el-popover
                  popper-class="popover-item"
                  placement="right"
                  trigger="click"
                  :width="500"
                  :visible-arrow="false"
                  style="position: relative;"
                >
                  <form-preview
                    :formTree="JSON.parse(ele.selectedVersion).formVersionFile"
                  ></form-preview>
                  <span class="preview-button" slot="reference"> 查看 </span>
                </el-popover> -->
                <!-- <Popover
                  v-resize="popoverResize"
                  ref="popoverRef"
                  trigger="click"
                  :getPopupContainer="
                    (triggerNode) => triggerNode.parentElement
                  "
                  :destroyTooltipOnHide="true"
                  placement="left"
                  :arrowPointAtCenter="true"
                >
                  <div slot="content">
                    <form-preview
                      :formTree="
                        JSON.parse(ele.selectedVersion).formVersionFile
                      "
                    ></form-preview>
                  </div>
                  <span class="preview-button"> 查看 </span>
                </Popover> -->
                <div
                  v-resize="popoverResize"
                  class="preview-form"
                  ref="popoverRef"
                >
                  <form-preview
                    :formTree="JSON.parse(ele.selectedVersion).formVersionFile"
                  ></form-preview>
                </div>
                <span class="preview-button" @click="lookover($event, index)"
                  >查看</span
                >
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
import {
  fetchFormList,
  fetchFormVersionList,
  fetchFormVersion,
} from '../../../api/workflowForm';
import { fetchModelInfo, updateModel } from '../../../api/workflowModel';
import { Popover } from 'ant-design-vue';

export default {
  name: 'ModelEditor',
  components: {
    WorkflowInfo,
    FormPreview,
    Popover,
  },
  directives: {
    // 使用局部注册指令的方式
    resize: {
      // 指令的名称
      bind(el, binding) {
        // el为绑定的元素，binding为绑定给指令的对象
        let width = '',
          height = '';
        function isReize() {
          const style = document.defaultView.getComputedStyle(el);
          if (width !== style.width || height !== style.height) {
            binding.value(); // 关键
          }
          width = style.width;
          height = style.height;
        }
        el.__vueSetInterval__ = setInterval(isReize, 300);
      },
      unbind(el) {
        clearInterval(el.__vueSetInterval__);
      },
    },
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
      previewVisible: false,
      currentIndex: -1,
    };
  },
  mounted() {},
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
          value: `${this.workflow.projectName}-${this.workflow.applicationName}`,
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
    startFormVersionId: {
      handler(value) {
        this.updateStartFormVersionId({
          startFormVersionId: value
        })
      }
    }
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
    popoverResize() {
      const popoverRef = this.$refs.popoverRef[this.currentIndex] || null;
      if (!popoverRef) return;
      this.$nextTick(() => {
        popoverRef.style.top = '-' + popoverRef.clientHeight / 2 + 'px';
        popoverRef.style.left = '-' + (popoverRef.clientWidth + 10) + 'px';
      });
    },
    lookover(evet, index) {
      const popoverRef = this.$refs.popoverRef;
      if (this.currentIndex === index) {
        popoverRef[index].style.visibility = 'hidden';
        this.currentIndex = -1;
        return;
      }
      if (
        popoverRef[this.currentIndex] &&
        popoverRef[this.currentIndex].style.visibility === 'visible'
      ) {
        popoverRef[this.currentIndex].style.visibility = 'hidden';
      }
      console.log(evet, 'popoverRef');
      popoverRef[index].style.visibility = 'visible';
      this.$nextTick(() => {
        popoverRef[index].style.top =
          '-' + popoverRef[index].clientHeight / 2 + 'px';
        popoverRef[index].style.left =
          '-' + (popoverRef[index].clientWidth + 10) + 'px';
      });
      this.currentIndex = index;
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
          const gatewatTaskKye =
            this.modelTaskConfigs[gatewayNodeIndex].gatewayCondition.value;
          if (gatewatTaskKye === this.modelTaskConfig.taskDefKey) {
            this.modelTaskConfigs[gatewayNodeIndex].gatewayCondition = {
              ...this.modelTaskConfigs[gatewayNodeIndex].gatewayCondition,
              pos: '',
              posLabel: '',
            };
          }
        }
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
        const gatewayNodeIndex = this.modelTaskConfigs.findIndex(
          ({ gatewayCondition }) =>
            gatewayCondition && Object.keys(gatewayCondition).length > 0
        );
        if (gatewayNodeIndex !== -1) {
          const gatewatTaskKye =
            this.modelTaskConfigs[gatewayNodeIndex].gatewayCondition.value;
          if (gatewatTaskKye === this.modelTaskConfig.taskDefKey) {
            this.modelTaskConfigs[gatewayNodeIndex].gatewayCondition = {
              ...this.modelTaskConfigs[gatewayNodeIndex].gatewayCondition,
              pos: '',
              posLabel: '',
            };
          }
        }
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
      this.currentIndex = -1;
      this.formContent = {};
      (this.pageInfo = {
        limit: 10,
        page: 1,
        total: 0,
      }),
        (this.modelTaskConfigs = []);
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
        if (
          this.modelTaskConfig.taskDefKey &&
          this.shapeType !== BpmnShapeType.START_EVENT
        )
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
      for (let obj in data.modelTasks) {
        if (obj.startsWith('Activity') || obj.startsWith('Gateway'))
          this.modelTaskConfigs.push(data.modelTasks[obj]);
      }
      // this.modelTaskConfigs = Object.values(data.modelTasks);
      this.modelInfo = data.modelInfo;
      this.startFormVersionId = data.modelInfo?.startFormVersionId;
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
        this.pageInfo.page = 1;
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
    async fetchFormVersion() {
      const formVersionId =
        this.shapeType === BpmnShapeType.START_EVENT
          ? this.modelInfo.startFormVersionId
          : this.modelTaskConfig.taskFormVersionId;
      if (!formVersionId) return;
      const { data, code, msg } = await fetchFormVersion({
        formVersionId,
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
      this.currentIndex = -1;
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
  grid-gap: 20px;

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
  flex-shrink: 0;
  border: 1px solid $border-color;
  border-radius: 4px;
  background: $card-bg-color-2;

  .title {
    font-size: 14px;
    line-height: 20px;
    font-weight: 400;
    padding: 20px;
    border-bottom: 1px solid $border-color;
  }

  .search-form {
    margin-top: 25px;
  }

  .content-wrapper {
    margin: 10px 0;
    min-height: 898px;
    padding: 0 5px;

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

      .form-name {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

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
        position: relative;
        .el-popover.popover-item {
          position: absolute;
          width: 500px;
          max-height: 50vh;
          overflow: auto;
        }

        .preview-form {
          position: absolute;
          visibility: hidden;
          background-color: #212739;
          z-index: 3000;
          max-height: 50vh;
          max-width: 500px;
          overflow: auto;
          padding: 10px;
          border: 1px solid #666666;
          transition: left 1s linear 0s;
          transition: top 1s linear 0s;
          min-width: 300px;
        }
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

.popover-item {
  width: fit-content;
}
</style>
