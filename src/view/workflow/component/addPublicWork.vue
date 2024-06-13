<template>
  <el-dialog
    title="新建工作流"
    :close-on-click-modal="false"
    :visible="visible"
    @close="onClose"
    :close-on-press-escape="false"
  >
    <el-form
      label-position="right"
      label-width="80px"
      ref="formData"
      :model="formData"
      :rules="formRules"
    >
      <el-form-item label="流程名称" prop="processName">
        <el-col :span="24">
          <el-input
            v-model="formData.processName"
            placeholder="请输入流程名称"
          ></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="流程描述" prop="processDesc">
        <el-col :span="24">
          <el-input
            type="textarea"
            v-model="formData.processDesc"
            placeholder="请输入流程描述"
          ></el-input>
        </el-col>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button class="submit" @click="onSubmit">下一步</el-button>
      <el-button class="cancel" @click="onClose">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters, mapState } from 'vuex';

export default {
  props: {
    visible: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      formData: {
        processName: '',
        processDesc: '',
      },
      formRules: {
        processName: [
          { required: true, message: '请输入流程名称', trigger: 'blur' },
          {
            min: 1,
            max: 100,
            message: '流程名称长度在 1 到 100 个字符',
            trigger: 'blur',
          },
          {
            trigger: 'blur',
            validator: (_, value, callback) => {
              let flag = /[a-zA-Z0-9\u4e00-\u9fa5\-_]+$/.test(value)
              if(flag){
                callback()
              }else {
                callback(new Error('流程名称只能是中文、数字、字母、下划线和中划线!'))
              }
            },
          },
        ],
        processDesc: [
          {
            min: 0,
            max: 200,
            message: '流程描述长度在 0 到 200 个字符',
            trigger: 'blur',
          },
        ],
      },
    };
  },
  computed: {
    ...mapGetters('config', ['projectOrganizations']),
  },
  methods: {
    onClose() {
      this.$emit('close');
      this.$emit('update:visible', false);
      this.$refs['formData'].resetFields();
    },
    onSubmit() {
      this.$refs['formData'] &&
        this.$refs['formData'].validate((valid) => {
          if (valid) {
            this.$emit('submit', { ...this.formData });
            this.$refs['formData'].resetFields();
          }
        });
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
