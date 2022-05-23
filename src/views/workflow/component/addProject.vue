<template>
  <el-dialog
    :title="title"
    :visible="dialogVisible"
    width="35%"
    :before-close="handleClose" 
    custom-class="addProject">
    <div>
      <div class="from-item">
        <span>应用项目</span>
        <el-input v-model="projectCode" placeholder="请输入应用项目" :disabled="true"></el-input>
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
        <el-input v-model="postData.name" placeholder="请输入流程名称"></el-input>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="define()">下一步</el-button>
      <el-button @click="cancel()">取 消</el-button>

    </span>
  </el-dialog>
</template>

<script>
  export default {
    props:{
      projectCode: {
        type: String,
        default: ''
      },
      dialogVisible: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        postData: {
          ascription: this.projectCode,
          business: '',
          name: ''
        },
        options: this.$store.state.optionsBusiness,
        title: '新建工作流'
      }
    },
    mounted() {
    },
    methods:{
      handleClose() {
        this.$emit('close')
      },
      cancel() {
        this.$emit('close')
      },
      define() {
        if (this.postData.name) {
          if (this.postData.name.length > 2 ) {
            this.$emit('define', this.postData)
          } else{
            this.$message.warning('流程名称长度必须大于二')
          }
        } else {
          this.$message.warning('请填写流程名称')
        }
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
