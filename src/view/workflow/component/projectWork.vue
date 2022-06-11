<template>
  <div class="PublicForm">
    <div class="projectHeader">
      <el-select @change="projectChange"
                 v-model="projectCode">
        <el-option v-for="item in projectOption"
                   :key="item.id"
                   :label="item.name"
                   :value="item.code"></el-option>
      </el-select>
    </div>
    <div class="PublicForm-title">
      <div class="PublicForm-title-option">
        <el-cascader style="width: 350px"
                     v-model="projectValue"
                     :options="systemOption"
                     :props='sysProps'></el-cascader>
      </div>
      <div class="datePick">
        <span class="datePickTitle">创建时间</span>
        <el-date-picker v-model="valueDate"
                        type="daterange"
                        align="right"
                        unlink-panels
                        range-separator="——"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd">
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
        <projectTable ref="project"
                      :formListFirst="formListFirst"
                      :valueDate="valueDate"
                      :ascription="projectCode"
                      :business="projectValue"
                      v-if="activeName === 'enabled,disabled'"
                      @lookBpmnShow="lookBpmnShow"></projectTable>
        <draftTable ref="draft"
                    :formListSecond="formListSecond"
                    @totalChange="totalChange"
                    :valueDate="valueDate"
                    :ascription="projectCode"
                    :business="projectValue"
                    v-if="activeName === 'drafted'"
                    @draftTableEdit="draftTableEdit"></draftTable>
      </div>
    </div>
    <addProject ref="addpro"
                :projectCode="projectCode"
                :dialogVisible="addProjectVisible"
                :projectOption="projectOption"
                :systemOption="systemOption"
                :sysProps='sysProps'
                @close="addProjectHidden()"
                @define="addProjectDefine"></addProject>
    <addBpmn :pubFlag="pubFlag"
             :formData="formData"
             :flag="flag"
             :currentRowData="currentRowData"
             v-if="addBpmnVisible"
             :dialogVisible="addBpmnVisible"
             @close="addBpmnHidden()"
             @define="addBpmnDefine"
             :xmlString="xmlString"></addBpmn>
    <quoteBpmn v-if="quoteBpmnVisible"
               :valueDate="valueDate"
               :ascription="projectCode"
               :business="projectValue"
               :dialogVisible="quoteBpmnVisible"
               @close="quoteBpmnHidden()"
               @lookBpmnShow="lookBpmnShow"
               @addProjectShow="addProjectShow"></quoteBpmn>
    <lookBpmn :showFlag="showFlag"
              :business="projectValue"
              :isEdit="isEdit"
              :rowData="rowData"
              :dep="dep"
              v-if="lookBpmnVisible"
              ref="bpmn"
              :dialogVisible="lookBpmnVisible"
              @close="lookBpmnHidden()"
              @edit="lookBpmnEdit"
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
import { getProjectList } from '@/api/globalConfig'
import { mapState } from 'vuex'

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
    return {
      sysProps: {
        label: 'name',
        value: 'code',
        emitPath: false,
        checkStrictly: true,
      },
      systemOption: [],
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
      projectOption2: [],
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
      valueDate: [],
      input: '',
      activeName: 'enabled,disabled',
      formListFirst: [],
      formListSecond: [],
      dialogVisible: false,
      xmlString: '',
      flag: false,
      toData: null,
      pubFlag: false,
      showFlag: true,
    }
  },
  computed: {
    ...mapState(['tenantId', 'userInfo']),
  },
  async mounted() {
    await this.getProjectList()
    await designProcessCountStatistics({
      tenantId: this.tenantId,
      ascription: this.projectCode,
      business: this.projectValue,
      startTime: this.valueDate[0] && `${this.valueDate[0]} 00:00:00`,
      endTime: this.valueDate[1] && `${this.valueDate[1]} 23:59:59`,
      createBy: this.userInfo.name,
    }).then((res) => {
      this.draftProcessCount = res.result.draftProcessCount
      this.processCount = res.result.processCount
    })
    this.findWorkFlowRecord(this.activeName)
  },
  methods: {
    deleteEmptyChildren(arr) {
      for (let i = 0; i < arr.length; i++) {
        const arrElement = arr[i]
        if (!arrElement.children.length) {
          delete arrElement.children
          continue
        }
        if (arrElement.children) {
          this.deleteEmptyChildren(arrElement.children)
        }
      }
    },
    projectChange(val) {
      this.systemOption = this.projectOption.filter(
        ({ code }) => code === val
      )[0].children
      this.deleteEmptyChildren(this.systemOption)
    },
    async getProjectList() {
      let res = await getProjectList({
        count: -1,
        projectCode: '',
        tenantId: this.tenantId,
        type: '',
      })
      this.projectOption = res?.result ?? []
      this.projectCode = this.projectOption[0].code
      this.systemOption = this.projectOption[0].children
      this.deleteEmptyChildren(this.systemOption)
    },

    // 修改code
    changProjectCode(code) {
      this.projectCode = code
      this.findWorkFlowRecord(this.activeName)
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
    addProjectHidden() {
      this.addProjectVisible = false
    },
    addProjectDefine(value) {
      this.formData = value
      Object.keys(value).length ? (this.flag = true) : (this.flag = false)
      this.addProjectVisible = false
      this.addBpmnShow()
    },
    addBpmnShow() {
      this.xmlString = this.toData?.content || ''
      this.addBpmnVisible = true
    },
    addBpmnHidden() {
      this.addBpmnVisible = false
    },
    addBpmnDefine() {
      this.flag = false
      this.addBpmnVisible = false
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
      this.$nextTick(() => {
        this.$refs.bpmn.currentRowData = row
        this.$refs.bpmn.$refs.bpmnView.postData = row
        this.$refs.bpmn.$refs.bpmnView.showFlag = false
      })
    },
    lookBpmnHidden() {
      this.lookBpmnVisible = false
    },
    lookBpmnEdit(row, flag) {
      if (flag === '查看') {
        this.pubFlag = true
      }
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
    // 查询草稿箱
    getDraftData() {
      postFormDesignRecordDraftInfo({
        tenantId: this.tenantId,
        status: 'drafted',
        ascription: this.projectCode,
        business: this.projectValue,
        createBy: this.userInfo.name,
        numberCode: '',
        name: this.input,
        startTime: this.valueDate[0] ?? undefined,
        endTime: this.valueDate[1] ?? undefined,
      }).then((res) => {
        this.formListSecond = res.result
      })
    },
    // 查询可部署流程
    getEnableData() {
      postFormDesignBasicFormRecord({
        tenantId: this.tenantId,
        status: 'enabled',
        ascription: this.projectCode,
        business: this.projectValue,
        createBy: this.name,
        numberCode: '',
        name: this.input,
        startTime: this.valueDate[0] ?? undefined,
        endTime: this.valueDate[1] ?? undefined,
      }).then((res) => {
        this.formListFirst = res.result
      })
    },

    getManyData() {
      this.findWorkFlowRecord(this.activeName)
    },
    // 查询项目流程
    async findWorkFlowRecord(status) {
      let data = await workFlowRecord({
        tenantId: this.tenantId,
        status,
        ascription: this.projectCode,
        business: this.projectValue,
        createBy: this.userInfo.name,
        numberCode: '',
        name: this.input,
        startTime: this.valueDate[0] && `${this.valueDate[0]} 00:00:00`,
        endTime: this.valueDate[1] && `${this.valueDate[1]} 23:59:59`,
        page: this.getData.page,
        limit: this.getData.limit,
      })
      status === 'drafted'
        ? ((this.firstTotal = data.result.total),
          (this.$refs.draft.getData.total = data.result.total),
          (this.formListSecond = data.result.list))
        : ((this.secondtTotal = data.result.total),
          (this.$refs.project.getData.total = data.result.total),
          (this.formListFirst = data.result.list))
    },
  },
}
</script>

<style scoped>
.projectHeader /deep/ .el-input__inner {
  border: 1px solid black;
}

.PublicForm-title /deep/ .el-input__inner {
  border: 1px solid black;
}

.PublicForm-title {
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
