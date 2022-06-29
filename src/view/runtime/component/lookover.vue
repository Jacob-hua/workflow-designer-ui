<template>
  <el-dialog title="查看流程信息" :visible="visible" width="70%" @close="onClose">
    <div>
      <ProcessInformation
        :xml="workflow.processDeployResource"
        :processDisplayInfo="processDisplayInfo"
      ></ProcessInformation>
    </div>
    <div style="position: relative">
      <div style="margin: 20px 0px 10px 0px; font-weight: 700">工作流执行详情</div>
      <div class="processDetail">
        <div class="block">
          <el-timeline>
            <el-timeline-item
              :timestamp="taskName"
              placement="top"
              v-for="({ taskName, formDataList, endTime, status, commentList }, index) in trackList"
              :key="index"
            >
              <div class="contant">
                <div
                  v-for="({ formContent, status: formStatus, assignee: formAssignee }, index1) in formDataList"
                  :key="index1"
                >
                  <div v-if="formContent" class="form">
                    <preview
                      :itemList="formContent.list"
                      :formConf="formContent.config"
                      :downloadFun="downloadFile.bind(this)"
                    ></preview>
                  </div>
                  <div v-if="formStatus === 'completed'">
                    <i class="el-icon-check" :class="endTime === '-' ? 'error' : 'success'"></i>
                    <span class="word1">{{ formAssignee }} <span>(执行)</span></span>
                    <span class="dataYear">{{ endTime }}</span>
                  </div>
                  <div v-if="status === 'rejected'">
                    <div v-for="({ comments, assignee: commentAssignee }, index1) in commentList" :key="index1">
                      <div v-for="({ message }, index2) in comments" :key="index2">
                        <i class="el-icon-warning-outline success"></i>
                        <span class="word1">{{ message }}</span>
                      </div>
                      <div>
                        <i class="el-icon-check" :class="endTime === '-' ? 'error' : 'success'"></i>
                        <span class="word1">{{ commentAssignee }} <span style="color: red">(驳回)</span> </span>
                        <span class="dataYear">{{ endTime }}</span>
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
  </el-dialog>
</template>

<script>
import ProcessInformation from '@/component/bpmnView/ProcessInformation.vue'
import preview from '@/plugin/FormDesign/component/preview'
import { getExecuteDetail, downloadTaskAttachmentFile } from '@/api/unit/api.js'
import { mapState } from 'vuex'

export default {
  components: {
    ProcessInformation,
    preview,
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
      workflow: {},
    }
  },
  computed: {
    ...mapState('account', ['tenantId', 'userInfo']),
    trackList() {
      const trackList = this.workflow.trackList ?? []
      return trackList.map((track) => {
        if (!track) {
          return track
        }
        track.formDataList = handleFormDataList(track)
        return track
      })
      function handleFormDataList({ formDataList = [] }) {
        return formDataList.map((item) => {
          if (!item.formData) {
            return { ...item }
          }
          const formContent = JSON.parse(item.formData)
          formContent.config['disabled'] = true
          return { ...item, formContent }
        })
      }
    },
    processDisplayInfo() {
      return [
        {
          label: '流程编码',
          value: this.workflow.processNumber,
        },
        {
          label: '部署名称',
          value: this.workflow.processDeployName,
        },
        {
          label: '部署时间',
          value: this.workflow.startTime,
        },
        {
          label: '应用项目',
          value: this.$getMappingName(this.workflow.ascription),
        },
        {
          label: '流程类型',
          value: this.$getMappingName(this.workflow.business),
        },
        {
          label: '部署人',
          value: this.workflow.starter,
        },
      ]
    },
  },
  mounted() {
    this.fetchExecuteDetail()
  },
  methods: {
    onClose() {
      this.$emit('close')
    },
    async downloadFile(result) {
      return await downloadTaskAttachmentFile({
        attachmentId: result.url,
      })
    },
    async fetchExecuteDetail() {
      try {
        const { errorInfo, result } = await getExecuteDetail({
          processInstanceId: this.processInstanceId,
          assignee: this.userInfo.account,
        })
        if (errorInfo.errorCode) {
          this.$message.error(errorInfo.errorMsg)
          return
        }
        this.workflow = { ...result }
      } catch (error) {}
    },
  },
}
</script>

<style scoped="scoped">
.processDetail {
  border: 1px solid #000000;
  height: 300px;
  overflow: auto;
  padding: 10px 10px;
}

::v-deep .el-dialog__body {
  max-height: 97vh;
}

::v-deep .el-timeline-item__tail {
  border-left: 2px solid #7fbcff;
}

::v-deep .el-timeline-item__node {
  background-color: #7fbcff;
}

.contant {
  background-color: #f2f2f2;
  line-height: 54px;
  padding: 0px 20px 0px 20px;
  position: relative;
}

.contant .form {
  padding-top: 20px;
}

.el-icon-check {
  font-size: 20px;
  margin-right: 20px;
}

.el-icon-warning-outline {
  font-size: 20px;
  margin-right: 20px;
}

.success {
  background-color: #009900;
  color: white;
  border-radius: 50%;
  /* border: 1px solid #009900; */
  border: none;
}

.error {
  background-color: #999999;
  color: white;
  border-radius: 50%;
  border: none;
}

.dataYear {
  position: absolute;
  right: 20px;
}

.dataMin {
  position: absolute;
  right: 20px;
}
</style>
