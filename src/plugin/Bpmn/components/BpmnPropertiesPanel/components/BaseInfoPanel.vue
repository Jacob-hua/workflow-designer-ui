<template>
  <div>
    <el-form size="mini"
             label-width="90px"
             ref="baseInfo"
             :model="baseInfo">
      <el-form-item label="名称">
        <el-input :value="name"
                  clearable
                  @input="updateName"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'

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
    ...mapState('bpmn/panel', ['name']),
  },
  methods: {
    ...mapMutations('bpmn/panel', ['updateName']),
  }
}
</script>

<style>
</style>