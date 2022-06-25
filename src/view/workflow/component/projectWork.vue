<template>
  <div class="PublicForm">
    <div class="projectHeader">
      <el-select v-model="searchForm.ascription">
        <el-option
          v-for="{ id, label, value } in rootOrganizations"
          :key="id"
          :label="label"
          :value="value"
        ></el-option>
      </el-select>
    </div>
    <div class="PublicForm-title">
      <div class="PublicForm-title-option">
        <el-cascader
          v-model="searchForm.business"
          :key="searchForm.ascription"
          :options="rootOrganizationChildrenAndAll(searchForm.ascription)"
          :props="cascaderProps"
        ></el-cascader>
      </div>
      <div class="datePick">
        <span class="datePickTitle">编辑时间</span>
        <el-date-picker
          v-model="searchForm.valueDate"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="——"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd HH:mm:ss"
          :default-time="['00:00:00', '23:59:59']"
        >
        </el-date-picker>
      </div>
      <div class="PublicForm-title-input">
        <el-input v-model="searchForm.name" placeholder="请输入工作流名称"></el-input>
      </div>
      <div class="PublicForm-title-input">
        <el-button type="primary" @click="refreshWorkFlowRecord">查询</el-button>
      </div>
      <div class="PublicForm-title-input">
        <el-button type="primary" @click="onReset">重置</el-button>
      </div>
      <div class="PublicForm-title-button">
        <el-button
          type="primary"
          @click="onAddProject"
          v-role="{ id: 'WorkflowAdd', type: 'button', business: projectValue }"
          >新建工作流</el-button
        >
      </div>
      <div class="PublicForm-title-button">
        <el-button
          type="primary"
          @click="onQuoteBpmnShow"
          v-role="{ id: 'WorkflowUse', type: 'button', business: projectValue }"
          >关联工作流</el-button
        >
      </div>
    </div>
    <div class="home-main">
      <div class="home-main-tab">
        <span
          class="home-main-tab-item"
          :class="activeName === 'enabled,disabled' ? 'active' : ''"
          @click="onChangeActiveName('enabled,disabled')"
          >工作流({{ processCount }})</span
        >
        <span
          class="home-main-tab-item"
          :class="activeName === 'drafted' ? 'active' : ''"
          @click="onChangeActiveName('drafted')"
          >草稿箱（{{ draftProcessCount }}）</span
        >
      </div>
      <div class="home-table">
        <projectTable
          v-if="activeName === 'enabled,disabled'"
          :business="projectValue"
          :searchForm="searchFormData"
          @lookBpmnShow="onLookBpmnShow"
          @deleteRow="onProjectDeleteRow"
        ></projectTable>
        <draftTable
          v-if="activeName === 'drafted'"
          :business="projectValue"
          :searchForm="searchFormData"
          @draftTableEdit="onDraftTableEdit"
          @deleteRow="onDraftDeleteRow"
        ></draftTable>
      </div>
    </div>
    <addProject :visible="addProjectVisible" @close="onAddProjectClose" @submit="onAddProjectSubmit"></addProject>
    <addBpmn
      v-if="addBpmnVisible"
      :visible="addBpmnVisible"
      :projectData="projectData"
      @close="onAddBpmnClose"
      @submit="onAddBpmnSubmit"
    ></addBpmn>
    <quoteBpmn
      v-if="quoteBpmnVisible"
      :valueDate="searchForm.valueDate"
      :ascription="searchForm.ascription"
      :business="projectValue"
      :visible="quoteBpmnVisible"
      @close="onQuoteBpmnClose"
      @lookBpmn="onLookBpmnShow"
      @quoteBpmn="onQuoteBpmn"
    ></quoteBpmn>
    <lookBpmn
      v-if="lookBpmnVisible"
      :projectData="projectData"
      :visible="lookBpmnVisible"
      @close="onLookBpmnClose"
      @edit="onLookBpmnEdit"
    ></lookBpmn>
  </div>
</template>

<script>
import projectTable from './projectTable.vue'
import draftTable from './draftTable.vue'
import addProject from './addProject.vue'
import addBpmn from './addBpmn.vue'
import quoteBpmn from './quoteBpmn.vue'
import lookBpmn from './lookBpmn.vue'
import { designProcessCountStatistics } from '@/api/managerWorkflow'
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
      searchForm: {
        ascription: '',
        business: '',
        valueDate: [start, end],
        name: '',
      },
      searchFormData: {},
      draftProcessCount: 0,
      processCount: 0,
      lookData: null,
      projectValue: '',
      projectData: {},
      addProjectVisible: false,
      addBpmnVisible: false,
      quoteBpmnVisible: false,
      lookBpmnVisible: false,
      activeName: 'enabled,disabled',
    }
  },
  computed: {
    ...mapState('account', ['tenantId', 'userInfo', 'currentOrganization']),
    ...mapState('uiConfig', ['cascaderProps']),
    ...mapGetters('config', ['rootOrganizations', 'rootOrganizationChildrenAndAll']),
  },
  watch: {
    'searchForm.ascription'(value) {
      if (value === this.currentOrganization) {
        return
      }
      this.updateCurrentOrganization({ currentOrganization: value })
    },
    currentOrganization: {
      immediate: true,
      handler(value) {
        this.searchForm.ascription = value
      },
    },
  },
  async mounted() {
    await this.dispatchRefreshOrganization()
    await this.refreshWorkFlowRecord()
  },
  methods: {
    ...mapMutations('account', ['updateCurrentOrganization']),
    ...mapActions('config', ['dispatchRefreshOrganization']),
    async onAddProject() {
      const uuid = await this.$generateUUID()
      this.addProjectVisible = true
      this.projectData = {
        code: `process_${uuid}`,
      }
    },
    async onQuoteBpmn(_, row) {
      try {
        const uuid = await this.$generateUUID()
        this.setProjectData({ ...row, code: `process_${uuid}`, docName: `${uuid}.bpmn` })
        this.addProjectVisible = true
      } catch (error) {}
    },
    onReset() {
      const { start, end } = currentOneMonthAgo('yyyy-MM-DD HH:mm:ss')
      this.searchForm = {
        ...this.searchForm,
        business: '',
        valueDate: [start, end],
        name: '',
      }
      this.refreshWorkFlowRecord()
    },
    onAddProjectClose() {
      this.addProjectVisible = false
    },
    onAddProjectSubmit(value) {
      this.addProjectVisible = false
      this.setProjectData(value)
      this.addBpmnVisible = true
    },
    onAddBpmnClose() {
      this.addBpmnVisible = false
      this.resetProjectData()
    },
    onAddBpmnSubmit() {
      this.addBpmnVisible = false
      this.resetProjectData()
      this.refreshWorkFlowRecord()
    },
    onQuoteBpmnShow() {
      this.quoteBpmnVisible = true
    },
    onQuoteBpmnClose() {
      this.quoteBpmnVisible = false
      this.resetProjectData()
    },
    onLookBpmnShow(row) {
      this.setProjectData(row)
      this.lookBpmnVisible = true
    },
    onLookBpmnClose() {
      this.lookBpmnVisible = false
      this.resetProjectData()
      this.refreshWorkFlowRecord()
    },
    onLookBpmnEdit(row) {
      this.lookBpmnVisible = false
      this.setProjectData(row)
      this.addBpmnVisible = true
    },
    onDraftTableEdit(row) {
      this.setProjectData(row)
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
    resetProjectData() {
      this.projectData = {}
    },
    setProjectData(data) {
      this.projectData = { ...this.projectData, ...data }
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
          ...this.searchForm,
          tenantId: this.tenantId,
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
