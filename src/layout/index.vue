<template>
  <div>
    <el-container>
      <el-container>
        <el-aside width="260px">
          <div class="Logo">
            流程引擎工作台
          </div>
          <el-menu :default-active="$route.name"
                   class="el-menu-vertical-demo"
                   router
                   @open="handleOpen"
                   @close="handleClose"
                   v-if="!status">
            <el-menu-item :index="item.menuRoute"
                          v-for="(item, index) in menuList"
                          :key="index">
              <i class="el-icon-location"></i>
              <span>{{ menuListNameMapping[item.menuRoute] }}</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main>
          <div class="loginHeader">
            <div class="userinfo"
                 v-if="!status">
              <span class="userInfoName">{{ userInfo.name }}</span>
              <span class="exitClss"
                    @click="exitProject()">退出</span>
            </div>
          </div>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import CONSTANT from '@/constant'
import { mapMutations, mapState } from 'vuex'

export default {
  data() {
    return {
      status: false,
      menuList: [],
      menuListMapping: {
        Workflow: 'bpmn',
        Form: 'form',
        Home: 'home',
        RunTime: 'runTime',
        History: 'history',
        Configuration: 'all',
        Power: 'power',
      },
      menuListNameMapping: {
        Workflow: '工作流管理',
        Form: '表单管理',
        Home: '工作流驾驶舱',
        RunTime: '运行中工作流',
        History: '历史工作流',
        Configuration: '工作流全局配置',
        Power: '权限管理',
      },
    }
  },
  computed: {
    ...mapState('account', ['userInfo']),
  },
  created() {
    let userInfo = sessionStorage.getItem('loginData')
    this.status =
      sessionStorage.getItem('status') === CONSTANT.LOGIN_FROM_WORKFLOW_ITSELF
    if (userInfo) {
      this.updateUserInfo({
        userInfo: JSON.parse(userInfo),
      })
    } else {
      this.$router.push('/')
    }

    let { menuProjectList } = JSON.parse(sessionStorage.getItem('loginData'))

    this.menuList = menuProjectList.filter((item) => {
      return item.projectList.length > 0
    })
    if (this.menuList.length > 0) {
      let findRole = this.menuList.filter((item) => {
        return item.menuRoute === this.$route.name
      })
      if (findRole === -1) {
        this.$router.push(this.menuListMapping[this.menuList[0].menuRoute])
      }
    } else {
      this.$router.push('/')
      this.$message.error('该账号无任何菜单访问权限')
    }
  },
  methods: {
    ...mapMutations('account', ['updateUserInfo']),
    handleOpen() {},
    handleClose() {},
    exitProject() {
      this.$router.push('/')
    },
  },
}
</script>

<style scoped="scoped">
::v-deep .el-header {
  background-color: #b3c0d1;
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

::v-deep .el-submenu__title i {
  margin-top: -4px;
}
::v-deep .el-menu-item-group__title {
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
