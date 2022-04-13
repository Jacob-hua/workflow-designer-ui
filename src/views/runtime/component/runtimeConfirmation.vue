<template>
  <el-dialog title="流程挂起" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
    <div class="runtimeConfirmation">
      <div class="title">请输入账号密码进行校验，将此工作流程挂起</div>
      <el-form ref="form" :model="form" label-width="40px">
        <el-form-item label="账号">
          <el-input v-model="form.account"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleOK()">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data() {
      return {
        dialogVisible: false,
        form: {
          account: '',
          password: ''
        }
      }
    },
    methods: {
      handleClose() {
        
      },
      handleOK() {
        this.dialogVisible = false
        switch (this.$parent.functionCheck){
          case 'Hang':
            this.$parent.dataList[this.$parent.functionCheck] = !this.$parent.dataList[this.$parent.functionCheck]
            break;
          case 'reject':
            break;
          case 'termination':
            break;
          default:
            break;
        }
      }
    }
  }
</script>

<style scoped="scoped">
  .runtimeConfirmation {
    padding: 0px 40px;
  }
  .title {
    text-align: center;
    color: #ff3352;
    margin: 20px 0px;
  }
</style>
