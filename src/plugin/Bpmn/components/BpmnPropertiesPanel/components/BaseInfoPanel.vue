<template>
  <div>
    <el-form :model="baseInfoForm" label-position="right" label-width="100px">
      <el-form-item :label="labels.id">
        <el-input v-model="baseInfoForm.id" disabled></el-input>
      </el-form-item>
      <el-form-item :label="labels.name">
        <el-input v-model="baseInfoForm.name" clearable></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import zh from '../../../i18n/zh'
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
    shapeType() {
      return this.$store.state[this.namespace].panel.shapeType
    },
    labels() {
      return {
        id: `${zh[this.shapeType] ?? '流程'}ID`,
        name: `${zh[this.shapeType] ?? '流程'}名称`,
      }
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
