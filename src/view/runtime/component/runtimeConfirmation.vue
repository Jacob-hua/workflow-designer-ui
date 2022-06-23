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
import { postVerifyUser, putCancelInstance } from '@/api/unit/api.js'
import { mapState } from 'vuex'

export default {
  props: {
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
      dialogVisible3: false,
      termination: '',
      form: {
        username: '',
        password: '',
      },
    }
  },
  created() {
    this.form.username = this.userInfo.account
  },
  methods: {
    handleClose() {
      this.dialogVisible = false
      this.dialogVisible3 = false
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
            break
          case 'Reject':
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
