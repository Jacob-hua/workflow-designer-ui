<template>
  <el-dialog title="权限授予" :visible.sync="dialogVisible" width="60%" :before-close="handleClose">
    <div class="dialogHeader">
      <span>人员信息</span>
      <el-button type="primary" plain>授权</el-button>
    </div>
    <div class="dialogPeople">
      <div>
        <div class="item">
          <label>姓名</label>
          <el-input placeholder="请输入内容" v-model="input" :disabled="true">
          </el-input>
        </div>
        <div class="item">
          <label>账号</label>
          <el-input placeholder="请输入内容" v-model="input" :disabled="true">
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
        <div class="item2">
          <label>当前角色</label>
          <el-input placeholder="请输入内容" v-model="input" :disabled="true">
          </el-input>
        </div>
        <div class="item2">
          <el-input placeholder="请输入内容" v-model="input" :disabled="true">
          </el-input>
        </div>
      </div>
    </div>
    <div class="dialogRole">
      <div class="peopleRole">
        <div class="peopleRole-item">
          <span>运检部管理人员</span>
        </div>
        <div class="peopleRole-item">
          <span>运检部运维员工</span>
        </div>
        <div class="peopleRole-item">
          <span>个人权限</span>
        </div>
      </div>
    </div>
    <div class="RoleMain">
      <div v-for="(item, index) in roleList" class="RoleList">
        <div>
          <label class="roleTitle">应用菜单权限</label>
          <el-checkbox-group v-model="item.checkList">
            <el-checkbox :label="item.menuCode">{{ item.menuName }}</el-checkbox>
          </el-checkbox-group>
        </div>
        <div></div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleClose">确 定</el-button>
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
        value: '',
        options: [],
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
  }

  .RoleMain {
    height: 400px;
    border: 1px solid #000000;
    padding: 20px;
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
</style>
