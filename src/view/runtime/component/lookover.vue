<template>
  <el-dialog title="查看流程信息" :visible="visible" width="70%" @close="onClose">
    <div>
      <ProcessInformation
        v-if="workflow.trackList"
        ref="ProcessInformation"
        :processInfo="workflow"
        seeType="runTime"
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
                  v-for="({ formData, status: formStatus, assignee: formAssignee }, index1) in formDataList"
                  :key="index1"
                >
                  <div v-if="formData" class="form">
                    <preview :itemList="formListFun(formData)" :formConf="configFun(formData)"></preview>
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
import { getExecuteDetail } from '@/api/unit/api.js'
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
      return this.workflow.trackList ?? []
    },
  },
  mounted() {
    this.fetchExecuteDetail()
  },
  methods: {
    onClose() {
      this.$emit('close')
    },
    formListFun(item) {
      let content = JSON.parse(item)
      let list = content.list
      for (const formItem of list) {
        if (formItem.columns && formItem.columns.length) {
          for (const formItemElement of formItem.columns) {
            for (const formItemElementElement of formItemElement.list) {
              formItemElementElement.disabled = true
            }
          }
        } else {
          if (Object.keys(formItem).includes('disabled')) {
            formItem.disabled = true
          } else {
          }
        }
      }
      return list
    },
    configFun(item) {
      return JSON.parse(item).config
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
