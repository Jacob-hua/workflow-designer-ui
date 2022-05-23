<template>
  <div class="PublicForm">
    <div class="PublicForm-title">
      <div class="datePick">
        <span class="datePickTitle">创建时间</span>
        <el-date-picker v-model="valueDate" type="daterange" align="right" unlink-panels range-separator="——"
          start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd">
        </el-date-picker>
      </div>
      <div class="PublicForm-title-input">
        <el-input v-model="input" placeholder="请输入内容"></el-input>
      </div>
      <div class="PublicForm-title-input">
        <el-button type="primary" @click="getManyData()">查询</el-button>
      </div>
      <div class="PublicForm-title-button">
        <el-button type="primary" @click="addBpmnShow()">新建工作流</el-button>
      </div>
    </div>
    <div class="home-main">
      <div class="home-main-tab">
        <span class="home-main-tab-item" :class="activeName === 'enabled,disabled' ? 'active' : ''" @click="changeActiveName('enabled,disabled')">工作流（{{ processCount }}）</span>
        <span class="home-main-tab-item" :class="activeName === 'drafted' ? 'active' : ''" @click="changeActiveName('drafted')">草稿箱（{{ draftProcessCount }}）</span>
      </div>
      <div class="home-table">
        <projectTable ref="project" :formListFirst="formListFirst" :valueDate="valueDate" :ascription="projectCode" :business ="projectValue" v-if="activeName === 'enabled,disabled'" @lookBpmnShow="lookBpmnShow"></projectTable>
        <draftTable ref="draft" :formListSecond = "formListSecond" @totalChange = "totalChange" :valueDate="valueDate" :ascription="projectCode" :business ="projectValue" v-if="activeName === 'drafted'" @draftTableEdit="draftTableEdit"></draftTable>
      </div>
    </div>
    <addProject :dialogVisible="addProjectVisible" @close="addProjectHidden()" @define="addProjectDefine"></addProject>
    <addBpmn  :currentRowData="currentRowData" :flag="flag" publick="publick" :dialogVisible="addBpmnVisible" @close="addBpmnHidden()" @define="addBpmnDefine" :xmlString="xmlString"></addBpmn>
    <quoteBpmn :dialogVisible="quoteBpmnVisible" @close="quoteBpmnHidden()" @lookBpmnShow="lookBpmnShow" @addProjectShow="addProjectShow"></quoteBpmn>
    <lookBpmn ref="bpmn" :rowData="rowData" v-if="lookBpmnVisible" :dialogVisible="lookBpmnVisible" @close="lookBpmnHidden()" @edit="lookBpmnEdit" @quote="quoteBpmnShow" valueType="public"></lookBpmn>
  </div>
</template>

