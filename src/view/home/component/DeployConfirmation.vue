<template>
  <div>
    <el-dialog title="部署工作流" :close-on-click-modal="false" :visible="visible" @close="onCancel">
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
            >
            </el-cascader>
          </el-col>
        </el-form-item>
        <el-form-item label="部署类型" prop="systemType" v-if="systemTypeOptions.length > 0">
          <el-col :span="24">
            <el-select v-model="formData.systemType" placeholder="请选择部署类型">
              <el-option v-for="{ value, label } in systemTypeOptions" :key="value" :label="label" :value="value">
              </el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="部署名称" prop="deployName">
          <el-col :span="24">
            <el-input v-model="formData.deployName" placeholder="请输入部署名称"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item prop="isCycle" label="周期性">
          <el-switch v-model="formData.isCycle" />
        </el-form-item>
        <el-form-item v-if="formData.isCycle" prop="rule" label="周期规则">
          <el-select v-model="formData.rule" placeholder="请选择周期规则">
            <el-option
              v-for="({ cronExpression, ruleId }, index) in ruleList"
              :key="index"
              :label="cronExpression"
              :value="{ ruleId, cronExpression }"
            ></el-option>
          </el-select>
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
import { mapState, mapGetters } from 'vuex'
import { getCycleRuleList } from '@/api/unit/api.js'

export default {
  name: 'DeployConfirmation',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    ascription: {
      type: String,
      default: '',
    },
    business: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      ruleList: [],
      formData: {
        ascription: this.ascription,
        business: this.business,
        systemType: '',
        deployName: '',
        isCycle: false,
        rule: null,
      },
      formRules: {
        ascription: [{ required: true, message: '请选择应用项目', trigger: 'change' }],
        business: [{ required: true, message: '请选择流程类型', trigger: 'change' }],
        systemType: [{ required: true, message: '请选择部署类型', trigger: 'change' }],
        rule: [{ required: true, message: '请选择周期性规则', trigger: 'change' }],
        deployName: [
          {
            required: true,
            trigger: 'blur, change',
            validator: (_, value, callback) => {
              if (value === '' || !String.prototype.trim.call(value)) {
                callback(new Error('请输入部署名称'))
              } else if (String.prototype.trim.call(value).length > 100) {
                callback(new Error('部署名称长度不能大于100'))
              } else {
                callback()
              }
            },
          },
        ],
      },
    }
  },
  watch: {
    business(business) {
      this.formData.business = business
    },
    ascription(ascription) {
      this.formData.ascription = ascription
    },
  },
  computed: {
    ...mapState('account', ['tenantId', 'userInfo']),
    ...mapState('uiConfig', ['cascaderProps']),
    ...mapGetters('config', ['rootOrganizations', 'rootOrganizationChildren']),
    systemTypeOptions() {
      let systemOption = this.rootOrganizationChildren(this.formData.ascription).filter((item) => {
        return item.value === this.formData.business
      })
      return systemOption[0]?.children || []
    },
  },
  mounted() {
    this.fetchRuleList()
  },
  methods: {
    onSubmit() {
      this.$refs.formData &&
        this.$refs.formData.validate((validate) => {
          if (validate) {
            this.$emit('submit', { ...this.formData })
            this.onClose()
          }
        })
    },
    onCancel() {
      this.$emit('cancel')
      this.onClose()
    },
    onClose() {
      this.$refs.formData && this.$refs.formData.resetFields()
      this.$emit('update:visible', false)
    },
    async fetchRuleList() {
      try {
        const { errorInfo, result } = await getCycleRuleList()
        if (errorInfo.errorCode) {
          this.$message.error(errorInfo.errorMsg)
          return
        }
        this.ruleList = result
      } catch (error) {}
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
