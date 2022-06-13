<template>
  <el-dialog title="权限授予" :visible.sync="dialogVisible" width="60%" :before-close="handleClose">
    <div class="dialogHeader">
      <span>人员信息</span>
      <el-button type="primary" plain @click="grant()" v-if="type !== 'edit'">授权</el-button>
    </div>
    <div class="dialogPeople">
      <div>
        <div class="item">
          <label>姓名</label>
          <el-input placeholder="请输入内容" v-model="detailData.name" :disabled="true">
          </el-input>
        </div>
        <div class="item">
          <label>账号</label>
          <el-input placeholder="请输入内容" v-model="detailData.id" :disabled="true">
          </el-input>
        </div>
      </div>
      <div>
<!--        <div class="item1">-->
<!--          <label>业务选择</label>-->
<!--          <el-select v-model="value" placeholder="请选择">-->
<!--            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">-->
<!--            </el-option>-->
<!--          </el-select>-->
<!--        </div>-->
      </div>
      <div>
        <label>当前角色</label>
        <div class="item2" v-for="(item, index) in detailData.currentGroup" :key="index">
          <span class="UserItem">{{ item }}</span>
        </div>
        <!-- <div class="item2">
          <el-input placeholder="请输入内容" v-model="input" :disabled="true">
          </el-input>
        </div> -->
      </div>
    </div>
    <div class="dialogRole">
      <div class="peopleRole">
        <div class="peopleRole-item" @click="changeRole(key)" :class=" checkRole == key ? 'checkRole' : ''" v-for="(item, key) in detailData.map">
          <span>{{ key }}</span>
        </div>
      </div>
    </div>
    <div class="RoleMain">
      <div v-for="(item, index) in detailData.map[checkRole]" :key="index" class="RoleList">
        <div>
          <label class="roleTitle">应用菜单权限</label><br>
          <el-checkbox :label="item.id" v-model="item.flag" :disabled="detailData.roleList[detailData.roleList.length - 1].name !== checkRole || type !== 'edit'"
            :true-label="0" :false-label="1" @change="changeTitleFlag(item, $event)">{{ item.name }}</el-checkbox>
        </div>
        <div class="role-item">
          <label class="roleTitle">操作权限</label><br>
          <div v-for="(item1, index1) in item.children" :key="index1" style="display: inline-block;margin-right: 20px;">
            <el-checkbox :label="item1.id" v-model="item1.flag" :disabled="detailData.roleList[detailData.roleList.length - 1].name !== checkRole || type !=='edit'"
              :true-label="0" :false-label="1" @change="changeFlag(item, item1, $event)">{{ item1.name }}</el-checkbox>
            <div v-if="item1.children.length > 0" style="margin-top: 20px;margin-bottom: 20px;margin-left: 20px;">
              <el-checkbox :label="item2.id" v-model="item2.flag" :disabled="detailData.roleList[detailData.roleList.length - 1].name !== checkRole || type !== 'edit'"
                :true-label="0" v-for="(item2, index2) in item1.children" :key="index2" :false-label="1" @change="changeChildrenFlag(item, item1, $event)">{{ item2.name }}</el-checkbox>
            </div>
          </div>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer" v-if="type === 'edit'">
      <el-button type="primary" @click="award">授予</el-button>
      <el-button @click="handleClose">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {
    getUserPermission,
    postMapping,
    userLogin
  } from '@/api/unit/api.js'
  export default {
    props: {
      dialogVisible: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        detailData: {
          id: '',
          name: '',
          currentGroup: [],
          map: []
        },
        input: '123',
        value: '',
        type: 'see',
        options: [],
        checkRole: '',
        menuNameCheck: [],
        checkList: [],
        disabledChange: true,
        roleList: [{
          menuName: '工作流管理',
          menuCode: 'gongzuoliu',
          checkList: [],
          menuNameCheck: [],
          role: [{
              roleName: '查看',
              roleCode: 'chakan'
            },
            {
              roleName: '下装工作流',
              roleCode: 'xiazhuang'
            },
            {
              roleName: '新建工作流',
              roleCode: 'xinjian'
            },
            {
              roleName: '编辑工作流',
              roleCode: 'bianji'
            },
          ]
        }]
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
              recursionItem(item1, arr)
            })
          }
        }
        Object.keys(this.detailData.map).forEach((mapName, index) => {
          if (index === Object.keys(this.detailData.map).length - 1) {
            this.detailData.map[mapName].forEach((item) => {
              permission[item.permissionType] = []
              if (item.flag === 0) {
                permission[item.permissionType].push(item.permission)
              }
              recursionItem(item, permission[item.permissionType])
            })
            let projectCode = this.detailData.roleList.filter((item) => {
              return item.name === mapName
            })
            postArr.push({
              code: projectCode[0].code,
              name: projectCode[0].name,
              type: projectCode[0].type,
              projectCode: projectCode[0].projectCode,
              tenantId: this.$store.state.tenantId,
              permission: permission
            })
          }
        })
        postMapping(postArr).then((res) => {
          this.$message.success('权限修改成功')
          this.login()
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
      getMapping(item) {
        getUserPermission({
          projectCode: item.groupList[0].id.split(':')[0],
          tenantId: item.tenantList[0].id,
          userId: item.userId
        }).then((res) => {
          this.detailData = res.result
          this.checkRole = Object.keys(this.detailData.map)[0]
        })
      },
      login() {
        if (this.$store.state.userInfo.name === 'admin') {
          userLogin({
            account: 'admin',
            password: 'admin'
          }).then((res) => {
            sessionStorage.setItem('loginData', JSON.stringify(res.result))
            this.$store.state.userInfo.name = res.result.account
          })
        }
      }
    }
  }
</script>

<style scoped="scoped">
  .dialogHeader {
    border-left: 3px solid #108cee;
    padding-left: 20px;
  }

  .dialogHeader /deep/ .el-button {
    float: right;
    padding: 10px 30px;
  }

  .dialogPeople {
    margin-top: 20px;
  }

  .dialogPeople .item {
    display: inline-block;
    width: 400px;
  }

  .item /deep/ .el-input {
    width: 220px;
    margin-left: 38px;
  }

  .dialogPeople .item1 {
    display: inline-block;
    width: 500px;
    margin-top: 30px;
  }

  .item1 /deep/ .el-select {
    width: 220px;
    margin-left: 10px;
  }

  .dialogPeople .item2 {
    display: inline-block;
    width: 300px;
    margin-top: 30px;
  }

  .item2 .UserItem {
    width: 220px;
    margin-left: 10px;
    height: 40px;
    background-color: #F5F7FA;
    border: 1px solid;
    border-color: #E4E7ED;
    cursor: not-allowed;
    border-radius: 4px;
    display: inline-block;
    line-height: 40px;
    padding: 0px 15px;
    color: #999999;
  }

  .peopleRole {
    margin-top: 30px;
    border-top: 1px solid #f5f5f5;
    padding-top: 20px;
    display: flex;
  }

  .peopleRole-item {
    width: 120px;
    height: 40px;
    line-height: 40px;
    border: 1px solid #000000;
    text-align: center;
    cursor: pointer;
  }

  .RoleMain {
    height: 400px;
    border: 1px solid #000000;
    padding: 20px;
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

  .checkRole {
    background-color: #0368cd;
    color: white;
  }
</style>
