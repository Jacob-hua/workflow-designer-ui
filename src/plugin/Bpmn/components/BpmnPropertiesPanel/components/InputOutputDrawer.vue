<template>
  <div>
    <el-drawer :title="title"
               :visible="visible"
               @close="onCloseDrawer"
               direction="rtl">
      <el-form :model="parameterForm"
               :rules="parameterFormRules"
               ref="parameterForm">
        <el-form-item label="变量名"
                      prop="name">
          <el-input v-model="parameterForm.name" />
        </el-form-item>
        <el-form-item label="变量类型"
                      prop="type">
          <el-select v-model="parameterForm.type">
            <el-option v-for="({label, value}, index) in variableTypeOptions"
                       :key="index"
                       :label="label"
                       :value="value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="variableTypeIs('string/expression')"
                      label="变量值"
                      prop="value">
          <el-input v-model="parameterForm.value"
                    type="textarea" />
        </el-form-item>
        <template v-if="variableTypeIs('script')">
          <el-form-item label="脚本格式"
                        prop="scriptFormat">
            <el-input v-model="parameterForm.scriptFormat" />
          </el-form-item>
          <el-form-item label="脚本类型"
                        prop="scriptType">
            <el-select v-model="parameterForm.scriptType">
              <el-option v-for="({label, value}, index) in scriptTypeOptions"
                         :key="index"
                         :label="label"
                         :value="value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="scriptTypeIs('inline')"
                        label="脚本"
                        prop="script">
            <el-input v-model="parameterForm.script"
                      type="textarea" />
          </el-form-item>
          <el-form-item v-if="scriptTypeIs('outside')"
                        label="资源链接"
                        prop="resource">
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
        <el-form-item>
          <el-button @click="onParameterFormCancel">取消</el-button>
          <el-button type="primary"
                     @click="onParameterFormSubmit">保存</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { deepCopy } from '../../../utils/object'

function requiredRule(message) {
  return [{ required: true, trigger: ['blur', 'change'], message }]
}

export default {
  name: 'InputOutputForm',
  props: {
    parameter: {
      type: Object,
      default: () => ({}),
    },
    title: {
      type: String,
      default: '标题',
    },
    visible: {
      type: Boolean,
      required: true,
    },
    onClose: {
      type: Function,
      required: true,
    },
    onSubmit: {
      type: Function,
      required: true,
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
      parameterFormRules: {
        name: [...requiredRule('请输入变量名')],
        type: [...requiredRule('请选择变量类型')],
        value: [...requiredRule('请输入变量值')],
        scriptFormat: [...requiredRule('请输入脚本格式')],
        scriptType: [...requiredRule('请选择脚本类型')],
        script: [...requiredRule('请输入脚本')],
        resource: [...requiredRule('请输入资源位置')],
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
      this.parameterForm = { ...this.parameterForm, ...deepCopy(value) }
    },
  },
  methods: {
    variableTypeIs(variableType) {
      return (
        this.parameterForm['type'] &&
        this.parameterForm['type'] === variableType
      )
    },
    scriptTypeIs(scriptType) {
      return (
        this.parameterForm['scriptType'] &&
        this.parameterForm['scriptType'] === scriptType
      )
    },
    onAddListValue() {
      this.parameterForm.listValues.push('')
    },
    onRemoveListValue(index) {
      this.parameterForm.listValues.splice(index, 1)
    },
    onAddMapValue() {
      this.parameterForm.mapValues.push({
        key: '',
        value: '',
      })
    },
    onRemoveMapValue(index) {
      this.parameterForm.mapValues.splice(index, 1)
    },
    onCloseDrawer() {
      this.onClose()
      this.$refs.parameterForm['resetFields'] &&
        this.$refs.parameterForm['resetFields']()
    },
    onParameterFormCancel() {
      this.onCloseDrawer()
    },
    onParameterFormSubmit() {
      this.$refs.parameterForm['validate'] &&
        this.$refs.parameterForm['validate']((valid) => {
          if (!valid) {
            return
          }
          this.onSubmit(deepCopy(this.parameterForm))
          this.onCloseDrawer()
        })
    },
  },
}
</script>

<style scoped>
.el-row {
  margin-bottom: 16px;
}
</style>