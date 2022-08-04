<template>
  <div>
    <el-form-item label="第三方API">
      <el-select v-model="interfaceId" clearable>
        <el-option v-for="{ name, id } in interFaceOption" :key="id" :label="name" :value="id" />
      </el-select>
    </el-form-item>
    <el-row v-if="variables.length > 0" :gutter="24">
      <el-col :span="6"> 变量 </el-col>
      <el-col :span="10"> 绑定变量 </el-col>
      <el-col :span="8"> 来源 </el-col>
    </el-row>
    <div v-for="({ variable, sourceType }, index) in variables" :key="index">
      <el-row :gutter="24">
        <el-col :span="6">
          <span>{{ variable }}</span>
        </el-col>
        <el-col :span="10">
          <el-input
            v-if="isContextSource(sourceType)"
            v-model="variables[index]['source']"
            @change="onVariableChange"
          />
          <el-select v-else v-model="variables[index]['source']">
            <el-option v-for="{ _id, label } in availableField" :key="_id" :label="label" :value="_id"></el-option>
          </el-select>
        </el-col>
        <el-col :span="8">
          <el-select v-model="variables[index]['sourceType']" @change="onSourceTypeChange(index)">
            <el-option
              v-for="{ id, label, value } in sourceTypeOptions"
              :key="id"
              :label="label"
              :value="value"
            ></el-option>
          </el-select>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import { apiDetail } from '@/api/globalConfig'
import { variableFactory as variableParser } from '@/mixin/formDepMonitor'

export default {
  name: 'ApiParser',
  props: {
    currentField: {
      type: Object,
      default: () => ({}),
    },
    fieldOverviews: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      interfaceId: '',
      sourceTypeOptions: [
        {
          id: 0,
          label: '表单',
          value: 'form',
        },
        {
          id: 1,
          label: '环境变量',
          value: 'context',
        },
      ],
      requestConfig: {},
      variables: [],
    }
  },
  computed: {
    ...mapState('account', ['tenantId']),
    ...mapState('form', ['interFaceOption']),
    ...mapGetters('form', ['findInterfaceById']),
    availableField() {
      return this.fieldOverviews.filter(({ _id }) => _id !== this.currentField.id)
    },
  },
  watch: {
    async interfaceId(interfaceId) {
      if (!interfaceId) {
        return
      }
      const { errorInfo, result } = await apiDetail({
        ...this.findInterfaceById(interfaceId),
        tenantId: this.tenantId,
      })
      if (errorInfo.errorCode) {
        this.$message.error(errorInfo.errorMsg)
        return
      }
      if (!Array.isArray(result) || result.length === 0) {
        return
      }
      this.requestConfig = result.find(({ id }) => id === interfaceId)
      this.variables = (variableParser(this.requestConfig) ?? []).map((variable) => ({
        variable,
        sourceType: 'context',
        source: variable,
      }))
      this.onVariableChange()
    },
  },
  mounted() {
    this.refreshApiList()
  },
  methods: {
    ...mapActions('form', ['refreshApiList']),
    isContextSource(sourceType) {
      return sourceType && sourceType === 'context'
    },
    onSourceTypeChange(index) {
      this.variables[index].source = ''
    },
    onVariableChange() {
      this.$emit('variableChange', {
        requestConfig: this.requestConfig,
        variables: this.variables,
      })
    },
  },
}
</script>
