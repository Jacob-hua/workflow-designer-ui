<template>
  <el-dialog title="新建工作流" :close-on-click-modal="false" :visible="visible" @close="onClose">
    <el-form label-position="right" label-width="80px" ref="formData" :model="formData" :rules="formRules">
      <el-form-item label="应用项目" prop="ascription">
        <el-col :span="24">
          <el-select v-model="formData.ascription" disabled>
            <el-option
              v-for="{ id, label, value } in rootOrganizations"
              :key="id"
              :label="label"
              :value="value"
            ></el-option>
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item label="流程类型" prop="business">
        <el-col :span="24">
          <el-cascader
            v-model="formData.business"
            clearable
            :style="{ width: '100%' }"
            :key="formData.ascription"
            :options="rootOrganizationChildren(formData.ascription)"
            :props="cascaderProps"
          ></el-cascader>
        </el-col>
      </el-form-item>
      <el-form-item label="流程名称" prop="name">
        <el-col :span="24">
          <el-input v-model="formData.name" placeholder="请输入流程名称"></el-input>
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
import { mapGetters, mapState } from 'vuex'

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
        ascription: '',
        business: '',
        name: '',
      },
      formRules: {
        ascription: [{ required: true, message: '请选择应用项目', trigger: 'change' }],
        business: [{ required: true, message: '请选择流程类型', trigger: 'change' }],
        name: [
          {
            required: true,
            trigger: 'blur, change',
            validator: (_, value, callback) => {
              if (value === '') {
                callback(new Error('请输入流程名称'))
              } else if (String.prototype.trim.call(value).length < 2) {
                callback(new Error('流程名称长度不能小于2'))
              } else if (String.prototype.trim.call(value).length > 100) {
                callback(new Error('流程名称长度不能大于100'))
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
    currentOrganization: {
      immediate: true,
      handler(value) {
        this.formData.ascription = value
      },
    },
  },
  methods: {
    onClose() {
      this.$emit('close')
      this.$emit('update:visible', false)
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
