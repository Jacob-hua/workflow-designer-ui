<template>
  <div>
    <el-form size="mini"
             label-width="90px"
             ref="baseInfo">
      <el-form-item label="名称">
        <el-input :value="baseInfo.name"
                  clearable
                  @input="onNameChange"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'BaseInfo',
  computed: {
    ...mapGetters('bpmn/panel', ['baseInfo']),
  },
  methods: {
    ...mapMutations('bpmn/panel', ['updateBaseInfo']),
    onNameChange(name) {
      this.updateBaseInfo({ name })
    },
  },
}
</script>

<style>
</style>