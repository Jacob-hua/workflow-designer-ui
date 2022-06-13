<template>
  <el-dialog title="新建工作流"
             :visible="dialogVisible"
             @close="onClose"
             width="35%"
             custom-class="addProject">
    <el-form label-position="right"
             label-width="80px"
             ref="formData"
             :model="formData"
             :rules="formRules">
      <el-form-item label="应用项目"
                    prop="ascription">
        <el-col :span="24">
          <el-select v-model="formData.ascription"
                     disabled>
            <el-option v-for="{id, label, value} in rootOrganizations"
                       :key="id"
                       :label="label"
                       :value="value"></el-option>
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item label="流程类型"
                    prop="business">
        <el-col :span="24">
          <el-cascader v-model="formData.business"
                       clearable
                       :style="{width: '100%'}"
                       :key="formData.ascription"
                       :options="rootOrganizationChildren(formData.ascription)"
                       :props='cascaderProps'></el-cascader>
        </el-col>
      </el-form-item>
      <el-form-item label="流程名称"
                    prop="name">
        <el-col :span="24">
          <el-input v-model="formData.name"
                    placeholder="请输入流程名称"></el-input>
        </el-col>
      </el-form-item>
    </el-form>
    <span slot="footer"
          class="dialog-footer">
      <el-button type="primary"
                 @click="onSubmit">下一步</el-button>
      <el-button @click="onCancel">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

export default {
  props: {
    projectCode: {
      type: String,
      default: '',
    },
    dialogVisible: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      formData: {
        ascription: '',
        business: '',
        name: '',
      },
      formRules: {
        ascription: [
          { required: true, message: '请选择应用项目', trigger: 'change' },
        ],
        business: [
          { required: true, message: '请选择流程类型', trigger: 'change' },
        ],
        name: [
          {
            required: true,
            trigger: 'blur, change',
            validator: (_, value, callback) => {
              if (value === '') {
                callback(new Error('请输入流程名称'))
              } else if (String.prototype.trim.call(value).length < 2) {
                callback(new Error('流程名称长度不能小于2'))
              } else {
                callback()
              }
            },
          },
        ],
      },
    }
  },
  computed: {
    ...mapState('account', ['currentOrganization']),
    ...mapState('uiConfig', ['cascaderProps']),
    ...mapGetters('config', ['rootOrganizations', 'rootOrganizationChildren']),
  },
  watch: {
    currentOrganization(value) {
      this.formData.ascription = value
    },
  },
  methods: {
    onClose() {
      this.$emit('close')
      this.$refs['formData'].resetFields()
    },
    onCancel() {
      this.$emit('close')
      this.$refs['formData'].resetFields()
    },
    onSubmit() {
      this.$refs['formData'] &&
        this.$refs['formData'].validate((valid) => {
          if (valid) {
            this.$emit('submit', { ...this.formData })
            this.$refs['formData'].resetFields()
          }
        })
    },
  },
}
</script>

<style scoped>
::v-deep .addProject .el-dialog__body {
  padding: 16px 180px 0px 100px;
}

::v-deep .addProject .el-dialog__header .el-dialog__title {
  font-size: 14px;
}

::v-deep .addProject .el-dialog__header {
  background-color: #e4e4e4;
  border-bottom: 1px solid #000000;
}

.from-item {
  display: flex;
  margin-bottom: 20px;
  text-align: center;
}

.from-item > span {
  width: 100px;
  height: 40px;
  line-height: 40px;
}
</style>
