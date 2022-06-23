<template>
  <div>
    <el-dialog title="执行工作流" :visible="visible" width="90%" @close="onDialogClose">
      <div class="Implement">
        <div class="Implement-left">
          <ProcessInformation
            v-if="workflow.trackList"
            ref="ProcessInformation"
            :processInfo="workflow"
            @executeShape="onExecuteShape"
            seeType="runTime"
          ></ProcessInformation>
          <div class="function-list" v-if="btnList.length > 0">
            <span
              class="function-item"
              v-for="(item, index) in btnList"
              :key="index"
              @click="onSelectAction(btnListKey[item])"
              :class="functionCheck === btnListKey[item] ? 'function-check' : ''"
            >
              {{ item }}
            </span>
          </div>
          <div class="function-main" :class="btnList.length === 0 ? 'noData' : ''">
            <div v-if="!roleBoolean" class="heightFunction">无权限</div>
            <div v-else-if="btnList.length === 0" class="heightFunction">无信息</div>
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
                <runtime-implement-reject :workflow="workflow" @completed="onAgencyCompleted" @rejectSuccess="onRejectSuccess" />
              </div>
              <div v-if="functionCheck === 'Termination'">
                <div v-if="dataList.Termination.terminationBollon" class="HangStyle">
                  <span style="color: #0066cc">当前流程正常运行，如需将流程终止，请进行认证操作</span>
                  <div class="confirm" @click="confirmation()">终止确认</div>
                </div>
                <div v-else>
                  <!-- TODO: 显示终止信息的反馈 -->
                  <div class="rejectData">
                    <span>{{ dataList.Termination.data }}</span>
                  </div>
                  <div class="rejectName">
                    <span>{{ dataList.Termination.name }}</span>
                  </div>
                  <div class="rejectWord">流程终止</div>
                </div>
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
        <el-button type="primary" @click="onExecute" :disabled="!dataList.Hang">执 行</el-button>
      </span>
    </el-dialog>
    <runtimePeople
      ref="runtimePeople"
      v-if="$refs.ProcessInformation"
      :taskId="taskId"
      :processInstanceId="$refs.ProcessInformation.processInfo.processInstanceId"
      :taskKey="$refs.ProcessInformation.processInfo.taskKey"
    ></runtimePeople>
    <runtimeConfirmation
      v-if="$refs.ProcessInformation"
      ref="runtimeConfirmation"
      :workflow="workflow"
      :processInstanceDetail="$refs.ProcessInformation.processInfo"
      :processInstanceId="$refs.ProcessInformation.processInfo.processInstanceId"
      :BpmnContant="$refs.ProcessInformation.processInfo.content"
      :taskId="$refs.ProcessInformation.processInfo.taskKey"
      :taskKey="$refs.ProcessInformation.processInfo.taskId"
    ></runtimeConfirmation>
  </div>
</template>

<script>
import ProcessInformation from '@/component/bpmnView/ProcessInformation.vue'
import runtimePeople from './runtimePeople.vue'
import runtimeConfirmation from './runtimeConfirmation.vue'
import RuntimeImplementAgency from './RuntimeImplementAgency.vue'
import RuntimeImplementCirculate from './RuntimeImplementCirculate.vue'
import RuntimeImplementSignature from './RuntimeImplementSignature.vue'
import RuntimeImplementHang from './RuntimeImplementHang.vue'
import RuntimeImplementReject from './RuntimeImplementReject.vue'
import preview from '@/plugin/FormDesign/component/preview'
import { designFormDesignServiceAll, postCompleteTask, getProcessNodeInfo, getExecuteDetail } from '@/api/unit/api.js'
import { mapState } from 'vuex'

