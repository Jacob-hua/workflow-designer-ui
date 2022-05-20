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
        <div class="item1">
          <label>业务选择</label>
          <el-select v-model="value" placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <div>
        <label>当前角色</label>
        <div class="item2" v-for="(item, index) in detailData.currentGroup" :key="index">
          <el-input placeholder="请输入内容" v-model="input" :disabled="true">
          </el-input>
        </div>
        <!-- <div class="item2">
          <el-input placeholder="请输入内容" v-model="input" :disabled="true">
          </el-input>
        </div> -->
      </div>
    </div>
    <div class="dialogRole">
      <div class="peopleRole">
        <div class="peopleRole-item" @click="changeRole('guanli')" :class=" checkRole == 'guanli' ? 'checkRole' : ''">
          <span>运检部管理人员</span>
        </div>
        <div class="peopleRole-item" @click="changeRole('yunwei')" :class=" checkRole == 'yunwei' ? 'checkRole' : ''">
          <span>运检部运维员工</span>
        </div>
        <div class="peopleRole-item" @click="changeRole('geren')" :class=" checkRole == 'geren' ? 'checkRole' : ''">
          <span>个人权限</span>
        </div>
      </div>
    </div>
    <div class="RoleMain">
      <div v-for="(item, index) in roleList" :key="index" class="RoleList">
        <div>
          <label class="roleTitle">应用菜单权限</label>
          <el-checkbox-group v-model="item.checkList">
            <el-checkbox :label="item.menuCode">{{ item.menuName }}</el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="role-item">
          <label class="roleTitle">操作权限</label>
          <el-checkbox-group v-model="item.menuNameCheck">
            <el-checkbox :label="item1.roleCode" v-for="(item1, index1) in item.role" :key="index1">{{ item1.roleName }}</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer" v-if="type === 'edit'">
      <el-button type="primary" @click="handleClose">授予</el-button>
      <el-button @click="handleClose">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { getUserPermission } from '@/unit/api.js'
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
        checkRole: 'guanli',
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
      handleClose() {
        this.$emit('handleClose')
      },
      changeRole(code) {
        this.checkRole = code
      },
      grant() {
        this.type = 'edit'
      },
      getMapping(item) {
        getUserPermission({
          projectCode: item.groupList[0].id,
          tenantId: item.tenantList[0].id,
          userId: item.userId
        }).then((res) => {
           this.detailData = res.result
        })
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

  .item2 /deep/ .el-input {
    width: 220px;
    margin-left: 10px;
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
