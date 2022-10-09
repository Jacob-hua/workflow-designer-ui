<template>
  <div>
    <el-dialog :title="title" :visible="visible" top="5vh" @close="onCloseModal" :close-on-click-modal="false">
      <el-skeleton v-if="isLoading" />
      <div v-else>
        <el-form :model="startForm" ref="startForm" label-position="right" label-width="150px">
          <el-form-item
            v-for="{ id, label, prop, type, required, placeholder } in startFormFields"
            :key="id"
            :label="label"
            :prop="prop"
            :rules="{ required, message: '请输入' + label, trigger: 'blur' }"
          >
            <el-input v-if="isInput(type)" v-model="startForm[prop]" :placeholder="placeholder"></el-input>
            <el-select v-if="isSelecte(type)" v-model="startForm[prop]" :placeholder="placeholder">
              <el-option v-for="{ value, label } in options[prop]" :key="value" :value="value" :label="label">
              </el-option>
            </el-select>
            <el-date-picker
              v-if="isTime(type)"
              type="datetime"
              default-time="00:00:00"
              value-format="yyyy-MM-dd HH:mm:ss"
              v-model="startForm[prop]"
              placeholder="选择日期时间"
            ></el-date-picker>
          </el-form-item>
        </el-form>
        <div v-if="isEmptyConfig" class="dialog-message">创建的操作会进入操作列表并开始操作流程,是否继续？</div>
      </div>
      <span slot="footer">
        <el-button class="submit-button" :loading="isSubmiting" @click="onSubmit">立即创建</el-button>
        <el-button class="cancel-button" @click="onCancel">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { selectProcessStartConfigByCode, executeApi } from '../../../api/globalConfig'
import { getStartProcess } from '../../../api/unit/api.js'
import { FormTypeEnum } from '../../../enum'
import formDepMonitorMixin, { mixinRequestFunction } from '../../../mixin/formDepMonitor.js'

export default {
  name: 'RuntimeCreatTicket',
  props: {
    title: {
      type: String,
      default: '配置项',
    },
    visible: {
      type: Boolean,
      default: true,
    },
    process: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      startConfigList: [],
      startForm: {},
      isSubmiting: false,
      isLoading: false,
      options: {},
    }
  },
  mixins: [
    formDepMonitorMixin({
      formData: 'startForm',
      formFields: 'startFormFields',
    }),
  ],
  computed: {
    ...mapState('account', ['tenantId', 'userInfo']),
    isEmptyConfig() {
      return !this.startConfigList || this.startConfigList.length === 0
    },
    startFormFields() {
      const formFields = this.startConfigList
        // 第一步筛选出可以展示的配置项
        .filter(({ jwpProcessStartConfigEntity: { isSetting } }) => isSetting)
        // 第二布处理配置项为表单项
        .map(({ jwpProcessStartConfigEntity, jwpGlobalConfigEntity }) => {
          const { id, name, code, startType, isRequired, value } = jwpProcessStartConfigEntity
          const placeholderPrefixs = {
            [FormTypeEnum.FORM_TYPE_INPUT]: '请输入',
            [FormTypeEnum.FORM_TYPE_SELECT]: '请选择',
            [FormTypeEnum.FORM_TYPE_TIME]: '请输入',
          }
          const placeholder = placeholderPrefixs[startType] + name
          const fieldInfo = {
            id,
            label: name,
            prop: code,
            type: startType,
            required: !!isRequired,
            apiId: value,
            placeholder,
            value: '',
            requestConfig: jwpGlobalConfigEntity,
          }
          this.$set(this.options, fieldInfo.prop, [])
          return fieldInfo
        })
        // 第三步给表单项混入执行函数，执行函数支持一个Hook，用于在当前字段依赖的字段发生变化时，执行相关操作
        .map((fieldInfo) => {
          mixinRequestFunction(fieldInfo, (data, { requestConfig, prop }) => {
            executeApi({
              apiMark: requestConfig.apiMark,
              sourceMark: requestConfig.sourceMark,
              data,
            }).then(({ result: options }) => {
              this.$set(this.options, prop, options)
            })
          })
          return fieldInfo
        })
      return formFields
    },
  },
  watch: {
    process: {
      immediate: true,
      async handler(process) {
        if (!process.business) {
          return
        }
        this.isLoading = true
        this.startConfigList = await this.fetchProcessStartConfigList(process.systemType)
        const placeholderPrefixs = {
          [FormTypeEnum.FORM_TYPE_INPUT]: 'input',
          [FormTypeEnum.FORM_TYPE_SELECT]: 'select',
          [FormTypeEnum.FORM_TYPE_TIME]: 'time',
        }
        const startForm = this.startConfigList.reduce(
          (startForm, { jwpProcessStartConfigEntity: { code, value, startType } }) => {
            if (['input', 'time'].includes(placeholderPrefixs[startType])) {
              startForm[code] = value
            } else {
              startForm[code] = ''
            }
            return startForm
          },
          {}
        )
        this.startForm = startForm
        this.isLoading = false
      },
    },
  },
  methods: {
    isInput(type) {
      return type === FormTypeEnum.FORM_TYPE_INPUT
    },
    isSelecte(type) {
      return type === FormTypeEnum.FORM_TYPE_SELECT
    },
    isTime(type) {
      return type === FormTypeEnum.FORM_TYPE_TIME
    },
    onCloseModal() {
      this.startConfigList = []
      this.$refs['startForm'] && this.$refs['startForm'].resetFields()
      this.$emit('close')
    },
    async onSubmit() {
      try {
        this.isSubmiting = true
        await (this.$refs['startForm'] && this.$refs['startForm'].validate())
        const { errorInfo } = await getStartProcess({
          businessKey: '',
          definitionKey: this.process.key,
          createBy: this.userInfo.account,
          startProcessId: this.process.id,
          variables: { ...this.startForm },
        })
        if (errorInfo.errorCode) {
          this.$message.error(errorInfo.errorMsg)
          this.$emit('submit', false)
          return
        }
        this.$message({
          type: 'success',
          message: '创建成功',
        })
        this.$emit('submit', true)
        this.onCloseModal()
      } catch (error) {
        this.$emit('submit', false)
      } finally {
        this.isSubmiting = false
      }
    },
    onCancel() {
      this.onCloseModal()
    },
    async fetchProcessStartConfigList(businessConfigCode) {
      try {
        const { errorInfo, result } = await selectProcessStartConfigByCode({
          businessConfigCode,
          tenantId: this.tenantId,
          ascription: this.process.ascription,
        })
        if (errorInfo.errorCode) {
          return []
        }
        return result ?? []
      } catch (error) {
        return []
      }
    },
  },
}
</script>

<style scoped lang="scss">
/deep/ .el-dialog {
  @include formDialog;
  width: 600px;
  height: auto;
}

.dialog-message {
  margin: 20px 20px;
  font-size: 14px;
  color: $font-color;
}

.submit-button {
  @include primaryBtn;
}

.cancel-button {
  @include cancelBtn;
}
</style>
