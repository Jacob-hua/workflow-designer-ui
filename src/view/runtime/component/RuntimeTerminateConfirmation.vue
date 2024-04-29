<template>
  <el-dialog title="终止" :close-on-click-modal="false" :visible="visible" width="70%" @close="onCancel" append-to-body :close-on-press-escape="false">
    <el-form :model="form" :rules="formRules" ref="form">
      <el-form-item label="终止原因" prop="terminateReason">
        <el-input type="textarea" :rows="15" placeholder="请输入内容" v-model="form.terminateReason"> </el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button class="submit-button" @click="onSubmit">确 定</el-button>
      <el-button class="cancel-button" @click="onCancel">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'RuntimeTerminateConfirmation',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      form: {
        terminateReason: '',
      },
      formRules: {
        terminateReason: [{ required: true, message: '终止原因不能为空', trigger: ['blur', 'change'] }],
      },
    }
  },
  methods: {
    onCancel() {
      this.$refs.form['resetFields'] && this.$refs.form['resetFields']()
      this.$emit('update:visible', false)
      this.$emit('cancel')
    },
    onSubmit() {
      this.$refs.form['validate'] &&
        this.$refs.form['validate']((valid) => {
          if (!valid) {
            return
          }
          this.$emit('submit', { terminateReason: this.form.terminateReason })
          this.$emit('update:visible', false)
        })
    },
  },
}
</script>

<style scoped lang="scss">
@import '../index.scss';

.submit-button {
  @include primaryBtn;
}

.cancel-button {
  @include cancelBtn;
}
</style>
