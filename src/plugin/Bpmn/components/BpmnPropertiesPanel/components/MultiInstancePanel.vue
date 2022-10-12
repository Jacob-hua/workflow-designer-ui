<template>
  <div>
    <el-form label-position="right" label-width="130px">
      <el-form-item label="回路特性">
        <el-select v-model="instanceForm.loopCharacteristics" clearable>
          <el-option
            v-for="({ label, value }, index) in loopCharacteristicsOptions"
            :key="index"
            :label="label"
            :value="value"
          />
        </el-select>
      </el-form-item>
      <template v-if="isNotStandardLoopInstance">
        <el-form-item label="循环基数" key="loopCardinality">
          <el-input v-model="instanceForm.loopCardinality" clearable />
        </el-form-item>
        <el-form-item label="集合" key="collection">
          <el-input v-model="instanceForm.collection" clearable />
        </el-form-item>
        <el-form-item label="元素变量" key="elementVariable">
          <el-input v-model="instanceForm.elementVariable" clearable />
        </el-form-item>
        <el-form-item label="完成条件" key="completionCondition">
          <el-input v-model="instanceForm.completionCondition" clearable />
        </el-form-item>
      </template>
    </el-form>
  </div>
</template>

<script>
import { deepCopy, deepEquals, emptyPropertiesObject } from '../../../utils/object'

export default {
  name: 'MultiInstancePanel',
  props: {
    namespace: {
      type: String,
      required: true,
      default: '',
    },
  },
  data() {
    return {
      instanceForm: {},
    }
  },
  computed: {
    loopCharacteristicsOptions() {
      return this.$store.state[this.namespace].config.loopCharacteristicsOptions
    },
    multiInstance() {
      return this.$store.state[this.namespace].panel.multiInstance
    },
    isNotStandardLoopInstance() {
      return this.instanceForm.loopCharacteristics && this.instanceForm.loopCharacteristics !== 'StandardLoop'
    },
  },
  watch: {
    multiInstance: {
      deep: true,
      immediate: true,
      handler(value) {
        this.instanceForm = { ...this.instanceForm, ...deepCopy(value) }
      },
    },
    instanceForm: {
      deep: true,
      immediate: true,
      handler(value) {
        if (emptyPropertiesObject(value) || deepEquals(value, this.multiInstance)) {
          return
        }
        this.updateMultiInstance({ newMultiInstance: deepCopy(value) })
      },
    },
  },
  mounted() {
    this.instanceForm = { ...deepCopy(this.multiInstance) }
  },
  methods: {
    updateMultiInstance(payload) {
      this.$store.commit({
        type: `${this.namespace}/panel/updateMultiInstance`,
        ...payload,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../index.scss';
</style>
