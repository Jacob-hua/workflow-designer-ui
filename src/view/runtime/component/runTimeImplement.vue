<template>
  <div>
    <el-dialog title="执行工作流" :visible="visible" width="90%" @close="onDialogClose">
      <div class="Implement">
        <div class="Implement-left">
          <ProcessInformation
            v-if="workflow.trackList"
            :processInfo="workflow"
            @executeShape="onExecuteShape"
            seeType="runTime"
          ></ProcessInformation>
          <div class="function-list" v-if="actions.length > 0">
            <span
              class="function-item"
              v-for="({ label, value }, index) in actions"
              :key="index"
              @click="onSelectAction(value)"
              :class="functionCheck === value ? 'function-check' : ''"
            >
              {{ label }}
            </span>
          </div>
          <div class="function-main" :class="actions.length === 0 ? 'noData' : ''">
            <div v-if="!roleBoolean" class="heightFunction">无权限</div>
            <div v-else-if="actions.length === 0" class="heightFunction">无信息</div>
            <div v-else>
              <div v-if="functionCheck === 'Agency'">
                <runtime-implement-agency :workflow="workflow" @completed="onAgencyCompleted" />
              </div>
              <div v-if="functionCheck === 'Circulate'">
                <runtime-implement-circulate :workflow="workflow" @completed="onAgencyCompleted" />
              </div>
              <div v-if="functionCheck === 'Signature'">
                <runtime-implement-signature :workflow="workflow" @completed="onAgencyCompleted" />
              </div>
              <div v-if="functionCheck === 'Hang'">
                <runtime-implement-hang :workflow="workflow" @completed="onAgencyCompleted" />
              </div>
              <div v-if="functionCheck === 'Reject'">
                <runtime-implement-reject
                  :workflow="workflow"
                  @completed="onAgencyCompleted"
                  @rejectSuccess="onRejectSuccess"
                />
              </div>
              <div v-if="functionCheck === 'Terminate'">
                <runtime-implement-termination
                  :workflow="workflow"
                  @completed="onAgencyCompleted"
                  @terminateSuccess="onRejectSuccess"
                />
              </div>
              <div v-if="functionCheck === 'NoExecutor'">
                <runtime-implement-executor :workflow="workflow" @selectExecutor="onSelectExecutor" />
              </div>
            </div>
          </div>
        </div>
        <div class="Implement-right">
          <div style="margin-top: 20px; margin-bottom: 10px">表单内容</div>
          <div class="Implement-right-form">
            <preview
              :itemList="formListFun(formContant)"
              :formConf="configFun(formContant)"
              v-if="formShow && formContant.docType === 'json'"
              ref="preview"
            ></preview>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer" style="text-align: center">
        <el-button @click="onCancel">取 消</el-button>
        <el-button type="primary" @click="onExecute" :disabled="hang">执 行</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import ProcessInformation from '@/component/bpmnView/ProcessInformation.vue'
import RuntimeImplementAgency from './RuntimeImplementAgency.vue'
import RuntimeImplementCirculate from './RuntimeImplementCirculate.vue'
import RuntimeImplementSignature from './RuntimeImplementSignature.vue'
import RuntimeImplementHang from './RuntimeImplementHang.vue'
import RuntimeImplementReject from './RuntimeImplementReject.vue'
import RuntimeImplementTermination from './RuntimeImplementTermination.vue'
import RuntimeImplementExecutor from './RuntimeImplementExecutor.vue'
import preview from '@/plugin/FormDesign/component/preview'
import { designFormDesignServiceAll, postCompleteTask, getProcessNodeInfo, getExecuteDetail } from '@/api/unit/api.js'
import { mapState } from 'vuex'

