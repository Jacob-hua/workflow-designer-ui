<template>
  <div class="PublicForm">
    <div class="PublicForm-title">
      <div class="datePick">
        <span class="datePickTitle">创建时间</span>
        <el-date-picker v-model="valueDate" type="daterange" align="right" unlink-panels range-separator="——"
          start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
      </div>
      <div class="PublicForm-title-input">
        <el-input v-model="input" placeholder="请输入内容"></el-input>
      </div>
      <div class="PublicForm-title-button">
        <el-button type="primary" @click="addForm()">新建表单</el-button>
      </div>
    </div>
    <div class="home-main">
      <div class="home-main-tab">
        <span class="home-main-tab-item" :class="activeName === 'first' ? 'active' : ''" @click="activeName = 'first'">工作流（15）</span>
        <span class="home-main-tab-item" :class="activeName === 'second' ? 'active' : ''" @click="activeName = 'second'">草稿箱（15）</span>
      </div>
      <div class="home-table">
        <div class="home-table-card" v-for="item in 10">
          <div class="card-title">
            <span class="title">NO.232132132</span>
            <span class="detailWord" @click="detailsDiolog()">详情</span>
          </div>
          <div class="card-main">
            <div class="card-main-item">
              <span class="label">表单名称:</span>
              <span class="value">工单创建表单</span>
            </div>
            <div class="card-main-item">
              <span class="label">创建人:</span>
              <span class="value">张三</span>
            </div>
            <div class="card-main-item">
              <span class="label">创建时间:</span>
              <span class="value">2021-11-12 14:11:23</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <PublicFormDiolog ref="PublicFormDiolog"></PublicFormDiolog>
    <detailsDiolog ref="detailsDiolog" @editForm="editForm"></detailsDiolog>
  </div>
</template>

<script>
  import PublicFormDiolog from './PublicFormComponent/index.vue'
  import detailsDiolog from './details.vue'
  export default {
    data() {
      return {
        valueDate: '',
        input: '',
        activeName: 'first'
      }
    },
    methods:{
      addForm() {
        this.$refs.PublicFormDiolog.dialogVisible2 = true
      },
      detailsDiolog() {
        this.$refs.detailsDiolog.dialogVisible2 = true
      },
      editForm() {
        this.addForm()
      }
    },
    components:{
      PublicFormDiolog,
      detailsDiolog
    }
  }
</script>

<style scoped="scoped">
  /deep/ .el-input__inner {
    border: 1px solid black;
  }
  .PublicForm-title {
    
  }
  .datePick {
    display: inline-block;
  }
  .datePickTitle {
    display: inline-block;
    font-size: 14px;
    margin-right: 20px;
  }
  .PublicForm-title-input {
    display: inline-block;
    margin-left: 40px;
  }
  .PublicForm-title-button {
    display: inline-block;
    margin-left: 40px;
    float: right;
  }
  .home-main {
    margin-top: 40px;
  }
  
  .home-main-tab {
    display: flex;
  }
  
  .home-main-tab-item {
    display: inline-block;
    height: 60px;
    width: 200px;
    line-height: 60px;
    text-align: center;
    font-size: 14px;
    cursor: pointer;
    border: 1px solid #cccccc;
  }
  
  .active {
    background-color: #030303;
    color: white;
  }
  
  .home-table {
    height: 786px;
    border: 1px solid #666666;
    margin-bottom: 40px;
    padding: 20px 20px;
  }
  
  .home-table-card {
    border: 1px solid #666666;
    min-height: 170px;
    display: inline-block;
    width: 334px;
    margin-right: 40px;
    margin-bottom: 40px;
  }
  .card-title {
    height: 30px;
    line-height: 30px;
    background-color: #e9e9e9;
    padding: 0px 20px;
  }
  .card-title .title {
    font-size: 14px;
  }
  .card-title .detailWord {
    float: right;
    color: #7b68cf;
    font-size: 14px;
    cursor: pointer;
  }
  .card-main {
    padding: 10px 10px;
  }
  .card-main-item {
    line-height: 40px;
    height: 40px;
    color: black;
    font-size: 14px;
  }
  .card-main-item .label {
    display: inline-block;
    width: 90px;
  }
</style>
