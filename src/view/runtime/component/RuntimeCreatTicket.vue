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
            <el-option v-for="({value, label}) in startFormOptions[prop].options"
                       :key="value"
                       :value="value"
                       :label="label"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { extraApi } from '../../../api/unit/api'
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
      businessConfigCode: null,
      startConfigList: [
        {
          id: '64',
          code: 'type',
          name: '类型',
          businessConfigId: '424',
          isSetting: 1,
          isRequired: 1,
          startType: 2,
          thirdInterfaceId: null,
          tenantId: '18',
          isUse: 0,
          value: null,
        },
        {
          id: '63',
          code: 'dis',
          name: '项目简介',
          businessConfigId: '424',
          isSetting: 1,
          isRequired: 1,
          startType: 1,
          thirdInterfaceId: null,
          tenantId: '18',
          isUse: 0,
          value: null,
        },
        {
          id: '62',
          code: 'name',
          name: '项目名',
          businessConfigId: '424',
          isSetting: 1,
          isRequired: 1,
          startType: 1,
          thirdInterfaceId: null,
          tenantId: '18',
          isUse: 0,
          value: null,
        },
      ],
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
          required: isRequired,
          apiId: value,
          placeholder: '请输入' + name,
        }))
    },
  },
  watch: {
    process: {
      immediate: true,
      handler({ business }) {
        if (!business) {
          return
        }
        this.businessConfigCode = business
        this.fetchProcessStartConfigList()
      },
    },
    startFormFields(fields) {
      this.startFormOptions = fields.reduce(
        (startFormOptions, { prop, type, apiId }) => {
          if (type === 1) {
            return startFormOptions
          }
          startFormOptions[prop] = {
            apiId,
            options: [],
          }
          return startFormOptions
        },
        {}
      )
      this.fetchRemoteOptions()
    },
  },
  methods: {
    onCloseModal() {
      this.$emit('close')
    },
    fetchRemoteOptions() {
      // 获取远程数据
      const apiPromises =
        Object.keys(this.startFormOptions).map((prop) => {
          return this.fetchExtraApi(prop, this.startFormOptions[prop].apiId)
        }) ?? []
      // 等待所有options接口请求完成
      Promise.all(apiPromises).then((apiResults) => {
        apiResults.forEach(({ prop, options }) => {
          this.startFormOptions[prop].options = options
        })
      })
    },
    async fetchExtraApi(prop, apiId) {
      try {
        const { errorInfo, result } = await extraApi({
          tenantId: this.tenantId,
          apiId,
        })
        if (errorInfo.errorCode) {
          return {
            prop,
            options: [],
          }
        }
        return {
          prop,
          options: result ?? [],
        }
      } catch (error) {
        return {
          prop,
          options: [],
        }
      }
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