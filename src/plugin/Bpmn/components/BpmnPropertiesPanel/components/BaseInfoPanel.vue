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
import shapeType from '../../../enum/shapeType'
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
      const shapeLabelHandle = {
        [shapeType.START_EVENT]: '开始节点',
        [shapeType.END_EVENT]: '结束节点',
        [shapeType.SEQUENCE_FLOW]: '连接',
        [shapeType.USER_TASK]: '用户任务',
        [shapeType.TASK]: '任务',
        [shapeType.COMPLEX_GATEWAY]: '复杂网关',
        [shapeType.PARALLEL_GATEWAY]: '并联网关',
        [shapeType.EXCLUSIVE_GATEWAY]: '互斥网关',
        [shapeType.INCLUSIVE_GATEWAY]: '相容网关',
        [shapeType.EVENT_BASE_GATEWAY]: '事件网关',
      }
      return {
        id: `${shapeLabelHandle[this.shapeType] ?? '流程'}ID`,
        name: `${shapeLabelHandle[this.shapeType] ?? '流程'}名称`,
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
