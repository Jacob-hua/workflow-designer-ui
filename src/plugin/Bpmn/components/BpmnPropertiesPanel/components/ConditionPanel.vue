<template>
  <div>
    <el-form :model="conditionForm" label-position="right" label-width="130px">
      <el-form-item label="条件类型">
        <el-select v-model="conditionForm.type">
          <el-option
            v-for="({ label, value }, index) in conditionTypeOpstions"
            :key="index"
            :label="label"
            :value="value"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="conditionTypeIs('expression')" label="表达式">
        <el-input v-model="conditionForm.expression"></el-input>
      </el-form-item>
      <template v-if="conditionTypeIs('script')">
        <el-form-item label="脚本格式">
          <el-input v-model="conditionForm.scriptFormat"></el-input>
        </el-form-item>
        <el-form-item label="脚本类型">
          <el-select v-model="conditionForm.scriptType">
            <el-option
              v-for="({ label, value }, index) in conditionScriptTypeOptions"
              :key="index"
              :label="label"
              :value="value"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="scriptTypeIs('external')" label="资源地址">
          <el-input v-model="conditionForm.scriptResource" />
        </el-form-item>
        <el-form-item v-if="scriptTypeIs('inline')" label="脚本">
          <el-input v-model="conditionForm.script" type="textarea" :rows="3"></el-input>
        </el-form-item>
      </template>
    </el-form>
  </div>
</template>

<script>
import { deepCopy, deepEquals, emptyPropertiesObject } from '../../../utils/object'

export default {
  name: 'ConditionPanel',
  props: {
    namespace: {
      type: String,
      required: true,
      default: '',
    },
  },
  data() {
    return {
      conditionForm: {},
    }
  },
  computed: {
    condition() {
      return this.$store.state[this.namespace].panel.condition
    },
    conditionTypeOpstions() {
      return this.$store.state[this.namespace].config.conditionTypeOpstions
    },
    conditionScriptTypeOptions() {
      return this.$store.state[this.namespace].config.conditionScriptTypeOptions
    },
  },
  watch: {
    condition: {
      deep: true,
      immediate: true,
      handler(value) {
        this.conditionForm = { ...this.conditionForm, ...deepCopy(value) }
      },
    },
    conditionForm: {
      deep: true,
      immediate: true,
      handler(value) {
        if (emptyPropertiesObject(value) || deepEquals(value, this.condition)) {
          return
        }
        this.updateCondition({ newCondition: deepCopy(value) })
      },
    },
  },
  methods: {
    updateCondition(payload) {
      this.$store.commit(`${this.namespace}/panel/updateCondition`, payload)
    },
    conditionTypeIs(type) {
      return this.conditionForm['type'] && this.conditionForm['type'] === type
    },
    scriptTypeIs(type) {
      return this.conditionForm['scriptType'] && this.conditionForm['scriptType'] === type
    },
  },
}
</script>

<style scoped lang="scss">
@import '../index.scss';
</style>