export default {
  components: {
    ProcessInformation,
    runtimePeople,
    runtimeConfirmation,
    preview,
    RuntimeImplementAgency,
    RuntimeImplementCirculate,
    RuntimeImplementSignature,
    RuntimeImplementHang,
    RuntimeImplementReject,
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
      bpmnTypeloopChara: '',
      formContant: '',
      formShow: false,
      peopleListDefatil: [],
      taskId: '',
      roleBoolean: true,
      btnListKey: {
        Agency: 'Agency',
        Circulate: 'Circulate',
        Signature: 'Signature',
        Hang: 'Hang',
        Reject: 'Reject',
        Terminate: 'Termination',
      },
      btnList: [],
      dataList: {
        Agency: [],
        Circulate: [],
        Signature: [],
        Hang: true,
        Reject: {
          rejectBollen: false,
          data: '123',
          name: '456',
          rejectResult: '890',
        },
        Termination: {
          terminationBollon: true,
          data: '',
          name: '',
        },
      },
    }
  },
  computed: {
    ...mapState('account', ['tenantId', 'userInfo']),
  },
  mounted() {
    this.fetchExecuteDetail()
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
      if (findEle === -1) {
        this.roleBoolean = false
      } else {
        this.roleBoolean = true
      }
    },
    changePeopleList(taskId, type, value, item) {
      if (type === 'edit') {
        let a = []
        item.forEach((item1) => {
          a.push({
            userId: item1,
          })
        })
        switch (value) {
          case 'Agency':
            this.$refs.runtimePeople.detailSelection = JSON.parse(JSON.stringify(a))
            break
          case 'Circulate':
            this.$refs.runtimePeople.detailSelection = JSON.parse(JSON.stringify(a))
            break
          default:
            break
        }
      }
      this.$refs.runtimePeople.dialogVisible = true
      this.taskId = taskId
      this.$nextTick(() => {
        this.$refs.runtimePeople.toggleRowSelection()
      })
    },
    editDataList(value) {
      this.$refs.runtimePeople.multipleSelection = JSON.parse(JSON.stringify(this.dataList[value]))
      this.$refs.runtimePeople.detailSelection = JSON.parse(JSON.stringify(this.dataList[value]))
      this.$refs.runtimePeople.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.runtimePeople.toggleRowSelection()
      })
    },
    confirmation() {
      this.$refs.runtimeConfirmation.dialogVisible = true
    },
    goSee() {
      this.$emit('goSee', this.$refs.ProcessInformation.postData)
    },
    onExecuteShape(value) {
      const actions = this.$iBpmn.getShapeInfoByType(value, 'actions').split(',') ?? []
      if (this.dataList.Hang) {
        // TODO: Hang = true 是非挂起状态
        this.btnList = actions
      } else {
        this.btnList = ['Hang']
      }
      this.bpmnTypeloopChara =
        value.businessObject.loopCharacteristics && value.businessObject.loopCharacteristics.$type
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
    onExecute() {
      let formData = {}
      let data = {}
      if (this.formShow) {
        switch (this.formContant.docType) {
          case 'json':
            // TODO: 再preview层提供一个submit方法和reset方法
            this.$refs.preview.$refs[this.$refs.preview.formConf.formModel].validate((valid) => {
              if (valid) {
                data = this.$refs.preview.form
                formData = JSON.parse(this.formContant.content)
                formData.list.forEach((item) => {
                  item.value = data[item.id]
                })
              } else {
                this.$message.error('有必填项未填写')
              }
            })
            break
          default:
            break
        }
      }
      getProcessNodeInfo({
        processInstanceId: this.workflow.processInstanceId,
      }).then((res) => {
        let nodeInfoBoole = res.result.some((item) => {
          if (item.assignee === null && item.candidateGroup === null && item.candidateUser === null) {
            return true
          }
        })
        if (!nodeInfoBoole) {
          postCompleteTask({
            assignee: this.userInfo.account,
            commentList: [],
            formData: formData,
            processInstanceId: this.workflow.processInstanceId,
            processKey: this.workflow.processDeployKey,
            taskId: this.workflow.newTaskId,
            taskKey: this.workflow.taskKey,
            taskName: this.workflow.processDeployName,
            variable: data,
          }).then((res) => {
            this.formShow = false
            this.$message.success('执行成功')
            this.$emit('taskSuccess')
          })
        } else {
          this.$message.error('下一步流程无执行人')
        }
      })
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
        return workflow.curTrack.assignee.split(',').includes(account)
      }

      function getTaskIdBy(workflow, account) {
        return workflow.curTrack.taskId.split(',')[workflow.curTrack.assignee.split(',').indexOf(account)]
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

.peopleListDefatil {
  margin-top: 15px;
  display: flex;
  color: #a599b1;
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
