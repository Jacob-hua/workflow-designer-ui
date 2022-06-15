<template>
  <div class="PublicForm">
    <div class="projectHeader">
      <el-select v-model="projectCode">
        <el-option v-for="{id, label, value} in rootOrganizations"
                   :key="id"
                   :label="label"
                   :value="value"></el-option>
      </el-select>
    </div>
    <div class="PublicForm-title">
      <div class="PublicForm-title-option">
        <el-cascader v-model="projectValue"
                     clearable
                     :key="projectCode"
                     :options="rootOrganizationChildren(projectCode)"
                     :props='cascaderProps'></el-cascader>
      </div>
      <div class="datePick">
        <span class="datePickTitle">编辑时间</span>
        <el-date-picker v-model="valueDate"
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
        <el-input v-model="input"
                  placeholder="请输入内容"></el-input>
      </div>
      <div class="PublicForm-title-input">
        <el-button type="primary"
                   @click="getManyData()">查询</el-button>
      </div>
      <div class="PublicForm-title-input">
        <el-button @click="onReset">重置</el-button>
      </div>
      <div class="PublicForm-title-button">
        <el-button type="primary"
                   @click="quoteBpmnShow()"
                   v-role="{ id: 'WorkflowUse', type: 'button', business: projectValue }">引用工作流</el-button>
      </div>
      <div class="PublicForm-title-button">
        <el-button type="primary"
                   @click="addProjectShow()"
                   v-role="{ id: 'WorkflowAdd', type: 'button', business: projectValue }">新建工作流</el-button>
      </div>
    </div>
    <div class="home-main">
      <div class="home-main-tab">
        <span class="home-main-tab-item"
              :class="activeName === 'enabled,disabled' ? 'active' : ''"
              @click="changeActiveName('enabled,disabled')">工作流({{ processCount }})</span>
        <span class="home-main-tab-item"
              :class="activeName === 'drafted' ? 'active' : ''"
              @click="changeActiveName('drafted')">草稿箱（{{ draftProcessCount }}）</span>
      </div>
      <div class="home-table">
        <projectTable v-if="activeName === 'enabled,disabled'"
                      ref="project"
                      :formListFirst="formListFirst"
                      :valueDate="valueDate"
                      :business="projectValue"
                      @lookBpmnShow="lookBpmnShow"
                      @deleteRow="onProjectDeleteRow"
                      @pageSizeChange="onProjectTableSizeChange"
                      @pageChange="onProjectTablePageChange"></projectTable>
        <draftTable v-if="activeName === 'drafted'"
                    ref="draft"
                    :formListSecond="formListSecond"
                    :valueDate="valueDate"
                    :business="projectValue"
                    @totalChange="totalChange"
                    @draftTableEdit="draftTableEdit"
                    @deleteRow="onDraftDeleteRow"
                    @pageSizeChange="onDraftTableSizeChange"
                    @pageChange="onDraftTablePageChange"></draftTable>
      </div>
    </div>
    <addProject ref="addpro"
                :dialogVisible="addProjectVisible"
                :projectOption="projectOption"
                @close="onAddProjectClose"
                @submit="onAddProjectSubmit"></addProject>
    <addBpmn v-if="addBpmnVisible"
             :formData="formData"
             :flag="flag"
             :currentRowData="currentRowData"
             :dialogVisible="addBpmnVisible"
             :xmlString="xmlString"
             @close="onAddBpmnClose"
             @submit="onAddBpmnSubmit"></addBpmn>
    <quoteBpmn v-if="quoteBpmnVisible"
               :valueDate="valueDate"
               :ascription="projectCode"
               :business="projectValue"
               :dialogVisible="quoteBpmnVisible"
               @close="quoteBpmnHidden()"
               @lookBpmnShow="lookBpmnShow"
               @addProjectShow="addProjectShow"></quoteBpmn>
    <lookBpmn v-if="lookBpmnVisible"
              :showFlag="showFlag"
              :business="projectValue"
              :isEdit="isEdit"
              :rowData="rowData"
              :dep="dep"
              ref="bpmn"
              :dialogVisible="lookBpmnVisible"
              @close="onLookBpmnClose"
              @edit="onLookBpmnEdit"
              @quote="addProjectShow()"></lookBpmn>
  </div>
</template>

<script>
import projectTable from './projectTable.vue'
import draftTable from './draftTable.vue'
import addProject from './addProject.vue'
import addBpmn from './addBpmn.vue'
import quoteBpmn from './quoteBpmn.vue'
import lookBpmn from './lookBpmn.vue'
import {
  workFlowRecord,
  designProcessCountStatistics,
} from '@/api/managerWorkflow'
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import { currentOneMonthAgo } from '@/util/date'

