<template>
  <div>
    <el-form :model="timerForm" label-position="right" label-width="100px">
      <el-form-item label="定时器类型">
        <el-select v-model="timerForm.timerType">
          <el-option
            v-for="({ label, value }, index) in timerTypeOptions"
            :key="index"
            :label="label"
            :value="value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="timerTypeIsNotNull()" label="定时器">
        <el-input v-model="timerForm.timer" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { deepCopy, deepEquals, emptyPropertiesObject } from '../../../utils/object'

export default {
  name: 'TimerPanel',
  props: {
    namespace: {
      type: String,
      required: true,
      default: '',
    },
  },
  data() {
    return {
      timerForm: {},
    }
  },
  computed: {
    timerTypeOptions() {
      return this.$store.state[this.namespace].config.timerTypeOptions
    },
    timer() {
      return this.$store.state[this.namespace].panel.timer
    },
  },
  watch: {
    timer: {
      deep: true,
      immediate: true,
      handler(value) {
        this.timerForm = { ...this.timerForm, ...deepCopy(value) }
      },
    },
    timerForm: {
      deep: true,
      immediate: true,
      handler(value) {
        if (emptyPropertiesObject(value) || deepEquals(value, this.timer)) {
          return
        }
        this.updateTimer({ newTimer: deepCopy(value) })
      },
    },
  },
  methods: {
    timerTypeIsNotNull() {
      return this.timerForm['timerType'] && this.timerForm['timerType'] !== 'null'
    },
    updateTimer(payload) {
      this.$store.commit({
        type: `${this.namespace}/panel/updateTimer`,
        ...payload,
      })
    },
  },
}
</script>

<style></style>
