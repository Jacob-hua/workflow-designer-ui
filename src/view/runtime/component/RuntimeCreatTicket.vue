<template>
  <div>
    <el-dialog :title="title"
               :visible="visible"
               @close="onCloseModal">
      <el-form :model="startForm">
        <el-form-item v-for="({id, label, prop, type, required, placeholder}) in startFormFields"
                      :key="id"
                      :label="label"
                      :prop="prop"
                      :required="required">
          <el-input v-if="type === 1"
                    :placeholder="placeholder"></el-input>
          <el-select v-else>
            <el-option v-for="({value, label}) in getStartFormOptions(prop)"
                       :key="value"
                       :value="value"
                       :label="label"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <!-- <el-empty description="创建的执行会进入执行列表并开始执行流程,是否继续？"></el-empty> -->
      <span slot="footer">
        <el-button type="primary"
                   @click="onSubmit">立即创建</el-button>
        <el-button @click="onCancel">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { selectProcessStartConfigByCode } from '../../../api/globalConfig'

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
      startFormOptions: {},
    }
  },
  computed: {
    ...mapState(['tenantId']),
    startFormFields() {
      return this.startConfigList
        .filter(({ isSetting }) => isSetting)
        .map(({ id, name, code, startType, isRequired, value }) => ({
          id,
          label: name,
          prop: code,
          type: startType,
          required: Boolean(isRequired),
          apiId: value,
          placeholder: '请输入' + name,
        }))
    },
  },
  watch: {
    process: {
      immediate: true,
      handler(process) {
        console.log(process)
        if (!process.business) {
          return
        }
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
    onSubmit() {
      this.onCloseModal()
    },
    onCancel() {
      this.onCloseModal()
    },
    getStartFormOptions(prop) {
      return this.startFormOptions[prop]?.options ?? []
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