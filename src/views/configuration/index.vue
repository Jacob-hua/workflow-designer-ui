<template>
  <div class="configuration">
    <div class="home-main">
      <div class="home-main-tab">
        <span class="home-main-tab-item" :class="activeName === 'first' ? 'active' : ''" @click="activeName = 'first'">访问配置</span>
        <span class="home-main-tab-item" :class="activeName === 'second' ? 'active' : ''" @click="activeName = 'second'">业务配置</span>
        <el-button type="primary" class="buttonTab" v-if="activeName === 'first'" @click="showDiolog">新建访问配置</el-button>
        <!-- <el-button type="primary" class="buttonTab" v-if="activeName === 'second'" @click="showDiolog">新建业务配置</el-button> -->
      </div>
      <div class="home-table">
        <visitCall v-show="activeName === 'first'" ref="first" @editTable="editTable()" @deleteTable="deleteTable()"></visitCall>
        <businessCall v-show="activeName === 'second'" ref="second"></businessCall>
      </div>
    </div>
    
  </div>
</template>

<script>
  import visitCall from './visitCall/index.vue'
  import businessCall from './businessCall/index.vue'
  export default {
    data() {
      return {
        activeName: 'first',
        jsonData: {
          total: 25,
          limit: 10,
          skip: 0,
          link: {
            previous: 'LL',
            Evle: 'KK'
          }
        }
      }
    },
    methods:{
      showDiolog() {
        this.$refs[this.activeName].$refs.visitDiolog.dialogVisible2 = true
      },
      editTable() {
        this.$refs[this.activeName].$refs.visitDiolog.dialogVisible2 = true
      },
      deleteTable() {
        this.$confirm('删除不可恢复, 请确认是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      }
    },
    components:{
      visitCall,
      businessCall
    }
  }
</script>

<style scoped="scoped">
  
  .buttonTab {
    position: absolute;
    right: 0px;
    top: 10px;
  }
  
  .configuration {
    padding: 20px;
  }
  
  .home-main {
    position: relative;
    margin-top: 40px;
  }
  
  .home-main-tab {
    display: flex;
  }
  
  .home-main-tab-item {
    display: inline-block;
    height: 60px;
    width: 200px;
    line-height: 60px;
    text-align: center;
    font-size: 14px;
    cursor: pointer;
    border: 1px solid #cccccc;
  }
  
  .active {
    background-color: #030303;
    color: white;
  }
  
</style>
