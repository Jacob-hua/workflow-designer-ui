<template>
  <div>
    <el-dialog
      :title="dialogValue('title')"
      :visible.sync="dialogVisible"
      append-to-body
      width="30%"
      :before-close="handleClose"
    >
      <div class="runtimeConfirmation">
        <div class="title">{{ dialogValue('message') }}</div>
        <el-form ref="form" :model="form" label-width="40px">
          <el-form-item label="账号">
            <el-input v-model="form.username" @keyup.native.enter="handleOK" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="form.password" show-password @keyup.native.enter="handleOK"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleOK()">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="驳回" :visible.sync="dialogVisible2" width="70%" :before-close="handleClose">
      <processData
        ref="processData"
        v-if="dialogVisible2"
        @selection="selection"
        v-bind="$attrs"
        :processInstanceId="processInstanceId"
      ></processData>
      <div>
        <div class="rejectWord">驳回原因（必填）</div>
        <div>
          <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="textarea"> </el-input>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="handleReject()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="终止" :visible.sync="dialogVisible3" width="70%" :before-close="handleClose">
      <div>
        <div class="rejectWord">终止原因（必填）</div>
        <div>
          <el-input type="textarea" :rows="15" placeholder="请输入内容" v-model="termination"> </el-input>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible3 = false">取 消</el-button>
        <el-button type="primary" @click="handleTermination()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import processData from './processData.vue'
import { putHangInstance, postVerifyUser, putRejectTask, putCancelInstance, getActiveInstance } from '@/api/unit/api.js'
import { mapState } from 'vuex'
export default {
  props: {
    processInstanceId: {
      type: String,
      default: '',
    },
    processInstanceDetail: {
      type: Object,
    },
    taskKey: {
      type: String,
      default: '',
    },
    workflow: {
      type: Object,
    },
  },
  computed: {
    ...mapState('account', ['userInfo', 'tenantId']),
  },
  data() {
    return {
      dialogVisible: false,
      dialogVisible2: false,
      dialogVisible3: false,
      textarea: '',
      termination: '',
      selectData: null,
      selectValue: null,
      form: {
        username: '',
        password: '',
      },
      messageDiolog: {
        Hang: {
          title: '流程挂起',
          message: '请输入账号密码进行校验，将此工作流程挂起',
        },
        Reject: {
          title: '流程驳回',
          message: '请输入账号密码进行校验，将此工作流程驳回',
        },
        Termination: {
          title: '流程终止',
          message: '请输入账号密码进行校验，将此工作流程终止',
        },
      },
    }
  },
  created() {
    this.form.username = this.userInfo.account
  },
  methods: {
    dialogValue(value) {
      // return this.messageDiolog[this.$parent.functionCheck][value]
    },
    handleClose() {
      this.dialogVisible = false
      this.dialogVisible2 = false
      this.dialogVisible3 = false
    },
    selection(val, selectValue) {
      this.selectData = val
      this.selectValue = selectValue
    },
    handleReject() {
      if (!this.selectValue) {
        this.$message.error('请选择被驳回的节点')
        return
      }

      putRejectTask({
        message: this.textarea,
        processInstanceId: this.processInstanceId,
        taskKey: this.selectValue,
        userId: this.userInfo.account,
        currentTaskId: this.taskKey,
        processKey: this.processInstanceDetail.deployKey,
        currentTaskName: this.processInstanceDetail.taskName,
        currentTaskKey: this.processInstanceDetail.taskKey,
        createBy: this.userInfo.account,
      }).then((res) => {
        this.dialogVisible2 = false
        this.$parent.$emit('taskSuccess')
      })
    },
    handleOK() {
      postVerifyUser(this.form).then(({ errorInfo }) => {
        if (errorInfo.errorCode) {
          this.$emit('validate', false)
          return
        }
        this.dialogVisible = false
        this.$emit('validate', true)
        switch (this.$parent.functionCheck) {
          case 'Hang':
            if (this.$parent.dataList.Hang) {
              putHangInstance({
                processInstanceId: this.workflow.processInstanceId,
              }).then((res) => {
                this.$message.success('挂起成功')
                this.$parent.$emit('taskSuccess')
              })
            } else {
              getActiveInstance({
                processInstanceId: this.workflow.processInstanceId,
              }).then((res) => {
                this.$message.success('激活成功')
                this.$parent.$emit('taskSuccess')
              })
            }
            break
          case 'Reject':
            this.dialogVisible2 = true
            break
          case 'Termination':
            this.dialogVisible3 = true
            break
          default:
            break
        }
      })
    },
    handleTermination() {
      putCancelInstance({
        cancelReason: this.termination,
        processInstanceId: this.processInstanceId,
      }).then((res) => {
        this.$message.success('终止成功')
        this.dialogVisible3 = false
        this.$parent.$emit('taskSuccess')
      })
    },
  },
  components: {
    processData,
  },
}
</script>

<style scoped="scoped">
.runtimeConfirmation {
  padding: 0px 40px;
}

.title {
  text-align: center;
  color: #ff3352;
  margin: 20px 0px;
}

.rejectWord {
  margin: 20px 0px;
}
</style>
