<template>
  <div class="configuration">
    <div class="home-main">
      <div class="home-main-tab">
        <span class="home-main-tab-item" :class="activeName === 'first' ? 'active' : ''" @click="changeActiveName('first')">访问配置</span>
        <span class="home-main-tab-item" :class="activeName === 'second' ? 'active' : ''" @click="changeActiveName('second')">业务配置</span>
        <span class="home-main-tab-item" :class="activeName === 'third' ? 'active' : ''" @click="changeActiveName('third')">启动项配置</span>
      </div>
      <el-button type="primary" class="buttonTab" v-if="activeName === 'first'" @click="showDiolog" v-role="{ id: 'VisitCallAdd', type: 'button', business: business }">新增第三方接口</el-button>
      <div class="home-table">
        <visitCall v-if="activeName === 'first' && permissionRole" ref="first" @editTable="editTable()" @deleteTable="deleteTable()"></visitCall>
        <businessCall v-if="activeName === 'second' && permissionRole" ref="second"></businessCall>
        <StartItemConfig v-if="activeName === 'third' && permissionRole" ref="third"  />
        <permission v-if="!permissionRole"></permission>
      </div>
    </div>

  </div>
</template>

<script>
  import visitCall from './visitCall/index.vue'
  import businessCall from './businessCall/index.vue'
  import StartItemConfig from "@/view/configuration/startItemConfig";
  import permission from '@/component/permission/index.vue'
  export default {
    data() {
      return {
        activeName: 'first',
        business: '',
        activeNameMapping: {
          first: 'VisitCall',
          second: 'BusinessCall',
          third: 'StartItemConfig'
        },
        permissionRole: true,
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
    created() {
      this.changeActiveName('first')
    },
    methods:{
      changeActiveName(value) {
        this.activeName = value
        let { permissions } = JSON.parse(sessionStorage.getItem('loginData'))
        let proJectRole = permissions.filter((item) => {
          // return item.projectCode === this.business
          return item.projectCode === 'XM_aff0659724a54c119ac857d4e560b47b'
        })[0].permissionSet
        let findEle = proJectRole.findIndex((item) => {
          return item.frontRoute === this.activeNameMapping[value]
        })
        if (findEle === -1) {
          this.permissionRole = false
        } else {
          this.permissionRole = true
        }
      },
      showDiolog() {
        this.$refs[this.activeName].$refs.guide.dialogVisible = true
        if (this.activeName === 'first') {
          this.$refs[this.activeName].$refs.guide.form = {
            source: '',
            sourceMark: ''
          }
        }
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
      businessCall,
      StartItemConfig,
      permission
    }
  }
</script>

<style scoped="scoped">
  
  .buttonTab {
    margin: 15px 0;
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
