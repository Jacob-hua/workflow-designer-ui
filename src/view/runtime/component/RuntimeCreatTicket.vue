<template>
  <div>
    <el-dialog :title="title" :visible="visible" @close="onCloseModal">
      <el-skeleton v-if="isLoading" />
      <div v-else>
        <el-form :model="startForm" ref="startForm">
          <el-form-item
            v-for="{ id, label, prop, type, required, placeholder } in startFormFields"
            :key="id"
            :label="label"
            :prop="prop"
            :rules="{ required, message: '请输入' + label, trigger: 'blur' }"
          >
            <el-input v-if="isInput(type)" v-model="startForm[prop]" :placeholder="placeholder"></el-input>
            <el-select v-else v-model="startForm[prop]" :placeholder="placeholder">
              <el-option v-for="{ value, label } in options[prop]" :key="value" :value="value" :label="label">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div v-if="isEmptyConfig" class="dialog-message">创建的执行会进入执行列表并开始执行流程,是否继续？</div>
        <div slot="footer">
          <el-button type="primary" :loading="isSubmiting" @click="onSubmit">立即创建</el-button>
          <el-button @click="onCancel">取消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { selectProcessStartConfigByCode, executeApi } from '../../../api/globalConfig'
import { getStartProcess } from '../../../api/unit/api.js'
import { FormTypeEnum, ApiEnum } from '../../../enum'

function variableFactory({ method, parameter, body }) {
  const variablesHandlers = {
    [ApiEnum.API_TYPE_GET]: extractVariables(parameter),
    [ApiEnum.API_TYPE_POST]: extractVariables(body),
  }
  return variablesHandlers[method]

  function extractVariables(str) {
    return String.prototype.match.call(str, /(?<=\$\{)(.+?)(?=\})/g)
  }
}

function parameterHandlerFactory({ method, parameter, body }) {
  const parameterHandlers = {
    [ApiEnum.API_TYPE_GET]: (payload) => {
      if (!variableFactory({ method, parameter, body })) {
        return parameter
      }
      return variableAssignment(parameter, payload)
    },
    [ApiEnum.API_TYPE_POST]: (payload) => {
      if (!variableFactory({ method, parameter, body })) {
        return JSON.parse(body)
      }
      return JSON.parse(variableAssignment(body, payload))
    },
  }
  return parameterHandlers[method]

  function variableAssignment(str, payload) {
    return Object.keys(payload).reduce((parameter, key) => {
      return parameter.replace(`\$\{${key}\}`, payload[key])
    }, str)
  }
}

function mixinExecuteFunction(fieldInfo, executeFunc = () => {}) {
  const newFieldInfo = { ...fieldInfo }
  if (!newFieldInfo.requestConfig) {
    return newFieldInfo
  }

  const variables = variableFactory(newFieldInfo.requestConfig)
  const parameterHandler = parameterHandlerFactory(newFieldInfo.requestConfig)

  if (!variables) {
    executeFunc(parameterHandler(), newFieldInfo)
    return newFieldInfo
  }

  const oldVariables = variables.reduce((oldVariables, variable) => ({ ...oldVariables, [variable]: '' }), {})

  newFieldInfo.executeFunc = (data) => {
    const isDiffed = Object.keys(data)
      .filter((key) => variables.includes(key))
      .reduce((isDiffed, key) => {
        isDiffed = isDiffed || oldVariables[key] !== data[key]
        oldVariables[key] = data[key]
        return isDiffed
      }, false)
    if (isDiffed) {
      executeFunc(parameterHandler(oldVariables), newFieldInfo)
    }
  }
  return newFieldInfo
}

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
          return mixinExecuteFunction(fieldInfo, (data, { requestConfig, prop }) => {
            executeApi({
              apiMark: requestConfig.apiMark,
              sourceMark: requestConfig.sourceMark,
              data,
            }).then(({ result: options }) => {
              this.$set(this.options, prop, options)
            })
          })
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
        this.startConfigList = await this.fetchProcessStartConfigList(process.business)
        this.isLoading = false
      },
    },
    startFormFields(startFormFields) {
      this.startForm = startFormFields.reduce((startForm, field) => {
        startForm[field.prop] = field.value
        return startForm
      }, {})
    },
    startForm: {
      immediate: true,
      deep: true,
      handler(startForm) {
        const needExecutes = this.startFormFields?.filter(({ executeFunc }) => executeFunc) ?? []
        needExecutes.forEach(({ executeFunc }) => {
          executeFunc({ ...startForm })
        })
      },
    },
  },
  methods: {
    isInput(type) {
      return type === FormTypeEnum.FORM_TYPE_INPUT
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

<style scoped>
.dialog-message {
  margin: 20px 20px;
  font-size: 14px;
}
</style>
