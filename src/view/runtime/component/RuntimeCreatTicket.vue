<template>
  <div>
    <el-dialog :title="title"
               :visible="visible"
               @close="onCloseModal">
      <el-form :model="startForm"
               ref="startForm">
        <el-form-item v-for="({id, label, prop, type, required, placeholder, options}) in startFormFields"
                      :key="id"
                      :label="label"
                      :prop="prop"
                      :rules="{required, message: '请输入' + label, trigger: 'blur'}">
          <el-input v-if="type === 1"
                    v-model="startForm[prop]"
                    :placeholder="placeholder"></el-input>
          <el-select v-else
                     v-model="startForm[prop]">
            <el-option v-for="({value, label}) in options"
                       :key="value"
                       :value="value"
                       :label="label"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-empty v-show="isEmptyConfig"
                description="创建的执行会进入执行列表并开始执行流程,是否继续？"></el-empty>
      <span slot="footer">
        <el-button type="primary"
                   :loading="isSubmiting"
                   @click="onSubmit">立即创建</el-button>
        <el-button @click="onCancel">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { selectProcessStartConfigByCode } from '../../../api/globalConfig'
import { getStartProcess } from '../../../api/unit/api.js'

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
    }
  },
  computed: {
    ...mapState(['tenantId', 'userInfo']),
    isEmptyConfig() {
      return !this.startConfigList || this.startConfigList.length === 0
    },
    startFormFields() {
      const formFields = this.startConfigList
        .filter(({ jwpProcessStartConfigEntity: { isSetting } }) => isSetting)
        .map(
          ({
            jwpGlobalConfigEntity = [],
            jwpProcessStartConfigEntity: {
              id,
              name,
              code,
              startType,
              isRequired,
              value,
            },
          }) => ({
            id,
            label: name,
            prop: code,
            type: startType,
            required: Boolean(isRequired),
            apiId: value,
            placeholder: '请输入' + name,
            options: jwpGlobalConfigEntity,
            value: '',
          })
        )
      return formFields
    },
  },
  watch: {
    process: {
      immediate: true,
      handler(process) {
        if (!process.business) {
          return
        }
        // TODO: 此处的配置项7，是一个临时数据，为了验证是否能够获取到配置项
        this.fetchProcessStartConfigList(7).then((res) => {
          this.startConfigList = res
        })
      },
    },
  },
  methods: {
    onCloseModal() {
      this.$emit('close')
    },
    async onSubmit() {
      try {
        this.isSubmiting = true
        await (this.$refs['startForm'] && this.$refs['startForm'].validate())
        const { errorInfo } = await getStartProcess({
          businessKey: '',
          definitionKey: this.process.key,
          createBy: this.userInfo.name,
          startProcessId: this.process.id,
          variables: { ...this.startForm },
        })
        if (errorInfo.errorCode) {
          this.$message.error(errorInfo)
          this.$emit('submit', false)
          return
        }
        this.$message({
          type: 'success',
          message: '创建成功',
        })
        this.$emit('submit', true)
        this.onCloseModal()
        this.$refs['startForm'] && this.$refs['startForm'].resetFields()
      } catch (error) {
        this.$emit('submit', false)
      } finally {
        this.isSubmiting = false
      }
    },
    onCancel() {
      this.onCloseModal()
      this.$refs['startForm'] && this.$refs['startForm'].resetFields()
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

<style>
</style>