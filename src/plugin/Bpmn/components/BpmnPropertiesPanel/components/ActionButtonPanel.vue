<template>
  <div>
    <el-checkbox-group v-model="btnList">
      <el-checkbox v-for="({label, value}, index) in actionButtons(multiInstance)"
                   :key="index"
                   :label="value">{{label}}</el-checkbox>
    </el-checkbox-group>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapState } from 'vuex'
import { deepEquals } from '../../../utils/object'

export default {
  name: 'ActionButtonPanel',
  data() {
    return {
      btnList: [],
    }
  },
  computed: {
    ...mapState('bpmn/panel', ['actions', 'multiInstance']),
    ...mapGetters('bpmn/config', ['actionButtons']),
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
    ...mapMutations('bpmn/panel', ['updateActions']),
  },
}
</script>

<style>
</style>