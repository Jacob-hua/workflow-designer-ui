<template>
  <div class="home">
    <div class="home-filter">
      <div class="projectSelect">
        <el-select v-model="searchForm.ascription">
          <el-option
            v-for="{ id, label, value } in rootOrganizations"
            :key="id"
            :label="label"
            :value="value"
          ></el-option>
        </el-select>
      </div>
      <div class="businessSelect">
        <el-cascader
          style="margin-right: 10px"
          v-model="searchForm.business"
          :options="rootOrganizationChildrenAndAll(searchForm.ascription)"
          :props="cascaderProps"
          clearable
        ></el-cascader>
      </div>
      <div class="datePick">
        <span class="datePickTitle">时间</span>
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
          :clearable="false"
        >
        </el-date-picker>
      </div>
    </div>
    <div class="home-header">
      <div class="data1">
        <div>
          <div class="title">{{ deployedWorkflowContents }}</div>
          <div class="titLabel">已部署工作流</div>
        </div>
        <div>
          <div class="title">{{ WorkflowTableNum }}</div>
          <div class="titLabel">可部署工作流</div>
        </div>
      </div>
      <div class="data2">
        <div>
          <div class="title">{{ workflowContents.executionTotalProcessCount }}</div>
          <div class="titLabel">执行工作流总数</div>
        </div>
        <div>
          <div class="title">{{ workflowContents.executionInProcessCount }}</div>
          <div class="titLabel">执行中</div>
        </div>
        <div>
          <div class="title">{{ workflowContents.executionCompleteCount }}</div>
          <div class="titLabel">已完成数量</div>
        </div>
      </div>
      <div class="data3">
        <div @click="gotoWorkflow">
          <div class="title">
            <i class="el-icon-circle-plus"></i>
          </div>
          <div class="titLabel">新建工作流</div>
        </div>
      </div>
    </div>
    <div class="home-main">
      <div class="home-main-tab">
        <span
          class="home-main-tab-item"
          :class="activeName === 'workflow' ? 'active' : ''"
          @click="changeAction('workflow')"
        >
          工作流（{{ WorkflowTableNum }}）
        </span>
        <span
          class="home-main-tab-item"
          :class="activeName === 'drafts' ? 'active' : ''"
          @click="changeAction('drafts')"
        >
          草稿箱（{{ draftsTableNum }}）
        </span>
      </div>
      <div class="home-table">
        <workflow-table
          v-show="activeName === 'workflow'"
          :valueDate="searchForm.valueDate"
          :ascription="searchForm.ascription"
          :business="searchForm.business"
          :searchForm="searchForm"
          @totalChange="totalChange"
          ref="workflow"
          @getManyData="getManyData()"
        ></workflow-table>
        <drafts-table
          v-show="activeName === 'drafts'"
          :valueDate="searchForm.valueDate"
          :ascription="searchForm.ascription"
          :business="searchForm.business"
          @totalChange="totalChange"
          ref="drafts"
          @getManyData="getManyData()"
        ></drafts-table>
      </div>
    </div>
  </div>
</template>

<script>
import WorkflowTable from './component/WorkflowTable.vue'
import DraftsTable from './component/DraftsTable.vue'
import { getDeployCount, getTaskCountStatistic } from '@/api/unit/api.js'
import { mapState, mapGetters, mapActions } from 'vuex'
import { currentOneMonthAgo } from '@/util/date'

