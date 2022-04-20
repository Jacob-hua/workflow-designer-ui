<template>
  <div class="work-home">
    <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="公共表单" name="first">
          <publicWork></publicWork>
        </el-tab-pane>
        <el-tab-pane label="项目表单" name="second">
          <projectWork></projectWork>
        </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import publicWork from './component/publicWork.vue'
  import projectWork from './component/projectWork.vue'
  export default {
    data() {
      return {
        activeName: 'first',
      }
    },
    methods:{
      handleClick() {
        
      }
    },
    components:{
      publicWork,
      projectWork
    }
  }
</script>

<style scoped="scoped">
  .work-home {
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
