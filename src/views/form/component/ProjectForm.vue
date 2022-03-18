<template>
  <div class="PublicForm">
    <div class="projectHeader">
      <el-select v-model="projectValue" placeholder="请选择">
        <el-option v-for="item in projectOption" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
    </div>
    <div class="projectList">
      <div class="projectList-item" :class="projectCode === 'beiqijia' ? 'checkPro' : '' " @click="changProjectCode('beiqijia')">
        <img src="@/assets/img/projectcccccc.svg" alt="" width="32px" height="32px" v-show="projectCode !== 'beiqijia'">
        <img src="@/assets/img/project0066cc.svg" alt="" width="32px" height="32px" v-show="projectCode == 'beiqijia'">
        <span class="projectList-item-word">北七家人才基地</span>
        <i class="el-icon-close item-icon"></i>
      </div>
      <div class="projectList-item" :class="projectCode === 'laiwu' ? 'checkPro' : '' " @click="changProjectCode('laiwu')">
        <img src="@/assets/img/projectcccccc.svg" alt="" width="32px" height="32px" v-show="projectCode !== 'laiwu'">
        <img src="@/assets/img/project0066cc.svg" alt="" width="32px" height="32px" v-show="projectCode == 'laiwu'">
        <span class="projectList-item-word">莱芜供热项目</span>
        <i class="el-icon-close item-icon"></i>
      </div>
      <div class="projectList-item" :class="projectCode === 'xilaideng' ? 'checkPro' : '' " @click="changProjectCode('xilaideng')">
        <img src="@/assets/img/projectcccccc.svg" alt="" width="32px" height="32px" v-show="projectCode !== 'xilaideng'">
        <img src="@/assets/img/project0066cc.svg" alt="" width="32px" height="32px" v-show="projectCode == 'xilaideng'">
        <span class="projectList-item-word">海口喜来登酒店</span>
        <i class="el-icon-close item-icon"></i>
      </div>
    </div>
    <div class="PublicForm-title">
      <div class="PublicForm-title-option">
        <el-select v-model="projectValue" placeholder="请选择">
          <el-option v-for="item in projectOption" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>
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
            <div class="card-main-item" v-if="activeName === 'first'">
              <span class="label">发布次数:</span>
              <span class="value">4</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <projectFormDiolog ref="projectFormDiolog"></projectFormDiolog>
    <detailsDiolog ref="detailsDiolog" @editForm="editForm" quote="delete"></detailsDiolog>
  </div>
</template>

<script>
  import projectFormDiolog from './projectFormComponent/index.vue'
  import detailsDiolog from './details.vue'
  export default {
    data() {
      return {
        projectValue: '',
        projectOption: [
          {
            value: '',
            label: '全部项目'
          },
          {
            value: '1',
            label: '智慧运维'
          },
          {
            value: '2',
            label: '资产管理'
          },
          {
            value: '3',
            label: '人员管理'
          },
          {
            value: '4',
            label: '其他业务'
          },
        ],
        projectCode: 'beiqijia',
        valueDate: '',
        input: '',
        activeName: 'first'
      }
    },
    methods: {
      changProjectCode(code) {
        this.projectCode = code
      },
      addForm() {
        this.$refs.projectFormDiolog.dialogVisible1 = true
      },
      detailsDiolog() {
        this.$refs.detailsDiolog.dialogVisible2 = true
      },
      editForm() {
        this.addForm()
      }
    },
    components:{
      projectFormDiolog,
      detailsDiolog
    }
  }
</script>

<style scoped="scoped">
  /deep/ .el-input__inner {
    border: 1px solid black;
  }

  .PublicForm-title {}

  .checkPro {
    border: 1px solid #0066cc !important;
  }

  .projectList {
    padding: 0px 0px 20px 0px;
    border-bottom: 1px solid #eeeeee;
    margin-bottom: 20px;
  }

  .projectList-item {
    position: relative;
    font-size: 18px;
    width: 260px;
    height: 100px;
    line-height: 100px;
    display: inline-block;
    border: 1px solid #cccccc;
    margin-right: 20px;
    padding: 0px 20px;
  }

  .projectList-item-word {
    vertical-align: super;
    display: inline-block;
    margin-left: 15px;
  }

  .item-icon {
    position: absolute;
    top: 20px;
    right: 20px;
  }

  .projectHeader {
    display: inline-block;
    margin: 0px 0px 20px 0px;
  }

  .datePick {
    display: inline-block;
  }

  .datePickTitle {
    display: inline-block;
    font-size: 14px;
    margin-right: 20px;
  }

  .PublicForm-title-option {
    display: inline-block;
    margin-right: 40px;
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
    margin-top: 20px;
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
