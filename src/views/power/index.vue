<template>
  <div class="power">
    <div class="projectHeader">
      <el-select v-model="projectCode" placeholder="请选择" @change="changProjectCode">
        <el-option v-for="item in $store.state.optionsAscription" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
    </div>
    <div class="power-body">
      <div class="power-body-header">
        <div class="powerList-item">
          <i class="el-icon-s-custom"></i>
          <span class="powerList-item-word" :class="classChange('Personnel')" @click="changePower('Personnel')">人员权限</span>
        </div>
        <div class="powerList-item powerList-item-border">
          <i class="el-icon-s-home"></i>
          <span class="powerList-item-word" :class="classChange('Role')" @click="changePower('Role')">角色权限</span>
        </div>
      </div>
      <div class="power-body-main">
        <personel v-if="power === 'Personnel' && permissionRole" :business="projectCode"></personel>
        <role v-if="power === 'Role' && permissionRole" :business="projectCode"></role>
        <permission v-if="!permissionRole"></permission>
      </div>
    </div>
  </div>
</template>

<script>
  import personel from './personnel/index.vue'
  import role from './role/index.vue'
  import permission from '@/components/permission/index.vue'
  export default {
    data() {
      return {
        projectCode: 'beiqijia',
        power: 'Personnel',
        permissionRole: true
      }
    },
    methods:{
      changePower(value) {
        this.power = value
        let { permissions } = JSON.parse(sessionStorage.getItem('loginData'))
        let proJectRole = permissions.filter((item) => {
          // return item.projectCode === this.business
          return item.projectCode === 'XM_aff0659724a54c119ac857d4e560b47b'
        })[0].permissionSet
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
        
      }
    },
    components:{
      personel,
      role,
      permission
    },
    created() {
      this.changePower('Personnel')
    }
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
