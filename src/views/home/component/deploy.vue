<template>
  <div>
    <el-dialog
      title="部署工作流"
      :visible.sync="dialogVisible1"
      width="35%"
      custom-class="dialogVisible1">
      <div>
        <div class="from-item">
          <span>应用项目</span>
          <el-input v-model="input" placeholder="请输入应用项目" :disabled="true"></el-input>
        </div>
        <div class="from-item">
          <span>流程类型</span>
          <el-input v-model="input" placeholder="请输入流程类型" :disabled="true"></el-input>
        </div>
        <div class="from-item">
          <span>能源系统</span>
          <el-select v-model="input" placeholder="请选择能源系统">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
        </div>
        <div class="from-item">
          <span>部署名称</span>
          <el-input v-model="input" placeholder="请输入部署名称"></el-input>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="nextDiolog()" type="primary">下一步</el-button>
        <el-button  @click="dialogVisible1 = false">取消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="部署工作流"
      :visible.sync="dialogVisible2"
      width="90%"
      custom-class="dialogVisible2">
      <div>
        
      </div>
      <div>
        
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible2 = false">部署</el-button>
        <el-button @click="dialogVisible2 = false">保存</el-button>
        <el-button @click="dialogVisible2 = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        dialogVisible1: false,
        dialogVisible2: false,
        input: '',
        options: []
      }
    },
    methods: {
      nextDiolog() {
        this.dialogVisible1 = false
        this.dialogVisible2 = true
      }
    }
  }
</script>

<style scoped="scoped">
  /deep/ .dialogVisible1 .el-dialog__body {
    padding: 16px 180px 0px 100px;
  }
  /deep/ .dialogVisible1 .el-dialog__header .el-dialog__title {
    font-size: 14px;
  }
  /deep/ .dialogVisible1 .el-dialog__header {
    background-color: #e4e4e4;
    border-bottom: 1px solid #000000;
  }
  /deep/ .dialogVisible2 .el-dialog__header .el-dialog__title {
    font-size: 14px;
  }
  /deep/ .dialogVisible2 .el-dialog__header {
    background-color: #e4e4e4;
    border-bottom: 1px solid #000000;
  }
  .from-item {
    display: flex;
    margin-bottom: 20px;
    text-align: center;
  }
  .from-item>span {
    width: 100px;
    height: 40px;
    line-height: 40px;
  }
  /deep/ .el-input__inner {
    color: black;
  }
  /deep/ .el-dialog__footer {
    text-align: center;
  }
</style>
