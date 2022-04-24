<template>
  <div class="form-home">
    <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="公共表单" name="first">
          <PublicForm v-if="activeName === 'first'"></PublicForm>
        </el-tab-pane>
        <el-tab-pane label="项目表单" name="second">
          <ProjectForm v-if="activeName === 'second'"></ProjectForm>
        </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import ProjectForm from './component/ProjectForm.vue'
  import PublicForm from './component/PublicForm.vue'
  export default {
    data() {
      return {
        activeName: 'first'
      }
    },
    methods:{
      handleClick() {
        
      }
    },
    components:{
      ProjectForm,
      PublicForm
    }
  }
</script>

<style scoped="scoped">
  .form-home {
    padding: 0px 25px;
  }
  /deep/ .el-tabs__item {
    width: 200px;
    height: 60px;
    line-height: 70px;
    text-align: center;
    font-size: 16px;
  }
</style>
