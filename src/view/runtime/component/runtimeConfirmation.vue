<template>
  <div>
    <el-dialog append-to-body width="30%" :title="title" :visible="visible" @close="onCancel">
      <div class="runtimeConfirmation">
        <div class="title">{{ message }}</div>
        <el-form ref="form" :model="form" label-width="40px">
          <el-form-item label="账号">
            <el-input v-model="form.username" @keyup.native.enter="onSubmit" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="form.password" show-password @keyup.native.enter="onSubmit"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="onCancel">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { postVerifyUser } from '@/api/unit/api.js'
import { mapState } from 'vuex'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '确认标题',
    },
    message: {
      type: String,
      default: '请输入用户名密码',
    },
  },
  computed: {
    ...mapState('account', ['userInfo', 'tenantId']),
  },
  data() {
    return {
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
    onCancel() {
      this.$emit('update:visible', false)
      this.$emit('cancel')
    },
    onSubmit() {
      postVerifyUser(this.form).then(({ errorInfo }) => {
        this.$emit('validate', !errorInfo.errorCode)
        this.$emit('update:visible', false)
      })
    },
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
