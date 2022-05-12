<template>
  <div>
    <el-container>
      <!-- <el-header>Header</el-header> -->
      <el-container>
        <el-aside width="260px">
          <div class="Logo">
            流程引擎工作台
          </div>
          <el-menu :default-active="$route.name" class="el-menu-vertical-demo" router @open="handleOpen" @close="handleClose" v-if="!status">
            <el-menu-item index="bpmn">
              <i class="el-icon-location"></i>
              <span>工作流管理</span>
            </el-menu-item>
            <el-menu-item index="form">
              <i class="el-icon-menu"></i>
              <span slot="title">表单管理</span>
            </el-menu-item>
            <el-menu-item index="home">
              <i class="el-icon-document"></i>
              <span slot="title">工作流驾驶舱</span>
            </el-menu-item>
            <el-menu-item index="runTime">
              <i class="el-icon-setting"></i>
              <span slot="title">运行中工作流</span>
            </el-menu-item>
            <el-menu-item index="history">
              <i class="el-icon-setting"></i>
              <span slot="title">历史工作流</span>
            </el-menu-item>
             <el-menu-item index="all">
               <i class="el-icon-setting"></i>
               <span slot="title">工作流全局配置</span>
             </el-menu-item>
             <el-menu-item index="power">
               <i class="el-icon-setting"></i>
               <span slot="title">权限管理</span>
             </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main>
          <div class="loginHeader">
            <div class="userinfo" v-if="!status">
              <span class="userInfoName">{{ $store.state.userInfo.name }}</span>
              <span class="exitClss" @click="exitProject()">退出</span>
            </div>
          </div>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        status: false
      }
    },
    methods: {
      handleOpen() {

      },
      handleClose() {

      },
      exitProject() {
        this.$router.push('/')
      }
    },
    mounted() {
      
    },
    created() {
      let userInfo = sessionStorage.getItem('loginData')
      this.status = (sessionStorage.getItem('status') === '我是菜鸡')
      if (userInfo) {
        this.$store.state.userInfo.name = JSON.parse(userInfo).account
      } else{
        this.$router.push('/')
      }
    }
  }
</script>

<style scoped="scoped">
  /deep/ .el-header {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    /* height: 10vh !important; */
  }

  .Logo {
    height: 175px;
    background-color: #666666;
    color: white;
    /* background-color: white; */
    /* color: black; */
    font-size: 20px;
    line-height: 215px;
    padding-left: 20px;
    /* text-align: center; */
    font-weight: 700;
  }

  .el-aside {
    /* background-color: #D3DCE6; */
    color: #333;
    text-align: left;
    height: 100vh;
    width: 100%;
  }

  .loginHeader {
    height: 48px;
    line-height: 48px;
    font-size: 16px;
    background-color: #999999;
    padding: 0px 10px;
  }

  .el-main {
    /* background-color: #E9EEF3; */
    color: #333;
    text-align: left;
    height: 100vh;
    /* padding: 0px; */
    width: 100%;
    padding: 0px 0px;
  }
  
  /deep/ .el-submenu__title i {
    margin-top: -4px;
  }
  
  /deep/ .el-menu-item-group__title {
    display: none;
  }
  
  .userinfo {
    float: right;
  }
  
  
  .exitClss {
    display: inline-block;
    width: 40px;
    text-align: center;
    font-size: 14px;
    color: white;
    cursor: pointer;
  }
</style>