export default {
  components: {
    ProcessInformation,
    preview,
    RuntimeImplementAgency,
    RuntimeImplementCirculate,
    RuntimeImplementSignature,
    RuntimeImplementHang,
    RuntimeImplementReject,
    RuntimeImplementTermination,
    RuntimeImplementExecutor,
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
      functionCheck: '',
      formContant: '',
      formShow: false,
      roleBoolean: true,
      actionsConfig: {
        Agency: {
          label: '代办',
          value: 'Agency',
        },
        Circulate: {
          label: '传阅',
          value: 'Circulate',
        },
        Signature: {
          label: '加减签',
          value: 'Signature',
        },
        Hang: {
          label: '挂起',
          value: 'Hang',
        },
        Reject: {
          label: '驳回',
          value: 'Reject',
        },
        Terminate: {
          label: '终止',
          value: 'Terminate',
        },
        NoExecutor: {
          label: '指定后续执行人',
          value: 'NoExecutor',
        },
      },
      curExecuteShape: undefined,
      noExecutor: false,
    }
  },
  computed: {
    ...mapState('account', ['tenantId', 'userInfo']),
    hang() {
      if (!this.workflow.curTrack) {
        return false
      }
      return this.workflow.curTrack.status.split(',').includes('hang')
    },
    actions() {
      if (!this.curExecuteShape) {
        return []
      }
      const temps = []
      if (this.noExecutor) {
        temps.push(this.actionsConfig['NoExecutor'])
      }
      const actions = this.$iBpmn.getShapeInfoByType(this.curExecuteShape, 'actions')?.split(',') ?? []
      return actions.map((action) => this.actionsConfig[action]).concat(temps)
    },
  },
  async mounted() {
    await this.fetchExecuteDetail()
    await this.fetchProcessNodeInfo()
  },
  methods: {
    onAgencyCompleted() {
      this.fetchExecuteDetail()
    },
    onRejectSuccess() {
      this.$emit('taskSuccess')
    },
    onDialogClose() {
      this.formShow = false
      this.$emit('close')
    },
    onCancel() {
      this.$emit('close')
    },
    onSelectExecutor(value) {
      this.$set(this.workflow, 'executors', value)
    },
    onSelectAction(value) {
      this.functionCheck = value
      let { permissions } = JSON.parse(sessionStorage.getItem('loginData'))
      let proJectRole =
        permissions.filter((item) => {
          return item.projectCode === this.workflow.ascription
        })[0]?.permissionSet || []
      let findEle = proJectRole.findIndex((item) => {
        return item.frontRoute === 'RunTime' + value
      })
      if (findEle === -1 && value !== 'NoExecutor') {
        this.roleBoolean = false
      } else {
        this.roleBoolean = true
      }
    },
    onExecuteShape(value) {
      this.curExecuteShape = value
      if (value) {
        this.getFormData(value.businessObject.formKey)
      }
    },

    formListFun(item) {
      let content = JSON.parse(item.content)
      let list = content.list
      return list
    },
    configFun(item) {
      return JSON.parse(item.content).config
    },
    async onExecute() {
      let formData = {}
      let data = {}
      if (this.formShow) {
        data = await this.$refs.preview.submit()
        formData = JSON.parse(this.formContant.content)
        formData.list.forEach((item) => {
          item.value = data[item.id]
        })
        this.completeTask(formData, data)
        return
      }
      if (this.noExecutor && !Array.isArray(this.workflow.executors) && this.workflow.executors.length === 0) {
        this.$message.error('后续执行人为空！')
        return
      }
      this.completeTask(formData, data)
    },
    async completeTask(formData, data) {
      let attachmentList
      if (data.fileList) {
        attachmentList = data.fileList.map(({name, }) => {

        })
      }
      // const { errorInfo } = await postCompleteTask({
      //   assignee: this.userInfo.account,
      //   nextAssignee: this.workflow.executors?.[0].userId,
      //   commentList: [],
      //   formData,
      //   processInstanceId: this.workflow.processInstanceId,
      //   processKey: this.workflow.processDeployKey,
      //   taskId: this.workflow.newTaskId,
      //   taskKey: this.workflow.taskKey,
      //   taskName: this.workflow.processDeployName,
      //   variable: data,
      // })
      // if (errorInfo.errorCode) {
      //   this.$message.error(errorInfo.errorMsg)
      //   return
      // }
      // this.formShow = false
      // this.$message.success('执行成功')
      // this.$emit('taskSuccess')
    },
    getFormData(formKey) {
      if (formKey) {
        let docName = formKey.split(':')[2]
        designFormDesignServiceAll({
          status: 'enabled',
          tenantId: this.tenantId,
          ascription: this.workflow.ascription,
          business: this.workflow.business,
          createBy: '',
          numberCode: '',
          name: '',
          docName: docName,
        }).then((res) => {
          this.formContant = res.result[0]
          this.formShow = true
        })
      } else {
        this.formContant = ''
        this.formShow = false
      }
    },
    async fetchProcessNodeInfo() {
      const { errorInfo, result } = await getProcessNodeInfo({
        processInstanceId: this.workflow.processInstanceId,
      })
      if (errorInfo.errorCode) {
        this.$message.error(errorInfo.errorMsg)
        return
      }
      this.noExecutor = result.some(
        ({ assignee, candidateGroup, candidateUser }) =>
          assignee === null && candidateGroup === null && candidateUser === null
      )
      if (this.noExecutor) {
        this.$message.warning('下一步无执行人')
      }
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
        result.curTrack = this.getCurTrack(result)
        this.workflow = { ...result, newTaskId: this.calculateNewTaskId(result, this.userInfo.account) }
      } catch (error) {}
    },
    getCurTrack(workflow) {
      if (!Array.isArray(workflow.trackList)) {
        return
      }
      return workflow.trackList.at(-1)
    },
    calculateNewTaskId(workflow, account) {
      if (assigneesInclude(workflow, account)) {
        return getTaskIdBy(workflow, account)
      }
      if (candidateUsersInclude(workflow, account)) {
        return candidateUsersInclude(workflow, account).taskId
      }

      function assigneesInclude(workflow, account) {
        if (!workflow.curTrack) {
          return
        }
        return workflow.curTrack.assignee?.split(',').includes(account)
      }

      function getTaskIdBy(workflow, account) {
        return workflow.curTrack.taskId.split(',')[workflow.curTrack.assignee?.split(',').indexOf(account)]
      }

      function candidateUsersInclude(workflow, account) {
        if (!workflow.curTrack) {
          return
        }
        return workflow.curTrack.candidateUsers?.find(({ candidateUsers = [] }) => candidateUsers.includes(account))
      }
    },
  },
}
</script>

