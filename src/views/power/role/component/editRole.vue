<template>
  <el-dialog title="权限修改" :visible.sync="dialogVisible" width="60%" :before-close="handleClose">
    <div class="dialogTitle">
      <label>用户组</label>
      <el-input v-model="input" placeholder="请输入内容"></el-input>
    </div>
    <div class="dialogGroup">
      <label>用户组详情</label>
      <div class="userGroup">
        <div v-for="(item, index) in array1" :key="index" class="userGroup-item">{{ item }}</div>
      </div>
    </div>
    <div class="dialogMain">
      <div class="dialogMain-left">
        <div>权限库</div>
        <div class="left-group">
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
        </div>
      </div>
      <div class="dialogMain-right">
        <div>已选择权限</div>
        <div class="right-group">
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
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleClose">保存</el-button>
      <el-button @click="handleClose">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    props: {
      dialogVisible: {
        type: String,
        default: false
      }
    },
    data() {
      return {
        input: '123',
        array1: ['张三', '昊昊', '大乔'],
        roleList: [
         {
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
        },
        {
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
        },
        {
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
        },
        {
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
        },
        {
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
        },
        ]
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
      }
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
</style>
