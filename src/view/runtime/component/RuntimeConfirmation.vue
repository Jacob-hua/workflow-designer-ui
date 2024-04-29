<template>
  <div>
    <el-dialog append-to-body :title="title" :visible="visible" @close="onCancel" :close-on-click-modal="false" :close-on-press-escape="false">
      <div>
        <el-form ref="form" :model="form" :rules="formRules" label-width="80px">
          <el-form-item label="账号" prop="usernmae">
            <el-input v-model="form.username" @keyup.native.enter="onSubmit" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="form.password" show-password @keyup.native.enter="onSubmit"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer">
        <el-button class="submit-button" @click="onSubmit">确 定</el-button>
        <el-button class="cancel-button" @click="onCancel">取 消</el-button>
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
      default: '终止确认',
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
      formRules: {
        username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
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
      this.$refs.form['validate'] &&
        this.$refs.form.validate((valid) => {
          if (!valid) {
            return
          }
          postVerifyUser(this.form).then(({ errorInfo }) => {
            this.$emit('validate', !errorInfo.errorCode)
            this.$emit('update:visible', false)
          })
        })
    },
  },
}
</script>

<style scoped lang="scss">
/deep/ .el-dialog {
  @include formDialog;
}

.submit-button {
  @include primaryBtn;
}

.cancel-button {
  @include cancelBtn;
}
</style>