<style scoped="scoped">
::v-deep .el-dialog__body {
  max-height: 90vh;
}

.Implement {
  display: flex;
}

.Implement-left {
  flex: 6;
}

.Implement-right {
  padding-left: 20px;
  border-left: 1px solid #eeeeee;
  margin-left: 20px;
  flex: 2;
}

.function-list {
  margin-top: 20px;
  position: relative;
}

.function-item {
  width: 120px;
  height: 48px;
  display: inline-block;
  text-align: center;
  background-color: #b2b2ff;
  line-height: 48px;
  border: 1px solid #474794;
  cursor: pointer;
}

.function-check {
  background-color: #0055ff;
  color: #b2b2ff;
}

.function-see {
  position: absolute;
  right: 10px;
  top: 5px;
  color: #0055ff;
  cursor: pointer;
}

.function-main {
  height: 181px;
  border: 1px solid #000000;
  padding: 10px 20px;
  position: relative;
  color: #000000;
}

.heightFunction {
  line-height: 141px;
  text-align: center;
  display: block;
}

.noPeopleList {
  line-height: 181px;
  text-align: center;
  color: #5b5091;
}

.peopleList {
  margin-top: 15px;
}

.peopleList-item {
  display: inline-block;
  width: 96px;
  height: 32px;
  line-height: 32px;
  text-align: center;
  border: 1px solid #108cee;
  border-radius: 5px;
  margin-left: 20px;
}

.peopleList-item-defail {
  width: 96px;
  height: 32px;
  line-height: 32px;
  text-align: center;
  border: 1px solid #666666;
  background-color: #f5f5f5;
  border-radius: 5px;
  margin-right: 20px;
}

.editButton {
  position: absolute;
  right: 20px;
  top: 10px;
  color: #4d478e;
  cursor: pointer;
}

.HangStyle {
  text-align: center;
  margin-top: 50px;
}

.confirm {
  cursor: pointer;
  color: rgb(255, 76, 0);
  margin-top: 20px;
}

.rejectData {
  margin-top: 20px;
}

.rejectName {
  margin-top: 10px;
}

.rejectWord {
  display: inline-block;
  margin-top: 20px;
  color: #0066cc;
  margin-right: 15px;
}

.rejectResult {
  display: inline-block;
  border: 1px solid #0066cc;
  text-align: center;
  height: 36px;
  line-height: 36px;
  width: 120px;
  border-radius: 5px;
  color: #0066cc;
}

.bpmn-configure-basic {
  flex: 1;
}

.bpmn-configure-title {
  height: 40px;
  line-height: 40px;
}

.bpmn-configure-Main {
  height: 250px;
  border: 1px solid #000000;
  padding: 20px 10px;
  overflow: auto;
  position: relative;
}

.bpmn-configure-Main-item {
  margin-bottom: 20px;
  color: black;
}

.Implement-right-form {
  height: 768px;
  border: 1px solid #000000;
  overflow: auto;
  padding: 20px 20px 20px 0px;
}

.addCirculate {
  margin-left: 10px;
  display: inline-block;
  color: #5b5091;
  cursor: pointer;
}

.noData {
  margin-top: 68px;
}
</style>