export default {
  components: {
    projectTable,
    draftTable,
    addProject,
    addBpmn,
    quoteBpmn,
    lookBpmn,
  },
  data() {
    const { start, end } = currentOneMonthAgo('yyyy-MM-DD HH:mm:ss')
    return {
      draftProcessCount: 0,
      processCount: 0,
      isEdit: true,
      dep: '',
      rowData: {},
      lookData: null,
      secondtTotal: 0,
      firstTotal: 0,
      projectValue: '',
      projectOption: [],
      formData: {},
      getData: {
        page: 1,
        limit: 10,
        total: 1,
      },
      currentRowData: {},
      addProjectVisible: false,
      addBpmnVisible: false,
      quoteBpmnVisible: false,
      lookBpmnVisible: false,
      dataType: 'enabled',
      projectCode: '',
      valueDate: [start, end],
      input: '',
      activeName: 'enabled,disabled',
      formListFirst: [],
      formListSecond: [],
      dialogVisible: false,
      xmlString: '',
      flag: false,
      toData: null,
      showFlag: true,
    }
  },
  computed: {
    ...mapState('account', ['tenantId', 'userInfo', 'currentOrganization']),
    ...mapState('uiConfig', ['cascaderProps']),
    ...mapGetters('config', ['rootOrganizations', 'rootOrganizationChildren']),
  },
  watch: {
    projectCode(value) {
      if (value === this.currentOrganization) {
        return
      }
      this.updateCurrentOrganization({ currentOrganization: value })
    },
    currentOrganization: {
      immediate: true,
      handler(value) {
        this.projectCode = value
      },
    },
  },
  mounted() {
    this.init()
  },
  methods: {
    ...mapActions('config', ['dispatchRefreshOrganization']),
    ...mapMutations('account', ['updateCurrentOrganization']),
    async init() {
      await this.dispatchRefreshOrganization()
      await this.refreshWorkFlowRecord()
    },
    totalChange(list) {
      this.formListSecond = list
    },
    addProjectShow(dep = '新建工作流', row) {
      this.toData = row
      this.$nextTick(() => {
        this.currentRowData = row
      })

      this.$refs.addpro.title = dep
      this.addProjectVisible = true
      this.$refs.addpro.postData = row || {}
    },
    onReset() {
      const { start, end } = currentOneMonthAgo('yyyy-MM-DD HH:mm:ss')
      this.input = ''
      this.valueDate = [start, end]
    },
    onAddProjectClose() {
      this.addProjectVisible = false
    },
    onAddProjectSubmit(value) {
      this.formData = value
      Object.keys(value).length ? (this.flag = true) : (this.flag = false)
      this.addProjectVisible = false
      this.addBpmnShow()
    },
    addBpmnShow() {
      this.xmlString = this.toData?.content || ''
      this.addBpmnVisible = true
    },
    onAddBpmnClose() {
      this.addBpmnVisible = false
    },
    onAddBpmnSubmit() {
      this.flag = false
      this.addBpmnVisible = false
      this.refreshWorkFlowRecord()
    },
    quoteBpmnShow() {
      this.quoteBpmnVisible = true
    },
    quoteBpmnHidden() {
      this.quoteBpmnVisible = false
    },
    lookBpmnShow(row, tit) {
      tit === 'gongzuoliu' ? (this.isEdit = true) : (this.isEdit = false)
      this.rowData = row
      if (tit === '引用') {
        this.showFlag = false
      }
      this.lookBpmnVisible = true
      this.currentRowData = row
      this.$nextTick(() => {
        this.$refs.bpmn.$refs.bpmnView.postData = row
        this.$refs.bpmn.$refs.bpmnView.showFlag = false
      })
    },
    onLookBpmnClose() {
      this.lookBpmnVisible = false
      this.currentRowData = {}
    },
    onLookBpmnEdit(row) {
      this.lookBpmnVisible = false
      this.xmlString = row.content
      this.currentRowData = row
      this.addBpmnVisible = true
    },
    draftTableEdit(row) {
      this.xmlString = row.content
      this.currentRowData = row
      this.addBpmnVisible = true
      this.flag = true
    },
    changeActiveName(value) {
      this.getData.page = 1
      this.activeName = value
      this.findWorkFlowRecord(value)
    },
    getManyData() {
      this.findWorkFlowRecord(this.activeName)
    },
    onProjectDeleteRow() {
      this.refreshWorkFlowRecord()
    },
    onProjectTableSizeChange(pageSize) {
      this.getData.limit = pageSize
      this.refreshWorkFlowRecord()
    },
    onProjectTablePageChange(page) {
      this.getData.page = page
      this.refreshWorkFlowRecord()
    },
    onDraftDeleteRow() {
      this.refreshWorkFlowRecord()
    },
    onDraftTableSizeChange(pageSize) {
      this.getData.limit = pageSize
      this.refreshWorkFlowRecord()
    },
    onDraftTablePageChange(page) {
      this.getData.page = page
      this.refreshWorkFlowRecord()
    },
    async refreshWorkFlowRecord() {
      await this.findWorkFlowRecord('enabled,disabled')
      await this.findWorkFlowRecord('drafted')
      await this.fetchDesignProcessCountStatistics()
    },
    // 查询项目流程
    async findWorkFlowRecord(status) {
      try {
        const { errorInfo, result } = await workFlowRecord({
          tenantId: this.tenantId,
          status,
          ascription: this.projectCode,
          business: this.projectValue,
          createBy: this.userInfo.account,
          name: this.input,
          startTime: this.valueDate[0],
          endTime: this.valueDate[1],
          page: this.getData.page,
          limit: this.getData.limit,
        })
        if (errorInfo.errorCode) {
          this.$message.error(errorInfo.errorMsg)
          return
        }

        if (status === 'drafted') {
          this.firstTotal = result.total
          this.$refs.draft.getData.total = result.total
          this.formListSecond = result.list
        } else {
          this.secondtTotal = result.total
          this.$refs.project.getData.total = result.total
          this.formListFirst = result.list
        }
      } catch (error) {}
    },
    async fetchDesignProcessCountStatistics() {
      try {
        const { errorInfo, result } = await designProcessCountStatistics({
          tenantId: this.tenantId,
          ascription: this.projectCode,
          business: this.projectValue,
          startTime: this.valueDate[0],
          endTime: this.valueDate[1],
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

<style scoped>
.projectHeader ::v-deep .el-input__inner {
  border: 1px solid black;
}

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
