<template>
  <div class="workflow-wrapper">
    <el-tabs type="border-card">
      <el-tab-pane label="项目流程">
        <project-work></project-work>
      </el-tab-pane>
      <el-tab-pane label="公共流程">
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
}
</script>

<style scoped lang="scss">
// .workflow-wrapper {
//   /deep/ .el-tabs--border-card {
//     overflow-x: auto;
//     .el-tabs__header, .el-tabs__content {
//       width: 1618px;
//     }
//   }
// }
</style>
