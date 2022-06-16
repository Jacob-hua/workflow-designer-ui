<template>
  <div>
    <el-dialog :title="title"
               :visible="visible"
               @close="onCloseModal">
      <el-skeleton v-if="isLoading" />
      <div v-else>
        <el-form :model="startForm"
                 ref="startForm">
          <el-form-item v-for="({id, label, prop, type, required, placeholder}) in startFormFields"
                        :key="id"
                        :label="label"
                        :prop="prop"
                        :rules="{required, message: '请输入' + label, trigger: 'blur'}">
            <el-input v-if="isInput(type)"
                      v-model="startForm[prop]"
                      :placeholder="placeholder"></el-input>
            <el-select v-else
                       v-model="startForm[prop]">
              <el-option v-for="({value, label}) in options[prop]"
                         :key="value"
                         :value="value"
                         :label="label"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div v-if="isEmptyConfig"
             class="dialog-message">
          创建的执行会进入执行列表并开始执行流程,是否继续？
        </div>
        <div slot="footer">
          <el-button type="primary"
                     :loading="isSubmiting"
                     @click="onSubmit">立即创建</el-button>
          <el-button @click="onCancel">取消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import {
  selectProcessStartConfigByCode,
  executeApi,
} from '../../../api/globalConfig'
import { getStartProcess } from '../../../api/unit/api.js'
import { FormTypeEnum, ApiEnum } from '../../../enum'

function generateExecuteApiData({
  apiMark,
  sourceMark,
  method,
  parameter,
  body,
}) {
  const variablesHandler = {
    [ApiEnum.API_TYPE_GET]: () => {
      return String.prototype.match.call(parameter, /(?<=\$\{)(.+?)(?=\})/g)
    },
    [ApiEnum.API_TYPE_POST]: () => {
      return body
    },
  }
  const paramHandlers = {
    [ApiEnum.API_TYPE_GET]: (payload) => {
      if (!variablesHandler[ApiEnum.API_TYPE_GET]()) {
        return parameter
      }
      return Object.keys(payload).reduce((parameter, key) => {
        const value = payload[key]
        return parameter.replace(`\$\{${key}\}`, value)
      }, parameter)
    },
    [ApiEnum.API_TYPE_POST]: (payload) => {
      return payload
    },
  }
  const result = {
    apiMark,
    sourceMark,
    variables: variablesHandler[method](),
    paramHandler: paramHandlers[method],
  }
  return result
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
        .filter(({ jwpProcessStartConfigEntity: { isSetting } }) => isSetting)
        .map(
          ({
            jwpGlobalConfigEntity,
            jwpProcessStartConfigEntity: {
              id,
              name,
              code,
              startType,
              isRequired,
              value,
            },
          }) => {
            const result = {
              id,
              label: name,
              prop: code,
              type: startType,
              required: Boolean(isRequired),
              apiId: value,
              placeholder: '请输入' + name,
              value: '',
            }
            if (!jwpGlobalConfigEntity) {
              return result
            }
            this.$set(this.options, code, undefined)
            const executeApiData = generateExecuteApiData(jwpGlobalConfigEntity)
            if (executeApiData.variables) {
              result['watchs'] = executeApiData.variables

              const executeFunc = (...args) => {
                if (args.length >= executeApiData.variables.length) {
                  return ((payload = []) => {
                    const data = payload.reduce(
                      (args, { key, value }) => ({ ...args, [key]: value }),
                      {}
                    )
                    executeApi({
                      ...executeApiData,
                      data: executeApiData.paramHandler(data),
                    }).then((res) => {
                      this.$set(this.options, code, res.result)
                    })
                  })(args)
                } else {
                  return curryExecuteFunction.bind(this, ...args)
                }
              }

              result['executeFunc'] = executeFunc
            } else {
              executeApi({
                ...executeApiData,
                data: executeApiData.paramHandler(),
              }).then((res) => {
                this.$set(this.options, code, res.result)
              })
            }
            return result
          }
        )
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
        this.startConfigList = await this.fetchProcessStartConfigList(
          process.business
        )
        this.isLoading = false
      },
    },
    startForm: {
      deep: true,
      handler(startForm) {
        const needExecutes =
          this.startFormFields?.filter(
            ({ watchs, executeFunc }) => watchs && executeFunc
          ) ?? []
        Object.keys(startForm).forEach((key) => {
          needExecutes.forEach(({ watchs, executeFunc }) => {
            if (watchs.includes(key)) {
              executeFunc({ key, value: startForm[key] })
            }
          })
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