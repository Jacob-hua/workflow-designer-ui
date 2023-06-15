<template>
  <el-dialog
    title="操作工作流"
    :visible="visible"
    top="1vh"
    fullscreen
    @close="onDialogClose"
  >
    <div class="container">
      <div>
        <bpmn-info
          :xml="workflow.processDeployResource"
          :processDisplayInfo="processDisplayInfo"
          @loaded="onBpmnInfoLoaded"
        >
          <div>
            <preview
              :context="context"
              :itemList="startFormContent.list"
              :formData="startFormContent.data"
              :formConf="startFormContent.config"
              :downloadFun="startFormDownloadFile.bind(this)"
            ></preview>
          </div>
        </bpmn-info>
        <div class="action-wrapper" v-if="activeAction">
          <el-tabs
            v-model="activeAction"
            type="border-card"
            @tab-click="onSelectAction"
          >
            <el-tab-pane
              v-for="{
                label,
                value,
                component: { name, events, props },
              } in actions"
              :label="label"
              :name="value"
              :key="value"
            >
              <div class="pane-container" v-if="!roleBoolean">
                <img
                  :src="require('../../../assets/image/runtime/no-power.svg')"
                />
                <div>无权限</div>
              </div>
              <component v-else :is="name" v-on="events" v-bind="props" />
            </el-tab-pane>
          </el-tabs>
        </div>
        <div class="no-action" v-else>
          <img :src="require('../../../assets/image/common/no_data.png')" />
        </div>
      </div>
      <div>
        <div class="form-title">表单内容</div>
        <div class="form-preview">
          <preview
            :context="context"
            :itemList="formContent.list"
            :formConf="formContent.config"
            :uploadFun="uploadFile.bind(this)"
            :downloadFun="downloadFile.bind(this)"
            :checkStockFun="checkStock.bind(this)"
            :cancleStockFun="cancleStock.bind(this)"
            :checkStockAndUseFun="checkStockAndUse.bind(this)"
            v-if="formShow"
            ref="preview"
          ></preview>
        </div>
      </div>
    </div>
    <span slot="footer">
      <el-button class="submit-button" @click="onExecute" :disabled="hang"
        >执 行</el-button
      >
      <el-button class="cancel-button" @click="onCancel">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import BpmnInfo from "@/component/BpmnInfo.vue";
import RuntimeImplementAgency from "./RuntimeImplementAgency.vue";
import RuntimeImplementCirculate from "./RuntimeImplementCirculate.vue";
import RuntimeImplementSignature from "./RuntimeImplementSignature.vue";
import RuntimeImplementHang from "./RuntimeImplementHang.vue";
import RuntimeImplementReject from "./RuntimeImplementReject.vue";
import RuntimeImplementTermination from "./RuntimeImplementTermination.vue";
import RuntimeImplementExecutor from "./RuntimeImplementExecutor.vue";
import preview from "@/plugin/FormDesign/component/preview";
import {
  designFormDesignServiceAll,
  postCompleteTask,
  getProcessNodeInfo,
  getExecuteDetail,
  uploadTaskAttachmentFile,
  downloadTaskAttachmentFile,
  checkStockAndUse,
  checkStock,
  cancleWithSort,
  cancleStock,
} from "@/api/unit/api.js";
import { processVariable, downloadFile } from "@/api/globalConfig";
import { mapState } from "vuex";

