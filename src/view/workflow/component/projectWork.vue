<template>
  <div class="public-form">
    <div class="project-header">
      <el-select v-model="projectValue"
                 placeholder="请选择">
        <el-option v-for="item in projectOption"
                   :key="item.value"
                   :label="item.label"
                   :value="item.value">
        </el-option>
      </el-select>
    </div>
    <div class="project-list">
      <div class="project-list-item"
           :class="projectCode === 'beiqijia' ? 'checkPro' : '' "
           @click="changProjectCode('beiqijia')">
        <img src="@/assets/img/projectcccccc.svg"
             alt=""
             width="32px"
             height="32px"
             v-show="projectCode !== 'beiqijia'">
        <img src="@/assets/img/project0066cc.svg"
             alt=""
             width="32px"
             height="32px"
             v-show="projectCode == 'beiqijia'">
        <span class="project-list-item-word">北七家人才基地</span>
      </div>
      <div class="project-list-item"
           :class="projectCode === 'laiwu' ? 'checkPro' : '' "
           @click="changProjectCode('laiwu')">
        <img src="@/assets/img/projectcccccc.svg"
             alt=""
             width="32px"
             height="32px"
             v-show="projectCode !== 'laiwu'">
        <img src="@/assets/img/project0066cc.svg"
             alt=""
             width="32px"
             height="32px"
             v-show="projectCode == 'laiwu'">
        <span class="project-list-item-word">莱芜供热项目</span>
        <!-- <i class="el-icon-close item-icon"></i> -->
      </div>
      <div class="project-list-item"
           :class="projectCode === 'xilaideng' ? 'checkPro' : '' "
           @click="changProjectCode('xilaideng')">
        <img src="@/assets/img/projectcccccc.svg"
             alt=""
             width="32px"
             height="32px"
             v-show="projectCode !== 'xilaideng'">
        <img src="@/assets/img/project0066cc.svg"
             alt=""
             width="32px"
             height="32px"
             v-show="projectCode == 'xilaideng'">
        <span class="project-list-item-word">海口喜来登酒店</span>
        <!-- <i class="el-icon-close item-icon"></i> -->
      </div>
    </div>
    <div class="public-form-title">
      <div class="public-form-title-option">
        <el-select v-model="projectValue"
                   placeholder="请选择">
          <el-option v-for="item in projectOption2"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="date-pick">
        <span class="date-pick-title">创建时间</span>
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
      <div class="public-form-title-input">
        <el-input v-model="input"
                  placeholder="请输入内容"></el-input>
      </div>
      <div class="public-form-title-input">
        <el-button type="primary"
                   @click="getManyData()">查询</el-button>
      </div>
      <div class="public-form-title-button">
        <el-button type="primary"
                   @click="quoteBpmnShow()"
                   v-role="{ id: 'WorkflowUse', type: 'button', business: projectValue }">引用工作流</el-button>
      </div>
      <div class="public-form-title-button">
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
      draftProcessCount: 0,
      processCount: 0,
      isEdit: true,
      dep: '',
      rowData: {},
      lookData: null,
      secondtTotal: 0,
      firstTotal: 0,
      projectValue: '',
      projectOption: [
        {
          value: '',
          label: '全部项目',
        },
      ],
      projectOption2: [
        {
          value: '',
          label: '全部业务',
        },
      ],
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
      projectCode: 'beiqijia',
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
  methods: {
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
    addBpmnDefine(value) {
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
        tenantId: this.$store.state.tenantId,
        status: 'drafted',
        ascription: this.projectCode,
        business: this.projectValue,
        createBy: this.$store.state.userInfo.name,
        numberCode: '',
        name: this.input,
        startTime: this.valueDate[0],
        endTime: this.valueDate[1],
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
        startTime: this.valueDate[0],
        endTime: this.valueDate[1],
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
        tenantId: this.$store.state.tenantId || null,
        status,
        ascription: this.projectCode || '',
        business: this.projectValue || '',
        createBy: this.$store.state.userInfo.name || '',
        numberCode: '',
        name: this.input,
        startTime: this.valueDate[0]
          ? `${this.valueDate[0]} 00:00:00` || ''
          : '',
        endTime: this.valueDate[1] ? `${this.valueDate[1]} 23:59:59` || '' : '',
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
  mounted() {
    designProcessCountStatistics({
      tenantId: this.$store.state.tenantId,
      ascription: this.projectCode,
      business: this.projectValue,
      startTime: this.valueDate[0],
      endTime: this.valueDate[1],
      createBy: this.$store.state.userInfo.name,
    }).then((res) => {
      this.draftProcessCount = res.result.draftProcessCount
      this.processCount = res.result.processCount
    })
    this.findWorkFlowRecord(this.activeName)
  },
}
</script>

<style scoped>
.project-header /deep/ .el-input__inner {
  border: 1px solid black;
}

.public-form-title /deep/ .el-input__inner {
  border: 1px solid black;
}

.public-form-title {
}

.checkPro {
  border: 1px solid #0066cc !important;
}

.project-list {
  padding: 0px 0px 20px 0px;
  border-bottom: 1px solid #eeeeee;
  margin-bottom: 20px;
}

.project-list-item {
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

.project-list-item-word {
  vertical-align: super;
  display: inline-block;
  margin-left: 15px;
}

.item-icon {
  position: absolute;
  top: 20px;
  right: 20px;
}

.project-header {
  display: inline-block;
  margin: 0px 0px 20px 0px;
}

.date-pick {
  display: inline-block;
}

.date-pick-title {
  display: inline-block;
  font-size: 14px;
  margin-right: 20px;
}

.public-form-title-option {
  display: inline-block;
  margin-right: 40px;
}

.public-form-title-input {
  display: inline-block;
  margin-left: 40px;
}

.public-form-title-button {
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
