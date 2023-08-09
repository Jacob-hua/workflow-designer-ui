<template>
  <el-dialog
    title="工单详情"
    top="1vh"
    fullscreen
    :visible="visible"
    @close="onClose"
    :close-on-click-modal="false"
  >
    <div class="container">
      <bpmn-info
        :xml="workflow.processDeployResource"
        :processDisplayInfo="processDisplayInfo"
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
      <div>
        <div class="title">工作流操作详情</div>
        <div class="process-content">
          <el-timeline>
            <el-timeline-item
              :timestamp="taskName"
              placement="top"
              v-for="{
                taskName,
                formDataList,
                assigneeStatus,
                status,
                commentList,
                taskId,
                assigneeInfoDTOList,
              } in trackList"
              :key="taskId"
            >
              <div class="contant">
                <div
                  v-for="(
                    { formContent, assignee: formAssignee, time }, index
                  ) in formDataList"
                  :key="index"
                >
                  <div v-if="formContent" class="form">
                    <preview
                      :context="context"
                      :itemList="formContent.list"
                      :formData="formContent.data"
                      :formConf="formContent.config"
                      :downloadFun="downloadFile.bind(this)"
                    ></preview>
                  </div>
                  <div
                    v-if="assigneeStatus[formAssignee] === 'run'"
                    class="execute-info"
                  >
                    <div>
                      <i class="el-icon-check executing"></i>
                      <span
                        v-for="(assigner, index) in assigneeInfoDTOList"
                        :key="index"
                        :title="assigner.account"
                        class="assigner-card"
                        >{{ assigner.username }}</span
                      >
                      <span>操作中</span>
                    </div>
                  </div>
                  <div
                    v-if="assigneeStatus[formAssignee] === 'completed'"
                    class="execute-info"
                  >
                    <div>
                      <i class="el-icon-check success"></i>
                      <span
                        v-for="(assigner, index) in assigneeInfoDTOList"
                        :key="index"
                        :title="assigner.account"
                        class="assigner-card"
                        >{{ assigner.username }}</span
                      >
                      <span>完成</span>
                    </div>
                    <span>{{ time }}</span>
                  </div>
                  <div
                    v-if="assigneeStatus[formAssignee] === 'hang'"
                    class="execute-info"
                  >
                    <div>
                      <i class="el-icon-check warning"></i>
                      <span
                        v-for="(assigner, index) in assigneeInfoDTOList"
                        :key="index"
                        :title="assigner.account"
                        class="assigner-card"
                        >{{ assigner.username }}</span
                      >
                      <span>挂起</span>
                    </div>
                    <span>{{ time }}</span>
                  </div>
                  <div
                    v-if="assigneeStatus[formAssignee] === 'timedOut'"
                    class="execute-info"
                  >
                    <div>
                      <i class="el-icon-time warning"></i>
                      <span
                        v-for="(assigner, index) in assigneeInfoDTOList"
                        :key="index"
                        :title="assigner.account"
                        class="assigner-card"
                        >{{ assigner.username }}</span
                      >
                      <span>超时</span>
                    </div>
                    <span>{{ time }}</span>
                  </div>
                  <div v-if="assigneeStatus[formAssignee] === 'rejected'">
                    <div
                      v-for="(
                        { comments, assignee: commentAssignee }, index
                      ) in commentList"
                      :key="index"
                    >
                      <div v-if="commentAssignee === formAssignee">
                        <div class="execute-info">
                          <div>
                            <i class="el-icon-close warning"></i
                            ><span
                              v-for="(assigner, index) in assigneeInfoDTOList"
                              :key="index"
                              :title="assigner.account"
                              class="assigner-card"
                              >{{ assigner.username }}</span
                            >
                            <span>驳回 </span>
                          </div>
                          <span>{{ time }}</span>
                        </div>
                        <div
                          v-for="({ message }, index) in comments"
                          :key="index"
                        >
                          <i class="el-icon-warning-outline warning"></i>
                          <span>{{ message }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-if="assigneeStatus[formAssignee] === 'discard'">
                    <div
                      v-for="(
                        { comments, assignee: commentAssignee }, index
                      ) in commentList"
                      :key="index"
                    >
                      <div v-if="commentAssignee === formAssignee">
                        <div class="execute-info">
                          <div>
                            <i class="el-icon-close warning"></i
                            ><span
                              v-for="(assigner, index) in assigneeInfoDTOList"
                              :key="index"
                              :title="assigner.account"
                              class="assigner-card"
                              >{{ assigner.username }}</span
                            >
                            <span>废弃 </span>
                          </div>
                          <span>{{ time }}</span>
                        </div>
                        <div
                          v-for="({ message }, index) in comments"
                          :key="index"
                        >
                          <i class="el-icon-warning-outline warning"></i>
                          <span>{{ message }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-if="undefineStatus(status)">
                    <div
                      v-for="(
                        { comments, assignee: commentAssignee }, index
                      ) in commentList"
                      :key="index"
                    >
                      <div v-if="commentAssignee === formAssignee">
                        <div class="execute-info">
                          <div>
                            <i class="el-icon-close warning"></i
                            ><span
                              v-for="(assigner, index) in assigneeInfoDTOList"
                              :key="index"
                              :title="assigner.account"
                              class="assigner-card"
                              >{{ assigner.username }}</span
                            >
                            <span>终止 </span>
                          </div>
                          <span>{{ time }}</span>
                        </div>
                        <div
                          v-for="({ message }, index) in comments"
                          :key="index"
                        >
                          <i class="el-icon-warning-outline warning"></i>
                          <span>{{ message }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
    </div>
    <span
      slot="footer"
      class="dialog-footer"
      v-if="
        resource === 'runtime' && userInfo.account === workflow.starterAssignee
      "
    >
      <el-button type="primary" @click="handleClickInvalidate">作 废</el-button>
      <!-- <el-button type="primary" @click="visible = false"
        >撤 回</el-button
      > -->
    </span>
    <span slot="footer" class="dialog-footer" v-if="resource === 'history'">
      <el-button type="primary" @click="handleExport">导 出</el-button>
    </span>
    <RuntimeInvalidatedConfirmation
      :visible.sync="invalidatedConfirmationVisible"
      @submit="oninvalidatedConfirmationSubmit"
    ></RuntimeInvalidatedConfirmation>
  </el-dialog>
</template>

<script>
import BpmnInfo from "@/component/BpmnInfo.vue";
import preview from "@/plugin/FormDesign/component/preview";
import RuntimeInvalidatedConfirmation from "./RuntimeInvalidatedConfirmation.vue";
import {
  getExecuteDetail,
  downloadTaskAttachmentFile,
  putCancelInstance,
} from "@/api/unit/api.js";
import { processVariable, downloadFile } from "@/api/globalConfig";
import { exportDetail } from "@/api/historyWorkflow";
import { downloadFile as downBold } from '../../../util/file';
import { mapState } from "vuex";

export default {
  components: {
    BpmnInfo,
    preview,
    RuntimeInvalidatedConfirmation,
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
    detailFunc: {
      type: Function,
      default: async (processInstanceId, assignee) => {
        const { errorInfo, result } = await getExecuteDetail({
          processInstanceId,
          assignee,
        });
        if (errorInfo.errorCode) {
          return;
        }
        return result;
      },
    },
    resource: {
      type: String,
    },
  },
  data() {
    return {
      workflow: {},
      context: {},
      startFormContent: {
        list: [],
        data: {},
        config: {},
      },
      invalidatedConfirmationVisible: false,
    };
  },
  computed: {
    ...mapState("account", ["tenantId", "userInfo"]),
    trackList() {
      const trackList = this.workflow.trackList ?? [];
      return trackList.map((track) => {
        if (!track) {
          return track;
        }
        track.formDataList = handleFormDataList(track);
        track.assigneeStatus = handleAssigneeStatus(track);
        return track;
      });
      function handleFormDataList({ formDataList = [] }) {
        return formDataList.map((item) => {
          if (!item.formData) {
            return { ...item };
          }
          const formContent = JSON.parse(item.formData);
          formContent.config["disabled"] = true;
          formContent.config["readOnly"] = true;
          return { ...item, formContent };
        });
      }
      function handleAssigneeStatus({ assignee, status }) {
        assignee = assignee ?? "";
        status = status ?? "";
        const statusArray = status.split(",");
        return assignee.split(",").reduce(
          (result, name, index) => ({
            ...result,
            [name]: statusArray[index],
          }),
          {}
        );
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
          label: "能源系统 ",
          value: this.$getMappingName(this.workflow.systemType),
        },
        {
          label: "创建人",
          value: this.workflow.starter,
        },
      ];
    },
  },
  async mounted() {
    this.fetchExecuteDetail();
    this.context = await this.getContext();
  },
  methods: {
    async getContext() {
      if (!this.processInstanceId) {
        return {};
      }
      const { result } = await processVariable({
        processInstanceId: this.processInstanceId ?? "",
      });
      return result;
    },
    undefineStatus(status = "") {
      return status
        .split(",")
        .some(
          (status) =>
            ![
              "completed",
              "run",
              "rejected",
              "hang",
              "timedOut",
              "discard",
            ].includes(status)
        );
    },
    onClose() {
      this.$emit("close");
      this.$emit("update:visible", false);
    },
    async downloadFile(result) {
      return await downloadTaskAttachmentFile({
        attachmentId: result.url,
      });
    },
    async startFormDownloadFile({ url }) {
      return await downloadFile({
        contentId: url,
      });
    },
    async fetchExecuteDetail() {
      try {
        const result = await Promise.resolve(
          this.detailFunc(this.processInstanceId, this.userInfo.account)
        );
        this.workflow = result ?? {};
        this.startFormContent = JSON.parse(result.startFormData);
        this.startFormContent.config["disabled"] = true;
        this.startFormContent.config["readOnly"] = true;
      } catch (error) {}
    },
    handleClickInvalidate() {
      this.invalidatedConfirmationVisible = true;
    },
    oninvalidatedConfirmationSubmit({ invalidatedReason }) {
      putCancelInstance({
        cancelReason: invalidatedReason,
        processInstanceId: this.workflow.processInstanceId,
        taskId: this.workflow.newTaskId,
        discard: true,
        assignee: this.userInfo.account,
      }).then((res) => {
        this.$message.success("废弃成功");
        this.$emit("close");
      });
    },
    handleExport() {
      exportDetail({
        processInstanceId: this.workflow.processInstanceId,
        assignee: this.workflow.starterAssignee,
      }).then((res) => {
        console.log(res, "ddd");
        downBold(`${this.workflow.workOrderName}`, 'xlsx', res)
      });
    },
  },
};
</script>

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;

  & > div:last-child {
    display: flex;
    flex-direction: column;
  }
}

