<template>
  <div>
    <el-dialog
      title="部署工作流"
      :close-on-click-modal="false"
      :visible.sync="visible"
      @close="onCancel"
      :destroy-on-close="true"
    >
      <el-form
        label-position="right"
        label-width="80px"
        ref="formData"
        :rules="formRules"
        :model="formData"
      >
        <el-form-item label="模型名称" prop="modelName">
          <el-col :span="24">
            <el-input
              v-model="formData.modelName"
              placeholder="请输入部署名称"
            ></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="模型描述" prop="modelDesc">
          <el-col :span="24">
            <el-input
              v-model="formData.modelDesc"
              placeholder="请输入部署名称"
            ></el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button class="submit" @click="onSubmit">下一步</el-button>
        <el-button class="cancel" @click="onCancel">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'DeployConfirmation',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      formData: {
        modelName: '',
        modelDesc: '',
      },
      formRules: {
        modelName: [
          { required: true, message: '请输入模型名称', trigger: 'blur' },
          {
            min: 1,
            max: 100,
            message: '模型名称长度在 1 到 100 个字符',
            trigger: 'blur',
          },
          {
            trigger: 'blur',
            validator: (_, value, callback) => {
              let flag = /[a-zA-Z0-9\u4e00-\u9fa5\-_]+$/.test(value)
              if(flag){
                callback()
              }else {
                callback(new Error('模型名称只能是中文、数字、字母、下划线和中划线!'))
              }
            },
          },
        ],
        modelDesc: [
          {
            min: 0,
            max: 200,
            message: '模型描述长度在 0 到 200 个字符',
            trigger: 'blur',
          },
        ],
      },
    };
  },
  mounted() {},
  methods: {
    onSubmit() {
      this.$refs.formData &&
        this.$refs.formData.validate((validate) => {
          if (validate) {
            this.$emit('submit', { ...this.formData });
            this.onCancel();
          }
        });
    },
    onCancel() {
      this.$refs.formData && this.$refs.formData.resetFields();
      this.$emit('cancel');
    },
    onClose() {
      // this.$emit('update:visible', false);
    },
  },
};
</script>

<style scoped lang="scss">
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