<script>
import {
  designProcessCountStatistics,
  workFlowRecord
} from '@/api/managerWorkflow'
  import projectTable from './projectTable.vue'
  import draftTable from './draftTable.vue'
  import addProject from './addProject.vue'
  import addBpmn from './addBpmn.vue'
  import quoteBpmn from './quoteBpmn.vue'
  import lookBpmn from './lookBpmn.vue'
  import bpmnData from "@/assets/js/bpmnMock.js"
  export default {
    data() {
      return {
        formSecondTotal:'',
        formFirstTotal: '',
        flag: true,
        rowData: '',
        projectValue: '',
        projectOption: [
          {
            value: '',
            label: '全部项目'
          }
        ],
        getData: {
          page: 1,
          limit: 10,
          total: 1
        },
        currentRowData: {},
        dataType: 'enabled',
        projectCode: 'beiqijia',
        valueDate: [],
        input: '',
        activeName: 'drafted',
        formListFirst: [],
        formListSecond: [],
        dialogVisible: false,
        addProjectVisible: false,
        addBpmnVisible: false,
        quoteBpmnVisible: false,
        lookBpmnVisible: false,
        draftProcessCount: 0,
        processCount: 0
      }
    },
    methods: {
      totalChange(list) {
        this.formListSecond = list
      },
      addBpmnShow() {
        this.xmlString = ""
        this.addBpmnVisible = true
        this.flag = true
      },
      addBpmnHidden() {
        this.addBpmnVisible = false
      },
      addBpmnDefine(value) {
        this.addBpmnVisible = false
      },
      
      quoteBpmnShow() {
        this.quoteBpmnVisible = true
      },
      quoteBpmnHidden() {
        this.quoteBpmnVisible = false
      },
      
      lookBpmnShow(row) {
        this.lookBpmnVisible = true
        this.rowData = row
        this.$nextTick(() => {
          this.$refs.bpmn.currentRowData = row
          this.$refs.bpmn.$refs.bpmnView.postData = row
        })
        // this.xmlString = row.content
      },
      lookBpmnHidden() {
        this.lookBpmnVisible = false
      },
      
      lookBpmnEdit(row) {
        this.lookBpmnVisible = false
        this.xmlString = row.content
        this.addBpmnVisible = true
      },
      
      draftTableEdit(row) {
        this.xmlString = row.content
        this.currentRowData = row
        this.addBpmnVisible = true

      },
      
      changeActiveName(value) {
        this.activeName = value
        this.findWorkFlowRecord(value)
      },
      
      // 查询草稿箱
      getDraftData() {
        postFormDesignRecordDraftInfo({
          tenantId: this.$store.state.tenantId,
          status: 'drafted',
          ascription: this.projectCode,
          business: this.projectValue,
          createBy: this.$store.state.userInfo.name,
          numberCode: '',
          name: this.input,
          startTime: this.valueDate[0]? `${this.valueDate[0]} 00:00:00` || '' : '',
          endTime: this.valueDate[1]? `${this.valueDate[1]} 23:59:59` || '' : '' ,
        }).then((res) => {
          this.formListSecond = res.result
        })
      },
      // 查询可部署流程
      getEnableData() {
        postFormDesignBasicFormRecord({
          tenantId: this.$store.state.tenantId,
          status: 'enabled',
          ascription: this.projectCode,
          business: this.projectValue,
          createBy: this.$store.state.userInfo.name,
          numberCode: '',
          name: this.input,
          startTime: this.valueDate[0]? `${this.valueDate[0]} 00:00:00` || '' : '',
          endTime: this.valueDate[1]? `${this.valueDate[1]} 23:59:59` || '' : '' ,
        }).then((res) => {
          this.formListFirst = res.result
        })
      },
      
      getManyData() {
        // this.getEnableData()
        // this.getDraftData()
        this.findWorkFlowRecord()
      },
      // 查询公共流程工作流记录
      async findWorkFlowRecord (status = 'drafted' ) {
        let data = await workFlowRecord({
          tenantId: this.$store.state.tenantId || null,
          status,
          ascription: 'public' || '',
          business: this.projectValue || '',
          createBy: 'admin' || '',
          numberCode: '',
          name: this.input,
          startTime: this.valueDate[0]? `${this.valueDate[0]} 00:00:00` || '' : '',
          endTime: this.valueDate[1]? `${this.valueDate[1]} 23:59:59` || '' : '' ,
          page: this.getData.page,
          limit: this.getData.limit
        })
        status === 'drafted'?
            (this.formListSecond = data.result.list,
                this.$refs.draft.getData.total = data.result.total,
            this.formSecondTotal= data.result.total)
            :
            (
                this.formListFirst = data.result.list,
                    this.$refs.project.getData.total = data.result.total,
                    this.formFirstTotal = data.result.total

            )
      }
    },
    mounted() {
      designProcessCountStatistics({
        tenantId: this.$store.state.tenantId,
        ascription: 'public',
        business: this.projectValue,
        startTime: this.valueDate[0],
        endTime: this.valueDate[1]
      }).then(res => {
        this.draftProcessCount = res.result.draftProcessCount
        this.processCount = res.result.processCount
        console.log(res)
      })
        this.findWorkFlowRecord()
    },
    components:{
      projectTable,
      draftTable,
      addBpmn,
      quoteBpmn,
      lookBpmn,
      addProject
    }
  }
</script>

<style scoped="scoped">
  .PublicForm-title /deep/ .el-input__inner {
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
  
  .home-table-main {
    padding: 10px;
    border: 1px solid #666666;
  }
  
  .fileStyle {
    color: #007edb;
  }
  
  /deep/ .el-table .el-table__cell {
    padding: 8px 0px;
  }
  
  /deep/ .el-table th.el-table__cell {
    padding: 16px 0px;
    background-color: #f5f7f9;
  }
  .home-table-page {
    text-align: right;
    padding: 20px 0px;
  }
  .button1 {
    margin-right: 50px;
  }
</style>
