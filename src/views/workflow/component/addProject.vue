<template>
  <el-dialog
    title="提示"
    :visible="dialogVisible"
    width="35%"
    :before-close="handleClose" 
    custom-class="addProject">
    <div>
      <div class="from-item">
        <span>应用项目</span>
        <el-input v-model="postData.ascription" placeholder="请输入应用项目" :disabled="true"></el-input>
      </div>
      <div class="from-item">
        <span>流程类型</span>
        <el-select v-model="postData.business" placeholder="请选择流程类型">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="from-item">
        <span>流程名称</span>
        <el-input v-model="postData.name" placeholder="请输入部署名称"></el-input>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel()">取 消</el-button>
      <el-button type="primary" @click="define()">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    props:{
      dialogVisible: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        postData: {
          ascription: '',
          business: '',
          name: ''
        },
        options: []
      }
    },
    methods:{
      handleClose() {
        this.$emit('close')
      },
      cancel() {
        this.$emit('close')
      },
      define() {
        this.$emit('define', this.postData)
      }
    }
  }
</script>

<style scoped="scoped">
  /deep/ .addProject .el-dialog__body {
     padding: 16px 180px 0px 100px;
   }
   
   /deep/ .addProject .el-dialog__header .el-dialog__title {
     font-size: 14px;
   }
   
   /deep/ .addProject .el-dialog__header {
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
</style>
