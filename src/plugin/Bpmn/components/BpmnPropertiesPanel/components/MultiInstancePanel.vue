<template>
  <div>
    <el-form label-position="right"
             label-width="80px">
      <el-form-item label="回路特性">
        <el-select v-model="instanceForm.loopCharacteristics">
          <el-option v-for="({label, value}, index) in loopCharacteristicsOptions"
                     :key="index"
                     :label="label"
                     :value="value" />
        </el-select>
      </el-form-item>
      <template v-if="isNotStandardLoopInstance">
        <el-form-item label="循环基数"
                      key="loopCardinality">
          <el-input v-model="instanceForm.loopCardinality"
                    clearable />
        </el-form-item>
        <el-form-item label="集合"
                      key="collection">
          <el-input v-model="instanceForm.collection"
                    clearable />
        </el-form-item>
        <el-form-item label="元素变量"
                      key="elementVariable">
          <el-input v-model="instanceForm.elementVariable"
                    clearable />
        </el-form-item>
        <el-form-item label="完成条件"
                      key="completionCondition">
          <el-input v-model="instanceForm.completionCondition"
                    clearable />
        </el-form-item>
      </template>
    </el-form>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { deepCopy } from '../../../utils/object'

export default {
  name: 'MultiInstancePanel',
  data() {
    return {
      instanceForm: {
        loopCharacteristics: '',
        loopCardinality: '',
        collection: '',
        elementVariable: '',
        completionCondition: '',
      },
    }
  },
  computed: {
    ...mapState('bpmn/config', ['loopCharacteristicsOptions']),
    ...mapState('bpmn/panel', ['multiInstance']),
    isNotStandardLoopInstance() {
      return (
        this.instanceForm.loopCharacteristics &&
        this.instanceForm.loopCharacteristics !== 'StandardLoop'
      )
    },
  },
  watch: {
    multiInstance(value) {
      this.instanceForm = { ...this.instanceForm, ...deepCopy(value) }
    },
  },
}
</script>

<style>
</style>