export default {
  components: {
    WorkflowTable,
    DraftsTable,
  },
  data() {
    const { start, end } = currentOneMonthAgo('yyyy-MM-DD HH:mm:ss')
    return {
      searchForm: {
        ascription: '',
        business: '',
        valueDate: [start, end],
      },
      workflowContents: {
        executionCompleteCount: 0,
        executionInProcessCount: 0,
        executionTotalProcessCount: 0,
      },
      activeName: 'workflow',
      WorkflowTableNum: 0,
      draftsTableNum: 0,
      deployedWorkflowContents: 0,
    }
  },
  computed: {
    ...mapState('account', ['userInfo', 'tenantId']),
    ...mapState('uiConfig', ['cascaderProps']),
    ...mapGetters('config', ['rootOrganizations', 'rootOrganizationChildrenAndAll', 'findRootOrganizationByIndex']),
  },
  watch: {
    searchForm: {
      deep: true,
      immediate: true,
      handler() {
        this.getManyData()
      },
    },
  },
  async created() {
    await this.dispatchRefreshOrganization()
    this.searchForm.ascription = this.findRootOrganizationByIndex(0).value
    this.getManyData()
  },
  methods: {
    ...mapActions('config', ['dispatchRefreshOrganization']),
    gotoWorkflow() {
      let { menuProjectList } = JSON.parse(sessionStorage.getItem('loginData'))

      this.menuList = menuProjectList.filter((item) => {
        return item.projectList.length > 0
      })
      let isWorkflowRole = this.menuList.findIndex((item) => {
        return item.menuRoute === 'Workflow'
      })
      if (isWorkflowRole === -1) {
        this.$message.error('无权限')
      } else {
        this.$router.push('/home/Workflow')
      }
    },
    totalChange(value, key) {
      this[key] = value
    },
    changeAction(value) {
      this.activeName = value
      this.$refs.workflow.fetchWorkflows()
    },
    getDeployCountList() {
      getDeployCount({
        ascription: this.searchForm.ascription,
        business: this.searchForm.business,
        startTime: this.searchForm.valueDate[0],
        endTime: this.searchForm.valueDate[1],
        status: 'activation',
        tenantId: this.tenantId,
      }).then((res) => {
        this.deployedWorkflowContents = res.result
      })
    },
    getManyData() {
      this.getDataNumber()
      this.getDeployCountList()
      this.$nextTick(() => {
        this.$refs.workflow.fetchWorkflows()
        this.$refs.drafts.getTableData()
      })
    },
    getDataNumber() {
      getTaskCountStatistic({
        ascription: this.searchForm.ascription,
        assignee: this.userInfo.account,
        business: this.searchForm.business,
        endTime: this.searchForm.valueDate[1],
        startTime: this.searchForm.valueDate[0],
        tenantId: this.tenantId,
      }).then((res) => {
        if (res) {
          this.workflowContents = res.result
        } else {
          this.workflowContents = {
            executionCompleteCount: 0,
            executionInProcessCount: 0,
            executionTotalProcessCount: 0,
          }
        }
      })
    },
  },
}
</script>

<style scoped="scoped">
.home {
  padding-left: 20px;
  padding-top: 20px;
  padding-right: 20px;
}

.home-filter ::v-deep .el-select .el-input__inner {
  border: 1px solid #000;
}
.home-filter ::v-deep .el-cascader .el-input__inner {
  border: 1px solid #000;
}

.home-header {
  display: flex;
}

.data1 {
  width: 400px;
  height: 160px;
  background-color: #f2f2f2;
  margin-right: 10px;
  display: flex;
}

.data1 > div {
  flex: 1;
  text-align: center;
  padding: 20px 0px;
}

.title {
  font-size: 36px;
  height: 100px;
  line-height: 100px;
}

.titLabel {
  font-size: 14px;
}

.data2 {
  width: 875px;
  height: 160px;
  background-color: #f2f2f2;
  margin-right: 20px;
  display: flex;
}

.data2 > div {
  flex: 1;
  text-align: center;
  padding: 20px 0px;
}

.data3 {
  width: 368px;
  height: 160px;
  background-color: #f2f2f2;
  display: flex;
  cursor: pointer;
}

.data3 > div {
  flex: 1;
  text-align: center;
  padding: 20px 0px;
}

.home-filter {
  margin-bottom: 20px;
  display: flex;
}

.projectSelect {
  margin-right: 20px;
}

.businessSelect {
  margin-right: 40px;
}

.datePickTitle {
  font-size: 14px;
  color: #000000;
  margin-right: 20px;
}

::v-deep .el-date-editor {
  border: 1px solid #000000;
  color: #000000;
  font-size: 20px;
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
</style>
