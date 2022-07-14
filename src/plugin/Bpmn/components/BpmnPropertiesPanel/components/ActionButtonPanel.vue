<template>
  <div>
    <el-checkbox-group v-model="btnList">
      <el-checkbox v-for="({ label, value }, index) in actionButtons(multiInstance)" :key="index" :label="value">{{
        label
      }}</el-checkbox>
    </el-checkbox-group>
  </div>
</template>

<script>
import { deepEquals } from '../../../utils/object'

export default {
  name: 'ActionButtonPanel',
  props: {
    namespace: {
      type: String,
      required: true,
      default: '',
    },
  },
  data() {
    return {
      btnList: [],
    }
  },
  computed: {
    actions() {
      return this.$store.state[this.namespace].panel.actions
    },
    multiInstance() {
      return this.$store.state[this.namespace].panel.multiInstance
    },
    actionButtons() {
      return this.$store.getters[`${this.namespace}/config/actionButtons`]
    },
  },
  watch: {
    actions(value) {
      this.btnList = [...value]
    },
    btnList(value) {
      if (deepEquals(value, this.actions)) {
        return
      }
      this.updateActions({ newActions: [...value] })
    },
  },
  mounted() {
    this.btnList = [...this.actions]
  },
  methods: {
    updateActions(payload) {
      this.$store.commit({
        type: `${this.namespace}/panel/updateActions`,
        ...payload,
      })
    },
  },
}
</script>

<style></style>
