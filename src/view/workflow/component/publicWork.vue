<template>
  <div class="PublicForm">
    <div class="PublicForm-title">
      <div class="datePick">
        <span class="datePickTitle">编辑时间</span>
        <el-date-picker v-model="searchForm.valueDate"
                        type="daterange"
                        align="right"
                        unlink-panels
                        range-separator="——"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        :default-time="['00:00:00', '23:59:59']">
        </el-date-picker>
      </div>
      <div class="PublicForm-title-input">
        <el-input v-model="searchForm.name"
                  placeholder="请输入工作流名称"></el-input>
      </div>
      <div class="PublicForm-title-input">
        <el-button type="primary"
                   @click="refreshWorkFlowRecord">查询</el-button>
      </div>
      <div class="PublicForm-title-input">
        <el-button type="primary" 
                   @click="onReset">重置</el-button>
      </div>
      <div class="PublicForm-title-button">
        <el-button type="primary"
                   @click="onAddBpmnShow">新建工作流</el-button>
      </div>
    </div>
    <div class="home-main">
      <div class="home-main-tab">
        <span class="home-main-tab-item"
              :class="activeName === 'enabled,disabled' ? 'active' : ''"
              @click="onChangeActiveName('enabled,disabled')">工作流（{{ processCount }}）</span>
        <span class="home-main-tab-item"
              :class="activeName === 'drafted' ? 'active' : ''"
              @click="onChangeActiveName('drafted')">草稿箱（{{ draftProcessCount }}）</span>
      </div>
      <div class="home-table">
        <projectTable v-if="activeName === 'enabled,disabled'"
                      :business="projectValue"
                      :searchForm="searchFormData"
                      @lookBpmnShow="onLookBpmnShow"
                      @deleteRow="onProjectDeleteRow"></projectTable>
        <draftTable v-if="activeName === 'drafted'"
                    :business="projectValue"
                    :searchForm="searchFormData"
                    @draftTableEdit="onDraftTableEdit"
                    @deleteRow="onDraftDeleteRow"></draftTable>
      </div>
    </div>
    <addBpmn publick="publick"
             :visible="addBpmnVisible"
             :projectData="projectData"
             @close="onAddBpmnClose"
             @submit="onAddBpmnSubmit"></addBpmn>
    <lookBpmn v-if="lookBpmnVisible"
              valueType="public"
              :projectData="projectData"
              :dialogVisible="lookBpmnVisible"
              @close="onLookBpmnClose"
              @edit="onLookBpmnEdit"></lookBpmn>
  </div>
</template>

<script>
import projectTable from './projectTable.vue'
import draftTable from './draftTable.vue'
import addProject from './addProject.vue'
import addBpmn from './addBpmn.vue'
import lookBpmn from './lookBpmn.vue'
import { designProcessCountStatistics } from '@/api/managerWorkflow'
import { mapState } from 'vuex'
import { currentOneMonthAgo } from '@/util/date'

export default {
  components: {
    projectTable,
    draftTable,
    addBpmn,
    lookBpmn,
    addProject,
  },
  data() {
    const { start, end } = currentOneMonthAgo('yyyy-MM-DD HH:mm:ss')
    return {
      searchForm: {
        ascription: 'public',
        valueDate: [start, end],
        name: '',
      },
      searchFormData: {},
      projectValue: '',
      projectData: {},
      activeName: 'enabled,disabled',
      addBpmnVisible: false,
      lookBpmnVisible: false,
      dialogVisible: false,
      draftProcessCount: 0,
      processCount: 0,
    }
  },
  computed: {
    ...mapState('account', ['tenantId', 'userInfo']),
  },
  mounted() {
    this.refreshWorkFlowRecord()
  },
  methods: {
    onAddBpmnShow() {
      this.addBpmnVisible = true
      this.projectData = {}
    },
    onReset() {
      const { start, end } = currentOneMonthAgo('yyyy-MM-DD HH:mm:ss')
      this.searchForm = {
        ...this.searchForm,
        valueDate: [start, end],
        name: '',
      }
      this.refreshWorkFlowRecord()
    },
    onAddBpmnClose() {
      this.addBpmnVisible = false
      this.projectData = {}
    },
    onAddBpmnSubmit() {
      this.addBpmnVisible = false
      this.projectData = {}
      this.refreshWorkFlowRecord()
    },
    onLookBpmnShow(row, tit) {
      this.projectData = { ...row }
      this.lookBpmnVisible = true
    },
    onLookBpmnClose() {
      this.lookBpmnVisible = false
      this.projectData = {}
      this.refreshWorkFlowRecord()
    },
    onLookBpmnEdit(row) {
      this.lookBpmnVisible = false
      this.projectData = { ...row }
      this.addBpmnVisible = true
    },
    onDraftTableEdit(row) {
      this.projectData = { ...row }
      this.addBpmnVisible = true
    },
    onChangeActiveName(value) {
      this.activeName = value
      this.refreshWorkFlowRecord()
    },
    onProjectDeleteRow() {
      this.fetchDesignProcessCountStatistics()
    },
    onDraftDeleteRow() {
      this.fetchDesignProcessCountStatistics()
    },
    async refreshWorkFlowRecord() {
      await this.fetchDesignProcessCountStatistics()
      this.searchFormData = {
        ...this.searchForm,
        startTime: this.searchForm.valueDate[0],
        endTime: this.searchForm.valueDate[1],
      }
    },
    async fetchDesignProcessCountStatistics() {
      try {
        const { errorInfo, result } = await designProcessCountStatistics({
          tenantId: this.tenantId,
          ascription: 'public',
          startTime: this.searchForm.valueDate[0],
          endTime: this.searchForm.valueDate[1],
          createBy: this.userInfo.account,
        })
        if (errorInfo.errorCode) {
          this.$message.error(errorInfo.errorMsg)
          return
        }

        this.draftProcessCount = result.draftProcessCount
        this.processCount = result.processCount
      } catch (error) {}
    },
  },
}
</script>

<style scoped="scoped">
.PublicForm-title ::v-deep .el-input__inner {
  border: 1px solid black;
}

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

::v-deep .el-table .el-table__cell {
  padding: 8px 0px;
}

::v-deep .el-table th.el-table__cell {
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
