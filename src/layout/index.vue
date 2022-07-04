<template>
  <div>
    <el-container>
      <el-container>
        <el-aside width="260px">
          <div class="sider-logo">流程引擎工作台</div>
          <el-menu :default-active="$route.name" router @open="handleOpen" @close="handleClose" v-if="!status">
            <el-menu-item :index="item.menuRoute" v-for="(item, index) in menuList" :key="index">
              <i class="el-icon-location"></i>
              <span>{{ menuListNameMapping[item.menuRoute] }}</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main>
          <div class="header-color">
            <div class="userinfo" v-if="!status">
              <span class="userInfoName">{{ userInfo.name }}</span>
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
import CONSTANT from '@/constant'
import { mapMutations, mapState } from 'vuex'

export default {
  data() {
    return {
      status: false,
      menuList: [],
      menuListMapping: {
        Workflow: 'Workflow',
        Form: 'Form',
        Home: 'Home',
        RunTime: 'RunTime',
        History: 'History',
        Configuration: 'Configuration',
        Power: 'Power',
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
    this.status = sessionStorage.getItem('status') === CONSTANT.LOGIN_FROM_WORKFLOW_ITSELF
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
      if (findRole.length === 0) {
        this.$router.push({ name: this.menuList[0].menuRoute })
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

<style lang="scss" scoped>
body {
  overflow: hidden;
  margin: 0;
  box-sizing: border-box;
  height: 100%;
}

.sider-logo {
  height: 175px;
  background-color: $logo-bg-color;
  color: #ffffff;
  font-size: 20px;
  line-height: 215px;
  padding-left: 20px;
  font-weight: 700;
}

.header-color {
  height: 48px;
  line-height: 48px;
  font-size: 16px;
  background-color: $header-bg-color;
  padding: 0px 10px;
}

.el-main {
  color: #333;
  text-align: left;
  height: 100%;
  padding: 0;
}

.el-menu {
  background-color: $menu-bg-color;
  border-right: 0;

  :hover {
    background-color: $menu-active-bg-color;
  }

  .is-active {
    color: #ffffff;
    background-color: $menu-active-bg-color;
  }
}

.el-menu-item {
  color: $menu-color;
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
