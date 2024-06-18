<template>
  <el-dialog
    title="版本信息"
    :visible.sync="formVersionVisible"
    @close="close"
    width="30%"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :destroy-on-close="true"
  >
    <el-form
      :model="versionForm"
      ref="versionForm"
      label-width="80px"
      label-position="right"
      :rules="formRules"
    >
      <el-form-item label="版本名称" prop="formVersionTag">
        <el-input
          v-model="versionForm.formVersionTag"
          placeholder="请输入表单版本名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="版本描述" prop="formVersionDesc">
        <el-input
          v-model="versionForm.formVersionDesc"
          placeholder="请输入表单版本描述"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <div class="next" @click="handleSubmit()" type="primary">确认</div>
      <div class="cancel" @click="close">取消</div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'formVersion',
  props: {
    formVersionVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      versionForm: {
        formVersionTag: '',
        formVersionDesc: '',
      },
      formRules: {
        formVersionTag: [
          { required: true, message: '请输入表单版本名称', trigger: 'change' },
          {
            min: 1,
            max: 100,
            message: '表单版本名称长度在 1 到 100 个字符',
            trigger: 'blur',
          },
        ],
        formVersionDesc: [
          {
            min: 0,
            max: 200,
            message: '表单版本描述长度在 0 到 200 个字符',
            trigger: 'blur',
          },
        ],
      },
    };
  },
  methods: {
    close() {
      this.$emit('closeVersionDialog');
      this.$refs['versionForm'].resetFields();
    },
    handleSubmit() {
      this.$refs['versionForm'].validate((valid) => {
        if (valid) {
          this.$emit('submitFormVersion', this.versionForm);
          this.$refs['versionForm'].resetFields();
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.next {
  @include primaryBtn;
}
.cancel {
  @include cancelBtn;
}
</style>
