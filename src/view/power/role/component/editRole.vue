<template>
  <el-dialog title="权限修改" :visible.sync="dialogVisible" width="60%" :before-close="handleClose">
    <div class="dialogTitle">
      <label>用户组</label>
      <el-input v-model="currentNodeName" placeholder="请输入内容" :disabled="true"></el-input>
      <el-button type="primary" plain @click="grant()" v-if="type !== 'edit'" style="float: right;">编辑</el-button>
    </div>
    <div class="dialogGroup">
      <label>用户组详情</label>
      <div class="userGroup">
        <div v-for="(item, index) in array1" :key="index" class="userGroup-item">{{ item.lastName }}</div>
      </div>
    </div>
    <div class="dialogMain">
      <div class="dialogMain-left">
        <div>权限库</div>
        <div class="left-group">
          <div class="RoleMain">
            <div v-for="(item, index) in roleList" :key="index" class="RoleList">
              <div>
                <label class="roleTitle">应用菜单权限</label><br>
                <el-checkbox :label="item.id" v-model="item.flag" :true-label="0" :false-label="1" @change="changeTitleFlag(item, $event)">{{ item.name }}</el-checkbox>
              </div>
              <div class="role-item">
                <label class="roleTitle">操作权限</label><br>
                <div v-for="(item1, index1) in item.children" :key="index1" style="display: inline-block;margin-right: 20px;">
                  <el-checkbox :label="item1.id" v-model="item1.flag" :true-label="0" :false-label="1" @change="changeFlag(item, item1, $event)">{{ item1.name }}</el-checkbox>
                  <div v-if="item1.children.length > 0" style="margin-top: 20px;margin-bottom: 20px;margin-left: 20px;">
                    <el-checkbox :label="item2.id" v-model="item2.flag" :true-label="0" v-for="(item2, index2) in item1.children"
                      :key="index2" :false-label="1" @change="changeChildrenFlag(item, item1, $event)">{{ item2.name }}</el-checkbox>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="dialogMain-right">
        <div>已选择权限</div>
        <div class="right-group">
          <div class="RoleMain">
            <div v-for="(item, index) in roleList" :key="index" class="RoleList" v-if="item.flag === 0">
              <div v-if="item.flag === 0">
                <label class="roleTitle">应用菜单权限</label><br>
                <el-checkbox :label="item.id" v-model="item.flag" :true-label="0" :false-label="1" @change="changeTitleFlag(item, $event)">{{ item.name }}</el-checkbox>
              </div>
              <div class="role-item">
                <label class="roleTitle">操作权限</label><br>
                <div v-for="(item1, index1) in item.children" :key="index1" style="display: inline-block;margin-right: 20px;">
                  <el-checkbox :label="item1.id" v-model="item1.flag" :true-label="0" :false-label="1" @change="changeFlag(item, item1, $event)"
                    v-if="item1.flag === 0">{{ item1.name }}</el-checkbox>
                  <div v-if="item1.children.length > 0" style="margin-top: 20px;margin-bottom: 20px;margin-left: 20px;">
                    <el-checkbox :label="item2.id" v-model="item2.flag" :true-label="0" v-for="(item2, index2) in item1.children"
                      :key="index2" v-if="item2.flag === 0" :false-label="1" @change="changeChildrenFlag(item, item1, $event)">{{ item2.name }}</el-checkbox>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer" v-if="type === 'edit'">
      <el-button type="primary" @click="handleClose">保存</el-button>
      <el-button @click="handleClose">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {
    postPersonUser
  } from '@/api/unit/api.js'
  export default {
    props: {
      dialogVisible: {
        type: Boolean,
        default: false
      },
      roleList: {
        type: Array,
        default: () => {
          []
        }
      },
      groupId: {
        type: String,
        default: ''
      },
      currentNodeName: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        array1: [],
        type: 'see'
      }
    },
    methods: {
      award() {
        let permission = {}
        let postArr = []
        let recursionItem = function(item, arr) {
          if (item.children.length === 0) {
            return
          } else {
            item.children.forEach((item1) => {
              if (item1.flag === 0) {
                arr.push(item1.permission)
              }
              recursionItem(item1)
            })
          }
        }
        this.roleList.forEach((item) => {
          permission[item.permissionType] = []
          if (item.flag === 0) {
            permission[item.permissionType].push(item.permission)
          }
          recursionItem(item, permission[item.permissionType])
        })
        postArr.push({
          code: projectCode[0].code,
          name: projectCode[0].name,
          type: projectCode[0].type,
          projectCode: projectCode[0].projectCode,
          tenantId: this.$store.state.tenantId,
          permission: permission
        })
        postMapping(postArr).then((res) => {
          this.$message.success('权限修改成功')
          this.$emit('handleClose')
        })
      },
      handleClose() {
        this.$emit('handleClose')
      },
      changeRole(code) {
        this.checkRole = code
      },
      grant() {
        this.type = 'edit'
      },
      getListData() {
        postPersonUser({
          groupId: this.groupId,
          tenantId: this.$store.state.tenantId,
          page: 0,
          limit: 0
        }).then((res) => {
          this.array1 = res.result.dataList
        })
      },
      changeFlag(item, item1, event) {
        if (event == 0) {
          item.flag = 0
        } else if (event == 1 && item1) {
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
    }
  }
</script>

<style scoped="scoped">
  .dialogTitle {
    padding-top: 0px;
    padding-bottom: 20px;
    color: black;
  }

  .dialogTitle /deep/ .el-input {
    width: 70%;
    margin-left: 150px;
  }

  .dialogGroup {
    padding-top: 20px;
    border-top: 1px solid #f5f5f5;
    color: black;
  }

  .userGroup {
    height: 200px;
    border: 1px solid #000000;
    padding: 20px 20px;
    margin-top: 20px;
  }

  .userGroup-item {
    width: 118px;
    height: 42px;
    display: inline-block;
    line-height: 42px;
    text-align: center;
    border: 1px solid #cccccc;
    margin-right: 20px;
  }

  .dialogMain {
    display: flex;
    margin-top: 20px;
    color: black;
  }

  .dialogMain-left {
    flex: 1;
    margin-right: 80px;
  }

  .left-group {
    width: 100%;
    height: 411px;
    border: 1px solid #000000;
    margin-top: 20px;
    padding: 10px 10px 0px 10px;
    overflow: auto;
    /* margin-right: 30px; */
  }

  .dialogMain-right {
    flex: 1;
  }

  .right-group {
    width: 100%;
    height: 411px;
    border: 1px solid #000000;
    margin-top: 20px;
    margin-left: 10px;
    padding: 10px 10px 0px 10px;
    overflow: auto;
  }

  .RoleList {
    margin-bottom: 20px;
    padding: 30px 20px;
    background-color: #f2f2f2;
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

  /deep/ .el-checkbox {
    margin-top: 20px;
  }
</style>
