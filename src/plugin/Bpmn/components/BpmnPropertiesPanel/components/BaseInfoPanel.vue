<template>
  <div>
    <el-form :model="baseInfoForm" label-position="right" label-width="130px">
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
    listeners() {
      return this.$store.state[this.namespace].panel.listeners
    },
    labels() {
      return {
        id: `${zh[this.shapeType] ?? '流程'}ID`,
        name: `${zh[this.shapeType] ?? '流程'}名称`,
      }
    },
  },
  watch: {
    shapeType(value) {
      const existedListener = (listener) =>
        this.listeners.find(
          (item) =>
            item.event === listener.event &&
            item.listenerType === listener.listenerType &&
            item.class === listener.class
        )
      const listener = {
        event: 'start',
        listenerType: 'class',
        class: '',
      }
      if ([shapeType.TIMER_START_EVENT].includes(value)) {
        this.clearListener()
        listener.class = 'com.siact.product.jwp.listener.ScheduleStartListener'
      } else if ([shapeType.TIMER_NON_INTERRUPTING_BOUNDARY_EVENT].includes(value)) {
        this.clearListener()
        listener.class = 'com.siact.product.jwp.listener.TimeOutListener'
      } else if (
        [
          shapeType.START_EVENT, // 开始事件
          shapeType.MESSAGE_START_EVENT, // 消息开始事件
          shapeType.CONDITIONAL_START_EVENT, // 条件开始事件
          shapeType.SIGNAL_START_EVENT, // 信号开始事件
          shapeType.END_EVENT, // 结束事件
          shapeType.INTERMEDIATE_THROW_EVENT, // 中间抛出事件
          shapeType.INTERMEDIATE_CATCH_EVENT, // 中间捕获事件
          shapeType.BOUNDARY_EVENT, // 边界事件
          shapeType.MESSAGE_BOUNDARY_EVENT, // 消息边界事件
          shapeType.MESSAGE_NON_INTERRUPTING_BOUNDARY_EVENT, // 消息边界事件（非中断）
          shapeType.TIMER_BOUNDARY_EVENT, // 定时边界事件
          shapeType.ESCALATION_BOUNDARY_EVENT, // 升级边界事件
          shapeType.ESCALATION_NON_INTERRUPTING_BOUNDARY_EVENT, // 升级边界事件（非中断）
          shapeType.CONDITIONAL_BOUNDARY_EVENT, // 条件边界事件
          shapeType.CONDITIONAL_NON_INTERRUPTING_BOUNDARY_EVENT, // 条件边界事件（非中断）
          shapeType.ERROR_BOUNDARY_EVENT, // 错误边界事件
          shapeType.SIGNAL_BOUNDARY_EVENT, // 信号边界事件
          shapeType.SIGNAL_NON_INTERRUPTING_BOUNDARY_EVENT, // 信号边界事件（非中断）
          shapeType.COMPENSATE_BOUNDARY_EVENT, // 补偿边界事件
        ].includes(value)
      ) {
        this.clearListener()
        return
      }
      if (listener.class === '' || existedListener(listener)) {
        return
      }
      this.addListener({ listener })
    },
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
    addListener(payload) {
      this.$store.commit({
        type: `${this.namespace}/panel/addListener`,
        ...payload,
      })
    },
    clearListener() {
      this.$store.commit({
        type: `${this.namespace}/panel/clearListener`,
      })
    },
  },
}
</script>

<style></style>
