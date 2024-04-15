<template>
  <div>
    <el-form :model="conditionForm" label-position="right" label-width="130px">
      <el-form-item label="判断类型">
        <el-select v-model="conditionForm.judgment">
          <el-option
            v-for="({ label, value }, index) in judgmentTypeOpstions"
            :key="index"
            :label="label"
            :value="value"
          />
        </el-select>
      </el-form-item>
      <el-form-item  label="目标值">
        <!-- <el-input v-model="conditionForm.target"></el-input> -->
        <el-select allow-create filterable v-model="conditionForm.conditionTarget" @focus="handlerToFocus" @blur="handlerToBlur">
          <el-option
            v-for="({ label, value }, index) in conditionTragetOptions"
            :key="index"
            :label="label"
            :value="value"
          />
        </el-select>
      </el-form-item>
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
    judgmentTypeOpstions() {
      return this.$store.state[this.namespace].config.judgmentTypeOpstions
    },
    conditionTragetOptions() {
      return this.$store.state[this.namespace].config.conditionTragetOptions
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
    changeInput(e) {
      this.conditionTragetOptions.push({
        label: e.target.value,
        value: e.target.value
      })
      this.conditionForm.conditionTarget = e.target.value
    },
    handlerToFocus(e) {
      const target = e.target
      target.addEventListener('change', this.changeInput)
    },
    handlerToBlur(e) {
      const target = e.target
      target.removeEventListener('change', this.changeInput)
    }
  },
}
</script>

<style scoped lang="scss">
@import '../index.scss';
</style>