.title {
  margin: 38px 0 20px 0;
  font-size: 14px;
  color: $font-color;
}

.process-content {
  height: 260px;
  overflow: auto;
  padding: 10px 10px;
}

/deep/ .el-timeline-item__tail {
  border-left: 2px solid #39c449;
}

/deep/ .el-timeline-item__node {
  background-color: #39c449;
}

.contant {
  line-height: 54px;
  padding: 0px 20px 0px 20px;
  background-color: $card-bg-color-1;
  border: 1px solid $border-color-1;
  border-radius: 8px;
  color: $font-color;

  .form {
    padding-top: 20px;
  }

  .execute-info {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
}

.el-icon-check {
  font-size: 20px;
  margin-right: 20px;
}

.el-icon-time {
  font-size: 20px;
  margin-right: 20px;
}

.el-icon-warning-outline {
  font-size: 20px;
  margin-right: 20px;
}

.el-icon-close {
  font-size: 20px;
  margin-right: 20px;
}

.success {
  background-color: #009900;
  color: white;
  border-radius: 50%;
  border: none;
}

.warning {
  background-color: #ffab00;
  color: white;
  border-radius: 50%;
  border: none;
}

.executing {
  background-color: #999999;
  color: white;
  border-radius: 50%;
  border: none;
}

.assigner-card {
  display: inline-block;
  margin-right: 10px;
  background-color: #009efb;
  border: 1px solid #009efb;
  border-radius: 4px;
  line-height: 30px;
  padding: 0 5px;
}

.dialog-footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: #1b1e2d;
  z-index: 1;
  padding-bottom: 10px;
}
</style>
