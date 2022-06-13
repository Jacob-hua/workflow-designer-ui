<template>
  <div class="personnel">
    <div class="personnel-left">
      <div class="personnel-header">
        <i class="el-icon-share"></i>
        <span class="personnel-header-word">组织结构</span>
      </div>
      <div class="personnel-left-tree">
        <PeTree :data="data" :currentNodeKey="currentNodeKey" @nodeClick="getRole"></PeTree>
      </div>
    </div>
    <div class="personnel-right">
      <div class="personnel-header padding20">
        <i class="el-icon-share"></i>
        <span class="personnel-header-word">权限详情</span>
        <div class="personnel-header-button">
          <el-button type="primary" plain icon="el-icon-search" @click="seeHandle()" v-role="{ id: 'PowerLook', type: 'button', business: business }">查看</el-button>
          <el-button type="primary" plain icon="el-icon-s-finance" @click="editHandle()" v-role="{ id: 'PowerLook', type: 'button', business: business }">编辑</el-button>
        </div>
      </div>
      <div class="personnel-right-main">
        <div class="RoleMain">
          <div v-for="(item, index) in roleList" :key="index" class="RoleList">
            <div>
              <label class="roleTitle">应用菜单权限</label><br>
              <el-checkbox :label="item.id" :disabled="true" v-model="item.flag" :true-label="0" :false-label="1" @change="changeTitleFlag(item, $event)">{{ item.name }}</el-checkbox>
            </div>
            <div class="role-item">
              <label class="roleTitle">操作权限</label><br>
              <div v-for="(item1, index1) in item.children" :key="index1" style="display: inline-block;margin-right: 20px;">
                <el-checkbox :label="item1.id" v-model="item1.flag" :true-label="0" :false-label="1" :disabled="true" @change="changeFlag(item, item1, $event)">{{ item1.name }}</el-checkbox>
                <div v-if="item1.children.length > 0" style="margin-top: 20px;margin-bottom: 20px;margin-left: 20px;">
                  <el-checkbox :label="item2.id" v-model="item2.flag" :true-label="0" v-for="(item2, index2) in item1.children" :key="index2" :false-label="1" :disabled="true" @change="changeChildrenFlag(item, item1, $event)">{{ item2.name }}</el-checkbox>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <editRole :dialogVisible="dialogVisible" @handleClose="handleClose" :roleList="roleList" :groupId="currentNodeKey" :currentNodeName="currentNodeName" ref="editRole"></editRole>
  </div>
</template>

<script>
  import PeTree from '@/component/PeTree.vue'
  import editRole from './component/editRole.vue'
  import { getSystemGroupTree, getGroupPermission } from '@/api/unit/api.js'
  export default {
    props:{
      business: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        dialogVisible: false,
        data: [],
        currentNodeKey: '',
        currentNodeName: '',
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        roleList: []
      }
    },
    methods: {
      handleClose() {
        this.getRole({
          groupId: this.currentNodeKey,
          groupName: this.currentNodeName
        })
        this.dialogVisible = false
      },
      seeHandle() {
        this.dialogVisible = true
        this.$nextTick(() => {
          this.$refs.editRole.type = 'see'
          this.$refs.editRole.getListData()
        })
      },
      editHandle() {
        this.dialogVisible = true
        this.$nextTick(() => {
          this.$refs.editRole.type = 'edit'
          this.$refs.editRole.getListData()
        })
      },
      getTree() {
        getSystemGroupTree({
          projectCode: this.business,
          displayType: 'tree'
        }).then((res) => {
          this.data = res.result
          if (res.result[0]) {
            this.getRole(res.result[0])
          } else {
            this.roleList = []
          }
        })
      },
      getRole(result) {
        this.currentNodeKey = result.groupId
        this.currentNodeName = result.groupName
        getGroupPermission({
          groupCode: result.groupId,
          projectCode: this.business,
          tenantId: this.$store.state.tenantId
        }).then((res) => {
          this.roleList = res.result
        })
      },
      changeFlag(item, item1, event) {
        if (event == 0) {
          item.flag = 0
        } else if(event == 1 && item1) {
          if (item1.children.length > 0) {
            item1.children.forEach((item2) => {
              item2.flag = 1
            })
          }
        }
        this.$forceUpdate()
      },
      changeChildrenFlag(item, item1, event) {
        if (event == 0) {
          item.flag = 0
          item1.flag = 0
        }
      },
      changeTitleFlag(item, event) {
        if (event == 1) {
          item.children.forEach((item1) => {
            item1.flag = 1
            if (item1.children.length > 0) {
              item1.children.forEach((item2) => {
                item2.flag = 1
              })
            }
          })
          this.$forceUpdate()
        }
      },
    },
    components: {
      PeTree,
      editRole
    },
    watch:{
      business: {
        handler() {
          this.getTree()
        },
        immediate: true
      }
    }
  }
</script>

<style scoped="scoped">
  .personnel {
    display: flex;
    margin-left: 20px;
    margin-top: 30px;
  }

  .personnel-left {
    padding-left: 20px;
    padding-right: 20px;
    height: 650px;
    flex: 4;
    border: 1px solid #cccccc;
  }

  .personnel-header {
    line-height: 60px;
    font-size: 16px;
    border-bottom: 1px solid #CCCCCC;
    color: black;
  }

  .personnel-header-word {
    margin-left: 20px;
  }

  .personnel-right {
    flex: 6;
    /* padding-left: 20px; */
    /* padding-right: 20px; */
    border: 1px solid #cccccc;
    margin-left: 40px;
    margin-right: 40px;
  }
  
  .padding20 {
    padding: 0px 20px;
  }
  
  .personnel-header-button {
    float: right;
  }
  
  .personnel-right-main {
    padding: 20px 20px;
    height: 588px;
    overflow: auto;
  }
  
  .RoleList {
    margin-bottom: 20px;
    padding: 30px 20px;
    /* background-color: #f2f2f2; */
    border: 1px solid #7fbcff;
  }
  .RoleList .el-checkbox__input {
    position: absolute;
    left: 110px;
  }
  .roleTitle {
    color: #0066cc;
    font-weight: 700;
    margin-bottom: 20px;
    display: inline-block;
  }
  .role-item {
    border-top: 1px solid #d6d6d6;
    margin-top: 20px;
    padding-top: 15px;
  }
</style>
