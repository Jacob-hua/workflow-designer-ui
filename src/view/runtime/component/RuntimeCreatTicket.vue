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
            <el-option></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { selectProcessStartConfigList } from '../../../api/globalConfig'

export default {
  name: 'RuntimeCreatTicket',
  props: {
    title: {
      type: String,
      default: '配置项',
    },
    visible: {
      type: Boolean,
      default: false,
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
    }
  },
  computed: {
    ...mapState(['tenantId']),
    startFormFields() {
      return this.startConfigList
        .filter(({ isSetting }) => isSetting)
        .map(({ id, name, code, startType, isRequired }) => ({
          id,
          label: name,
          prop: code,
          type: startType,
          required: isRequired,
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
      },
    },
  },
  methods: {
    onCloseModal() {
      this.$emit('close')
    },
    async fetchProcessStartConfigList(businessConfigCode) {
      try {
        const { errorInfo, result } = await selectProcessStartConfigList({
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