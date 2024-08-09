<template>
  <div class="form-home">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane label="项目表单" name="second">
        <ProjectForm v-if="activeName === 'second'"></ProjectForm>
      </el-tab-pane>
      <el-tab-pane label="公共表单" name="first">
        <PublicForm v-if="activeName === 'first'"></PublicForm>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import ProjectForm from './component/ProjectForm.vue';
import PublicForm from './component/PublicForm.vue';
export default {
  data() {
    return {
      activeName: 'second',
    };
  },
  methods: {
    handleClick() {},
  },
  components: {
    ProjectForm,
    PublicForm,
  },
};
</script>

<style scoped lang="scss">
// .form-home {
//   /deep/ .el-tabs--border-card {
//     overflow-x: auto;
//     .el-tabs__header,
//     .el-tabs__content {
//       width: 1618px;
//     }
//   }
// }
</style>
