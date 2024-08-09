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
              v-model.trim="formData.modelName"
              placeholder="请输入模型名称"
              clearable=""
            ></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="模型描述" prop="modelDesc">
          <el-col :span="24">
            <el-input
              v-model.trim="formData.modelDesc"
              placeholder="请输入模型描述"
              clearable=""
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
import { checkName } from '@/api/workflowModel';
export default {
  name: 'DeployConfirmation',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    workflow: {
      type: Object,
      default: () => ({}),
      required: true,
    }
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
            max: 100,
            message: '模型名称长度不超过 100 个字符',
            trigger: 'blur',
          },
          {
            trigger: 'blur',
            validator: (_, value, callback) => {
              let flag = /^[a-zA-Z0-9\u4e00-\u9fa5\-_]+$/.test(value);
              if (flag) {
                callback();
              } else {
                callback(
                  new Error('模型名称只能是中文、数字、字母、下划线和中划线!')
                );
              }
            },
          },
        ],
        modelDesc: [
          {
            max: 200,
            message: '模型描述长度不超过 200 个字符',
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
        this.$refs.formData.validate(async (validate) => {
          if (validate) {
            const isSame = await this.checkSameName();
            if (isSame) {
              this.$message.warning('模型名称已存在')
              return};
            this.$emit('submit', { ...this.formData });
            this.onCancel();
          }
        });
    },
    onCancel() {
      this.$refs.formData && this.$refs.formData.resetFields();
      this.$emit('cancel');
    },
    async checkSameName() {
      let isSame = false;
      try {
        const { data, code, msg } = await checkName({
          modelName: this.formData.modelName,
          processId: this.workflow.processId
        });
        if (code !== '200') {
          this.$message.error(msg);
          return;
        }
        isSame = data;
      } catch (err) {
        this.$message.error(err.msg || err);
      }
      return isSame;
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
