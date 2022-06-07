<template>
  <div>
    <el-checkbox-group v-model="btnList">
      <el-checkbox v-for="(label, index) in actionButtons"
                   :key="index"
                   :label="label"></el-checkbox>
    </el-checkbox-group>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import { deepEquals } from '../../../utils/object'

export default {
  name: 'ActionButtonPanel',
  data() {
    return {
      btnList: [],
    }
  },
  computed: {
    ...mapState('bpmn/config', ['actionButtons']),
    ...mapState('bpmn/panel', ['actions']),
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
  methods: {
    ...mapMutations('bpmn/panel', ['updateActions']),
  },
}
</script>

<style>
</style>