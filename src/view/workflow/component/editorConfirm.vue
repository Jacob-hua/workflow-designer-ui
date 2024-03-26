<template>
  <el-dialog
    :visible="editorConfirmVisible"
    @close="onClose"
    title="流程信息"
    append-to-body
  >
    <el-form
      :model="confirmForm"
      :rules="rules"
      ref="confirmForm"
      label-position="right"
      label-width="80px"
    >
      <el-form-item label="流程名称" prop="processName">
        <el-input
          v-model="confirmForm.processName"
          placeholder="请输入流程名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="流程描述" prop="processDesc">
        <el-col :span="24">
          <el-input
            type="textarea"
            v-model="confirmForm.processDesc"
            placeholder="请输入流程描述"
          ></el-input>
        </el-col>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button class="submit" @click="onSubmit">确 认</el-button>
      <el-button class="cancel" @click="onClose">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  name: 'editorConfirm',
  props: {
    editorConfirmVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      confirmForm: {
        processName: '',
        processDesc: '',
      },
      rules: {
        processName: [
          { required: true, message: '请输入流程名称', trigger: 'blur' },
          {
            min: 1,
            max: 100,
            message: '流程名称长度在 1 到 100 个字符',
            trigger: 'blur',
          },
        ],
      },
    };
  },
  methods: {
    onClose() {
      this.$emit('close');
      this.$emit('update:visible', false);
      this.$refs['confirmForm'].resetFields();
    },
    onSubmit() {
      this.$refs['confirmForm'] &&
        this.$refs['confirmForm'].validate((valid) => {
          if (valid) {
            this.$emit('submit', { ...this.confirmForm });
            this.$refs['confirmForm'].resetFields();
          }
        });
    },
  },
};
</script>
<style lang="scss" scoped>
/deep/ .el-dialog {
  @include formDialog;
}

.submit {
  @include primaryBtn;
}

.cancel {
  @include cancelBtn;
}
</style>
