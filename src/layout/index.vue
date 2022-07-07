<template>
  <div>
    <el-container>
      <el-header class="header">
        <div v-if="!status" class="user-info">
          <span>{{ userInfo.name }}</span>
          <span @click="exitProject()">退出</span>
        </div>
      </el-header>
      <el-container>
        <el-aside>
          <div class="aside-logo">
            <img :src="require('../assets/image/common/logo.png')" />
            <div class="describe">
              流程引擎工作台
              <div class="divider"></div>
              <span>Workflow Engine Platform</span>
            </div>
          </div>
          <el-menu :default-active="$route.name" router @open="handleOpen" @close="handleClose" v-if="!status">
            <el-menu-item :index="item.menuRoute" v-for="(item, index) in menuList" :key="index">
              <i class="el-icon-location"></i>
              <span>{{ menuListNameMapping[item.menuRoute] }}</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <div class="main">
          <el-main>
            <router-view></router-view>
          </el-main>
        </div>
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
$header-height: 48px;
$aside-width: 240px;
$aside-logo-height: 288px;

.header {
  height: $header-height !important;
  line-height: $header-height;
  font-size: 16px;
  background-color: $header-bg-color;
  padding: 0px 26px;

  .user-info {
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    color: #ffffff;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;

    :last-child {
      margin-left: 12px;
    }
  }
}

.el-aside {
  height: 100vh;
  width: $aside-width !important;
  display: flex;
  flex-direction: column;
  background-color: $menu-bg-color;
}

.aside-logo {
  width: $aside-width;
  height: $aside-logo-height;
  color: #ffffff;
  background-color: $logo-bg-color;
  border-radius: 0px 30px 30px 0px;
  position: absolute;
  top: 0px;

  img {
    width: 168px;
    padding: 57px 0px 60px 30px;
  }

  .describe {
    margin: 0px 41px;
    font-size: 16px;
    line-height: 20px;
    font-weight: 400;

    .divider {
      width: 100%;
      height: 2px;
      background: #ffffff;
      margin: 8px 0px;
    }

    span {
      font-size: 12px;
      font-weight: 400;
      line-height: 20px;
    }
  }
}

.el-menu {
  flex-grow: 1;
  background-color: $menu-bg-color;
  border-right: 0;
  position: absolute;
  top: $aside-logo-height;
  width: $aside-width;
  padding-top: 26px;

  :hover {
    background-color: $menu-active-bg-color;
  }

  .el-menu-item {
    color: $menu-color;
    font-size: 16px;
  }

  .is-active {
    color: #ffffff;
    background-color: $menu-active-bg-color;

    ::after {
      content: '';
      display: block;
      position: absolute;
      right: 0;
      bottom: 100%;
      border-bottom-right-radius: 30px;
      width: 30px;
      height: 30px;
      box-shadow: 0.49rem 0.49rem $menu-active-bg-color;
    }

    ::before {
      content: '';
      display: block;
      position: absolute;
      right: 0;
      top: 100%;
      border-top-right-radius: 30px;
      width: 30px;
      height: 30px;
      box-shadow: 0.49rem -0.49rem $menu-active-bg-color;
    }
  }
}

.el-menu-item {
  color: $menu-color;
}

.main {
  width: 100%;
  
  ::-webkit-scrollbar {
    display: none;
  }
}

.el-main {
  padding: 40px 20px;
  overflow: auto;
  height: calc(100vh - 40px);
}
</style>
