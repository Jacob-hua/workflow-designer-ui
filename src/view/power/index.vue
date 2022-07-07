<template>
  <div class="power">
    <div class="projectHeader">
      <el-select v-model="projectCode" placeholder="请选择" @change="changProjectCode">
        <el-option v-for="item in projectOption" :key="item.id" :label="item.name" :value="item.code">
        </el-option>
      </el-select>
    </div>
    <div class="power-body">
      <el-tabs v-model="power" type="border-card"  @tab-click="changePower">
        <el-tab-pane label="人员权限" name="Personnel">
          <personel v-if="power === 'Personnel' && permissionRole" :business="projectCode"></personel>-->
          <permission v-if="!permissionRole"></permission>-->
        </el-tab-pane>
        <el-tab-pane label="角色权限" name="Role">
          <role v-if="power === 'Role' && permissionRole" :business="projectCode"></role>-->
          <permission v-if="!permissionRole"></permission>-->
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  import personel from './personnel/index.vue'
  import role from './role/index.vue'
  import permission from '@/component/permission/index.vue'
  import {getProjectList} from "@/api/globalConfig";
  import { mapState } from  'vuex'
  export default {
    data() {
      return {
        projectOption: [],
        projectCode: '',
        power: 'Personnel',
        permissionRole: true
      }
    },
    mounted() {
      this.getProjectList()
    },
    computed: {
      ...mapState('account',['userInfo', 'tenantId'])
    },
    methods:{
      async getProjectList(){
        let res = await getProjectList({
          count: -1,
          projectCode: '',
          tenantId: this.tenantId,
          type: '',
          menuRoute: this.$route.name,
          account: JSON.parse(sessionStorage.getItem('loginData')).account
        })
        this.projectOption = res?.result ?? []
        this.projectCode = this.projectOption[0].code
        this.changePower('Personnel')
      },
      changePower() {
        // this.power = value
        let { permissions } = JSON.parse(sessionStorage.getItem('loginData'))
        let proJectRole = permissions.filter((item) => {
          return item.projectCode === this.projectCode
        })[0]?.permissionSet || []
        let findEle = proJectRole.findIndex((item) => {
          return item.frontRoute === 'Power' + value
        })
        if (findEle === -1) {
          this.permissionRole = false
        } else {
          this.permissionRole = true
        }
      },
      classChange(value) {
        return this.power === value ? 'powerList-item-change' : ''
      },
      changProjectCode() {
        this.changePower(this.power)
      }
    },
    components:{
      personel,
      role,
      permission
    },
  }
</script>

<style scoped="scoped">
  .power {
    padding: 20px 30px;
  }
  .projectHeader {
    display: inline-block;
    margin: 0px 0px 20px 0px;
  }
  .power-body {
    height: 785px;
    padding: 20px 0px;
    border: 1px solid black;
  }
  .powerList-item {
    display: inline-block;
    font-size: 16px;
    padding: 0px 20px;
    color: #7fbcff;
    cursor: pointer;
  }
  
  .powerList-item-change {
    color: #007aff;
  }
  
  .powerList-item-border {
    border-left: 1px solid #e4e4e4;
  }
  .powerList-item-word {
    margin-left: 10px;
  }
  .power-body-main {
    height: 650px;
  }
</style>
