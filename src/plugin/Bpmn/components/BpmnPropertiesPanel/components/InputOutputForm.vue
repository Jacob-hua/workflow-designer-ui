<template>
  <div>
    <el-form :model="parameterForm"
             ref="parameterForm">
      <el-form-item label="变量名">
        <el-input v-model="parameterForm.name" />
      </el-form-item>
      <el-form-item label="变量类型">
        <el-select v-model="parameterForm.type">
          <el-option v-for="({label, value}, index) in variableTypeOptions"
                     :key="index"
                     :label="label"
                     :value="value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="variableTypeIs('string/expression')"
                    label="变量值">
        <el-input v-model="parameterForm.value"
                  type="textarea" />
      </el-form-item>
      <template v-if="variableTypeIs('script')">
        <el-form-item label="脚本格式">
          <el-input v-model="parameterForm.scriptFormat" />
        </el-form-item>
        <el-form-item label="脚本类型">
          <el-select v-model="parameterForm.scriptType">
            <el-option v-for="({label, value}, index) in scriptTypeOptions"
                       :key="index"
                       :label="label"
                       :value="value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="脚本">
          <el-input v-model="parameterForm.script"
                    type="textarea" />
        </el-form-item>
        <el-form-item label="资源链接">
          <el-input v-model="parameterForm.resource" />
        </el-form-item>
      </template>
      <template v-if="variableTypeIs('list')">
        <el-row>
          <span>
            列表值
          </span>
          <el-button size="small"
                     @click="onAddListValue">添加</el-button>
        </el-row>
        <el-form-item v-for="(_, index) in parameterForm.listValues"
                      :key="index">
          <el-row :gutter="5">
            <el-col :span="20">
              <el-input v-model="parameterForm.listValues[index]" />
            </el-col>
            <el-col :span="4">
              <el-button @click="onRemoveListValue(index)">删除</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </template>
      <template v-if="variableTypeIs('map')">
        <el-row>
          <span>
            键值对
          </span>
          <el-button size="small"
                     @click="onAddMapValue">添加</el-button>
        </el-row>
        <el-row v-if="mapValuesIsNotEmpty">
          <el-col :span="10">键</el-col>
          <el-col :span="10">值</el-col>
        </el-row>
        <el-row v-for="(_, index) in parameterForm.mapValues"
                :key="index">
          <el-col :span="10">
            <el-input v-model="parameterForm.mapValues[index].key" />
          </el-col>
          <el-col :span="10">
            <el-input v-model="parameterForm.mapValues[index].value" />
          </el-col>
          <el-col :span="4">
            <el-button @click="onRemoveMapValue(index)">删除</el-button>
          </el-col>
        </el-row>
      </template>
    </el-form>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'InputOutputForm',
  props: {
    parameter: {
      type: Object,
      default: () => ({
        name: '测试',
        type: 'list',
        value: 2323,
      }),
    },
  },
  data() {
    return {
      parameterForm: {
        name: '',
        type: '',
        value: null,
        scriptFormat: '',
        scriptType: '',
        script: '',
        resource: '',
        listValues: [],
        mapValues: [],
      },
    }
  },
  computed: {
    ...mapState('bpmn/config', ['variableTypeOptions', 'scriptTypeOptions']),
    mapValuesIsNotEmpty() {
      return this.parameterForm.mapValues.length > 0
    },
  },
  watch: {
    parameter(value) {
      this.parameterForm = { ...this.parameterForm, ...value }
    },
  },
  methods: {
    variableTypeIs(variableType) {
      return (
        this.parameterForm['type'] &&
        this.parameterForm['type'] === variableType
      )
    },
    onAddListValue() {
      this.parameterForm.listValues.push('')
    },
    onRemoveListValue(index) {
      if (!this.parameterForm.listValues[index]) {
        return
      }
      this.parameterForm.listValues.splice(index, 1)
    },
    onAddMapValue() {
      this.parameterForm.mapValues.push({
        key: '',
        value: '',
      })
    },
    onRemoveMapValue(index) {
      if (!this.parameterForm.mapValues[index]) {
        return
      }
      this.parameterForm.mapValues.splice(index, 1)
    },
  },
}
</script>

<style scoped>
.el-row {
  margin-bottom: 16px;
}
</style>