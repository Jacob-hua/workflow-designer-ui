<template>
  <div>
    <el-form :model="baseInfoForm"
             label-position="right"
             label-width="80px">
      <el-form-item label="名称">
        <el-input v-model="baseInfoForm.name"
                  clearable></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import { deepCopy, deepEquals } from '../../../utils/object'

export default {
  name: 'BaseInfo',
  data() {
    return {
      baseInfoForm: {},
    }
  },
  computed: {
    ...mapState('bpmn/panel', ['baseInfo']),
  },
  watch: {
    baseInfo(value) {
      if (deepEquals(value, this.baseInfoForm)) {
        return
      }
      this.baseInfoForm = { ...value }
    },
    baseInfoForm: {
      deep: true,
      immediate: true,
      handler(value) {
        this.updateBaseInfo({ newBaseInfo: deepCopy(value) })
      },
    },
  },
  methods: {
    ...mapMutations('bpmn/panel', ['updateBaseInfo']),
  },
}
</script>

<style>
</style>