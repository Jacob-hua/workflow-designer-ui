<template>
  <div>
    <el-dialog title="部署工作流" :visible.sync="dialogVisible2" width="90%" custom-class="dialogVisible2">
      <div class="dialogVisible2-main">
        <div class="form-title">
          <div class="title-item">
            <span class="title-item-label">
              表单编码
            </span>
            <div class="title-item-main">
              <el-input v-model="postData.code" placeholder="" :disabled="true"></el-input>
            </div>
          </div>
          <div class="title-item">
            <span class="title-item-label marginLeft40">
              表单名称
            </span>
            <div class="title-item-main">
              <el-input v-model="postData.time" placeholder="" :disabled="true"></el-input>
            </div>
          </div>
        </div>
        <div class="form-Main">
            <formbpmn></formbpmn>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible2 = false">发布</el-button>
        <el-button @click="dialogVisible2 = false">保存</el-button>
        <el-button @click="dialogVisible2 = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import formbpmn from '../formBpmn.vue'
  import {
    FormEditor
  } from '@bpmn-io/form-js-editor';
  export default {
    data() {
      return {
        dialogVisible2: false,
        input: '',
        options: [],
        postData: {
          code: '21321323',
          name: '巡视工作流',
          edition: 'V1.0',
          time: '分配工单表单',
          project: '北七家项目',
          type: '智慧运维',
          system: '配电'
        },
        formEditor: null,
        schema: {
          schemaVersion: 1,
          type: "default",
          exporter: {
            name: "form-js",
            version: "0.7.0"
          }
        }
      }
    },
    methods:{
      nextDiolog() {
        this.dialogVisible2 = true
      },
    },
    components:{
      formbpmn
    }
  }
</script>

<style scoped="scoped">
/*  /deep/ .dialogVisible2 .el-dialog__body {
    padding: 16px 180px 0px 100px;
  } */
  
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
  
  .form-title {
    border-bottom: 1px solid #CCCCCC;
    margin-bottom: 40px;
  }
  .title-item {
    display: inline-block;
    margin-bottom: 20px;
  }
  .title-item-label {
    margin-right: 15px;
  }
  .title-item-main {
    display: inline-block;
  }
  /deep/ .dialogVisible2 .el-input.is-disabled .el-input__inner {
    color: black;
    width: 180px;
    height: 43px;
    line-height: 43px;
    padding: 0px 10px;
    background-color: #f2f2f2;
  }
  /deep/ .dialogVisible2 .el-input__inner {
    width: 180px;
    height: 43px;
    line-height: 43px;
    padding: 0px 10px;
    background-color: #f2f2f2;
  }
  .marginLeft40 {
    margin-left: 70px;
  }
  .form-Main {
    height: 630px;
  }
  
  #form {
    height: 100%;
    background-color: aliceblue;
  }
</style>