export default {
  components: {
    BpmnInfo,
    preview,
    RuntimeImplementAgency,
    RuntimeImplementCirculate,
    RuntimeImplementSignature,
    RuntimeImplementHang,
    RuntimeImplementReject,
    RuntimeImplementTermination,
    RuntimeImplementExecutor,
    checkStock,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    processInstanceId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      attachmentList: [],
      workflow: {},
      formContent: {},
      startFormContent: {
        list: [],
        data: {},
        config: {},
      },
      formShow: false,
      roleBoolean: true,
      activeAction: undefined,
      actionsConfig: {
        Agency: {
          label: "代办",
          value: "Agency",
          component: ({ workflow, onAgencyCompleted }) => ({
            name: "RuntimeImplementAgency",
            props: {
              workflow,
            },
            events: {
              completed: onAgencyCompleted,
            },
          }),
        },
        Circulate: {
          label: "传阅",
          value: "Circulate",
          component: ({ workflow, onAgencyCompleted }) => ({
            name: "RuntimeImplementCirculate",
            props: {
              workflow,
            },
            events: {
              completed: onAgencyCompleted,
            },
          }),
        },
        Signature: {
          label: "加减签",
          value: "Signature",
          component: ({ workflow, onAgencyCompleted }) => ({
            name: "RuntimeImplementSignature",
            props: {
              workflow,
            },
            events: {
              completed: onAgencyCompleted,
            },
          }),
        },
        Hang: {
          label: "挂起",
          value: "Hang",
          component: ({ workflow, onTaskSuccess }) => ({
            name: "RuntimeImplementHang",
            props: {
              workflow,
            },
            events: {
              hang: onTaskSuccess,
            },
          }),
        },
        Reject: {
          label: "驳回",
          value: "Reject",
          component: ({ workflow, onTaskSuccess }) => ({
            name: "RuntimeImplementReject",
            props: {
              workflow,
            },
            events: {
              rejected: onTaskSuccess,
            },
          }),
        },
        Terminate: {
          label: "终止",
          value: "Terminate",
          component: ({ workflow, onTaskSuccess }) => ({
            name: "RuntimeImplementTermination",
            props: {
              workflow,
            },
            events: {
              terminated: onTaskSuccess,
            },
          }),
        },
        NoExecutor: {
          label: "指定操作人",
          value: "NoExecutor",
          component: ({ workflow, onSelectExecutor }) => ({
            name: "RuntimeImplementExecutor",
            props: {
              workflow,
            },
            events: {
              selectExecutor: onSelectExecutor,
            },
          }),
        },
      },
      curExecuteShape: undefined,
      noExecutor: false,
      iBpmnViewer: {},
      context: {},
    };
  },
  computed: {
    ...mapState("account", ["tenantId", "userInfo"]),
    hang() {
      if (!this.workflow.curTrack) {
        return false;
      }
      return this.workflow.curTrack.status.split(",").includes("hang");
    },
    reject() {
      if (!this.workflow.curTrack) {
        return false;
      }
      return this.workflow.curTrack.status.split(",").includes("reject");
    },
    terminate() {
      if (!this.workflow.curTrack) {
        return false;
      }
      return this.workflow.curTrack.status.split(",").includes("terminate");
    },
    actions() {
      if (!this.curExecuteShape) {
        return [];
      }
      if (this.hang) {
        return [makeComponent.call(this, "Hang")];
      }
      const temps = [];
      if (this.noExecutor) {
        temps.push(makeComponent.call(this, "NoExecutor"));
      }
      let shapeActions =
        this.iBpmnViewer
          .getShapeInfo(this.curExecuteShape)
          ["actions"]?.split(",") ?? [];
      if (curTaskIsFirstTask.call(this)) {
        shapeActions = shapeActions.filter((action) => action !== "Reject");
      }
      const actions = [
        "Agency",
        "Circulate",
        "Signature",
        "Hang",
        "Reject",
        "Terminate",
      ];
      return actions
        .filter((action) => shapeActions.includes(action))
        .map(makeComponent.bind(this))
        .concat(temps);

      function curTaskIsFirstTask() {
        const curTaskIndex = this.iBpmnViewer
          .elementRegistryFilter(({ type }) => type === "bpmn:UserTask")
          .findIndex(({ id }) => id === this.workflow.taskKey);
        return curTaskIndex === 0;
      }

      function makeComponent(action) {
        const component = this.actionsConfig[action].component({
          workflow: this.workflow,
          onAgencyCompleted: this.onAgencyCompleted,
          onSelectExecutor: this.onSelectExecutor,
          onTaskSuccess: this.onTaskSuccess,
        });
        return { ...this.actionsConfig[action], component };
      }
    },
    processDisplayInfo() {
      return [
        {
          label: "工单编码",
          value: this.workflow.processNumber,
        },
        {
          label: "工单类型",
          value: this.workflow.processDeployName,
        },
        {
          label: "创建时间",
          value: this.workflow.startTime,
        },
        // {
        //   label: '应用项目',
        //   value: this.$getMappingName(this.workflow.ascription),
        // },
        {
          label: "能源系统",
          value: this.$getMappingName(this.workflow.systemType),
        },
        {
          label: "创建人",
          value: this.workflow.starter,
        },
      ];
    },
  },
  watch: {
    actions(actions) {
      if (!this.activeAction) {
        this.activeAction = actions[0]?.value;
      }
    },
  },
  async mounted() {
    await this.fetchExecuteDetail();
    await this.fetchProcessNodeInfo();
    this.context = await this.getContext();
    window.addEventListener("beforeunload", (e) => this.beforeunloadHandler(e));
    window.addEventListener("unload", this.updateHandler);
  },
  methods: {
    beforeunloadHandler(e) {
      e = e || window.event;
      if (e) {
        e.returnValue = "关闭提示";
      }
      return "关闭提示";
    },
    updateHandler() {
      let userInfo =
        (sessionStorage.getItem("loginData") &&
          JSON.parse(sessionStorage.getItem("loginData"))) ||
        "";
      let url = process.env.VUE_APP_BASE_API
        ? `${process.env.VUE_APP_BASE_API}/inventoryfac/cancle`
        : "/inventoryfac/cancle";
      fetch(url, {
        method: "POST",
        body: JSON.stringify({ taskKey: this.workflow.newTaskId }),
        headers: {
          "Content-Type": "application/json",
          "X-SIACT-TOKEN": userInfo.token,
          "X-SIACT-SOURCE": "PC",
          "X-SIACT-TOKEN-TYPE": "1",
        },
        keepalive: true,
      });
    },
    async getContext() {
      if (!this.processInstanceId) {
        return {};
      }
      const { result } = await processVariable({
        processInstanceId: this.processInstanceId ?? "",
      });
      return result;
    },
    onAgencyCompleted() {
      this.fetchExecuteDetail();
    },
    onTaskSuccess() {
      this.$emit("taskSuccess");
    },
    async onDialogClose() {
      this.removeListener();
      const { result } = await cancleStock({
        taskKey: this.workflow.newTaskId,
      });
      this.formShow = false;
      this.$emit("close");
    },
    async onCancel() {
      this.removeListener();
      const { result } = await cancleStock({
        taskKey: this.workflow.newTaskId,
      });
      this.$emit("close");
    },
    onSelectExecutor(value) {
      this.$set(this.workflow, "executors", value);
    },
    onSelectAction() {
      let { permissions } = JSON.parse(sessionStorage.getItem("loginData"));
      let proJectRole =
        permissions.filter((item) => {
          return item.projectCode === this.workflow.ascription;
        })[0]?.permissionSet || [];
      let findEle = proJectRole.findIndex((item) => {
        return item.frontRoute === "RunTime" + this.activeAction;
      });
      if (findEle === -1 && this.activeAction !== "NoExecutor") {
        this.roleBoolean = false;
      } else {
        this.roleBoolean = true;
      }
    },
    onBpmnInfoLoaded(iBpmnViewer) {
      this.iBpmnViewer = iBpmnViewer;
      if (!this.workflow.trackList) {
        return;
      }
      const completedTaskList = this.workflow.trackList
        .filter(({ taskKey }) => taskKey !== this.workflow.taskKey)
        .map(({ taskKey }) => taskKey);
      iBpmnViewer
        .elementRegistryFilter(({ type }) => type === "bpmn:UserTask")
        .forEach((element) => {
          if (element.id === this.workflow.taskKey) {
            iBpmnViewer.canvasAddMarker(element, "svgOncomplete");
            return;
          }
          if (completedTaskList.includes(element.id)) {
            iBpmnViewer.canvasAddMarker(element, "svgComplete");
            return;
          }
          iBpmnViewer.canvasAddMarker(element, "svgIncomplete");
        });
      const value = iBpmnViewer.elementRegistryFind(
        ({ id }) => id === this.workflow.taskKey
      );
      this.curExecuteShape = value;
      if (value) {
        this.fetchFormData(value.businessObject.formKey);
      }
    },
    async onExecute() {
      if (this.formShow) {
        const { formData, metaDataList } = await this.$refs.preview.submit();
        this.completeTask(
          { ...this.formContent, data: formData, list: metaDataList },
          formData
        );
        return;
      }
      if (
        this.noExecutor &&
        (!Array.isArray(this.workflow.executors) ||
          this.workflow.executors.length === 0)
      ) {
        this.$message.error("后续操作人为空！");
        return;
      }
      this.completeTask();
    },
    async completeTask(formData = {}, data = {}) {
      const { errorInfo } = await postCompleteTask({
        assignee: this.userInfo.account,
        nextAssignee: this.workflow.executors?.[0].userId,
        commentList: [],
        formData,
        attachmentList: this.attachmentList,
        processInstanceId: this.workflow.processInstanceId,
        processKey: this.workflow.processDeployKey,
        taskId: this.workflow.newTaskId,
        taskKey: this.workflow.taskKey,
        taskName: this.workflow.processDeployName,
        variable: data,
      });
      if (errorInfo.errorCode) {
        this.$message.error(errorInfo.errorMsg);
        return;
      }
      if (this.formContent && this.formContent.config) {
        this.formContent.config["isSubmit"] = true;
      }
      this.formShow = false;
      this.$message.success("操作成功");
      this.$emit("taskSuccess");
    },
    async fetchFormData(formKey) {
      if (formKey) {
        let docName = formKey.split(":")[2];
        const { errorInfo, result } = await designFormDesignServiceAll({
          status: "enabled,deleted",
          tenantId: this.tenantId,
          ascription: this.workflow.ascription,
          business: this.workflow.business,
          numberCode: "",
          name: "",
          docName: docName,
        });
        if (errorInfo.errorCode) {
          this.$message.error(errorInfo.errorMsg);
          return;
        }
        if (!Array.isArray(result)) {
          return;
        }
        this.formContent = JSON.parse(result[0]?.content ?? "{}");
        this.formShow = true;
      } else {
        this.formContent = {};
        this.formShow = false;
      }
    },
    async uploadFile({ name, raw: file }) {
      const uploadParameters = new FormData();
      uploadParameters.append("name", name);
      uploadParameters.append("type", "file");
      uploadParameters.append("file", file);
      uploadParameters.append("description", "");
      uploadParameters.append(
        "processInstanceId",
        this.workflow.processInstanceId
      );
      uploadParameters.append("taskId", this.workflow.newTaskId);
      const { errorInfo, result } = await uploadTaskAttachmentFile(
        uploadParameters
      );
      if (errorInfo.errorCode) {
        this.$message.error(errorInfo.errorMsg);
        return;
      }
      this.attachmentList = [result, ...this.attachmentList];
      return result;
    },
    async downloadFile({ url }) {
      return await downloadTaskAttachmentFile({
        attachmentId: url,
      });
    },
    async startFormDownloadFile({ url }) {
      return await downloadFile({
        contentId: url,
      });
    },
    async fetchProcessNodeInfo() {
      const { errorInfo, result } = await getProcessNodeInfo({
        processInstanceId: this.workflow.processInstanceId,
      });
      if (errorInfo.errorCode) {
        this.$message.error(errorInfo.errorMsg);
        return;
      }
      if (this.hang || this.reject || this.terminate) {
        return;
      }
      this.noExecutor = result.some(
        ({ assignee, candidateGroup, candidateUser }) =>
          assignee === null && candidateGroup === null && candidateUser === null
      );
      if (this.noExecutor) {
        this.$message.warning("下一步无操作人");
      }
    },
    async fetchExecuteDetail() {
      try {
        const { errorInfo, result } = await getExecuteDetail({
          processInstanceId: this.processInstanceId,
          assignee: this.userInfo.account,
        });
        if (errorInfo.errorCode) {
          this.$message.error(errorInfo.errorMsg);
          return;
        }
        result.curTrack = this.getCurTrack(result);
        this.workflow = {
          ...result,
          newTaskId: this.calculateNewTaskId(result, this.userInfo.account),
        };
        this.startFormContent = JSON.parse(result.startFormData);
        this.startFormContent.config["disabled"] = true;
        this.startFormContent.config["readOnly"] = true;
      } catch (error) {}
    },
    getCurTrack(workflow) {
      if (!Array.isArray(workflow.trackList)) {
        return;
      }
      return workflow.trackList.at(-1);
    },
    calculateNewTaskId(workflow, account) {
      if (assigneesInclude(workflow, account)) {
        return getTaskIdBy(workflow, account);
      }
      if (candidateUsersInclude(workflow, account)) {
        return candidateUsersInclude(workflow, account).taskId;
      }

      function assigneesInclude(workflow, account) {
        if (!workflow.curTrack) {
          return;
        }
        return workflow.curTrack.assignee?.split(",").includes(account);
      }

      function getTaskIdBy(workflow, account) {
        return workflow.curTrack.taskId.split(",")[
          workflow.curTrack.assignee?.split(",").indexOf(account)
        ];
      }

      function candidateUsersInclude(workflow, account) {
        if (!workflow.curTrack) {
          return;
        }
        return workflow.curTrack.candidateUsers?.find(
          ({ candidateUsers = [] }) => candidateUsers.includes(account)
        );
      }
    },
    async checkStockAndUse(itemnum, operationFlag) {
      const { result } = await checkStockAndUse({
        taskKey: this.workflow.newTaskId,
        itemnum,
        operationFlag,
      });
      return result;
    },
    async cancleStock(list) {
      await cancleWithSort({
        taskKey: this.workflow.newTaskId,
        returnSpareDTOS: list,
      });
    },
    async checkStock(itemnum) {
      const { result } = await checkStock({
        taskKey: this.workflow.newTaskId,
        itemnum,
      });
      return result;
    },
    removeListener() {
      window.removeEventListener("beforeunload", (e) =>
        this.beforeunloadHandler(e)
      );
      window.removeEventListener("unload", this.updateHandler);
    },
  },
  beforeDestroy() {
    this.removeListener();
  },
};
</script>

<style scoped lang="scss">
@import "../index.scss";

@include paneContainer;

.container {
  display: flex;

  & > div:first-child {
    flex: 3;
  }

  & > div:last-child {
    flex: 1;
    padding: 0px 20px;
    overflow: hidden;
  }
}

.action-wrapper {
  margin-top: 30px;
  @include runtimeContentTab;
}

.no-action {
  border: 1px solid $border-color-1;
  margin-top: 30px;
  height: 270px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.form-title {
  color: $font-color;
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
}

.form-preview {
  height: 685px;
  margin-top: 15px;
  background: $card-bg-color-1;
  border: 1px solid $border-color-1;
  border-radius: 8px;
  padding: 12px 0;
  display: flex;
  overflow-x: auto;

  &::-webkit-scrollbar {
    display: block !important;
    width: 5px;
    height: 8px;
    background-color: $card-bg-color-1;
  }

  &::-webkit-scrollbar-thumb {
    background: $border-color-1;
  }

  &::-webkit-scrollbar-corner {
    background-color: $card-bg-color-1;
  }

  .el-form {
    flex-shrink: 0;
  }
}

.submit-button {
  @include primaryBtn;
}

.cancel-button {
  @include cancelBtn;
}
</style>
