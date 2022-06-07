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

export default {
  name: 'ActionButtonPanel',
  data() {
    return {
      btnList: [],
    }
  },
  computed: {
    ...mapState('bpmn/config', ['actionButtons']),
  },
  watch: {
    btnList(value) {
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