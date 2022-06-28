<template>
  <div>
    <el-dialog title="部署工作流" :visible="visible" width="35%" @close="onCancel">
      <el-form label-position="right" label-width="80px" ref="formData" :rules="formRules" :model="formData">
        <el-form-item label="应用项目" prop="ascription">
          <el-col :span="24">
            <el-input
              :value="$getMappingName(formData.ascription)"
              placeholder="请输入应用项目"
              :disabled="true"
            ></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="流程类型" prop="business">
          <el-col :span="24">
            <el-cascader
              v-model="formData.business"
              clearable
              :style="{ width: '100%' }"
              :options="rootOrganizationChildren(formData.ascription)"
              :props="cascaderProps"
              :disabled="true"
            ></el-cascader>
          </el-col>
        </el-form-item>
        <el-form-item label="部署类型" prop="systemType" v-if="options.length > 0">
          <el-col :span="24">
            <el-select v-model="formData.systemType" placeholder="请选择部署类型">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="部署名称" prop="deployName">
          <el-col :span="24">
            <el-input v-model="formData.deployName" placeholder="请输入部署名称"></el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="onSubmit" type="primary">下一步</el-button>
        <el-button @click="onCancel">取消</el-button>
      </span>
    </el-dialog>
    <deploy-options v-if="deployOptionsVisible" :visible.sync="deployOptionsVisible" :workflow="formData" />
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import DeployOptions from './DeployOptions.vue'

export default {
  components: { DeployOptions },
  name: 'DeployConfirmation',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    workflow: {
      type: Object,
      required: true,
      default: () => ({}),
    },
  },
  data() {
    return {
      formData: {
        ascription: '',
        business: '',
        systemType: '',
        deployName: '',
      },
      formRules: {
        ascription: [{ required: true, message: '请选择应用项目', trigger: 'change' }],
        business: [{ required: true, message: '请选择流程类型', trigger: 'change' }],
        systemType: [{ required: true, message: '请选择部署类型', trigger: 'change' }],
        deployName: [
          {
            required: true,
            trigger: 'blur, change',
            validator: (_, value, callback) => {
              if (value === '' || !String.prototype.trim.call(value)) {
                callback(new Error('请输入流程名称'))
              } else if (String.prototype.trim.call(value).length > 100) {
                callback(new Error('流程名称长度不能大于100'))
              } else {
                callback()
              }
            },
          },
        ],
      },
      options: [],
      deployOptionsVisible: false,
    }
  },
  watch: {
    workflow: {
      immediate: true,
      handler(workflow) {
        this.formData = { ...this.formData, ...workflow }
      },
    },
  },
  computed: {
    ...mapState('account', ['tenantId', 'userInfo']),
    ...mapState('uiConfig', ['cascaderProps']),
    ...mapGetters('config', ['rootOrganizations', 'rootOrganizationChildren']),
  },
  methods: {
    onSubmit() {
      this.$refs.formData &&
        this.$refs.formData.validate((validate) => {
          if (validate) {
            this.$emit('submit')
            this.$emit('update:visible', false)
            this.deployOptionsVisible = true
          } else {
            return
          }
        })
    },
    onCancel() {
      this.$emit('cancel')
      this.$emit('update:visible', false)
    },
  },
}
</script>

<style></style>
