<template>
  <div>
    <el-form size="mini"
             label-width="90px"
             ref="baseInfo"
             :model="baseInfo">
      <el-form-item label="名称">
        <el-input v-model="name"
                  clearable></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'baseInfo',
  data() {
    return {
      baseInfo: {
        name: '',
      },
    }
  },
  computed: {
    ...mapState('bpmn', ['name']),
  },
}
</script>

<style>
</style>