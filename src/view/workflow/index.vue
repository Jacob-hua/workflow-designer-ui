<template>
  <div class="work-home">
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="项目流程" name="second">
        <project-work></project-work>
      </el-tab-pane>
      <el-tab-pane label="公共流程" name="first">
        <public-work></public-work>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import PublicWork from './component/publicWork.vue'
import ProjectWork from './component/projectWork.vue'

export default {
  name: 'workflow',
  components: {
    PublicWork,
    ProjectWork,
  },
  data() {
    return {
      activeName: 'second',
    }
  },
}
</script>

<style scoped lang="scss"></style>
