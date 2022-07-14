<template>
  <div>
    <el-form :model="baseInfoForm" label-position="right" label-width="100px">
      <el-form-item label="流程名称">
        <el-input v-model="baseInfoForm.name" clearable></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { deepCopy, deepEquals } from '../../../utils/object'

export default {
  name: 'BaseInfo',
  props: {
    namespace: {
      type: String,
      required: true,
      default: '',
    },
  },
  data() {
    return {
      baseInfoForm: {},
    }
  },
  computed: {
    baseInfo() {
      return this.$store.state[this.namespace].panel.baseInfo
    },
  },
  watch: {
    baseInfo(value) {
      this.baseInfoForm = { ...value }
    },
    baseInfoForm: {
      deep: true,
      immediate: true,
      handler(value) {
        if (deepEquals(value, this.baseInfo)) {
          return
        }
        this.updateBaseInfo({ newBaseInfo: deepCopy(value) })
      },
    },
  },
  mounted() {
    this.baseInfoForm = deepCopy(this.baseInfo)
  },
  methods: {
    updateBaseInfo(payload) {
      this.$store.commit(`${this.namespace}/panel/updateBaseInfo`, payload)
    },
  },
}
</script>

<style></style>
