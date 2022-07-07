<template>
  <div>
    <div class="search-wrapper">
      <el-form :inline="true">
        <el-form-item label="项目选择">
          <el-select v-model="searchForm.ascription">
            <el-option
              v-for="{ id, label, value } in rootOrganizations"
              :key="id"
              :label="label"
              :value="value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="业务选择">
          <el-cascader
            style="margin-right: 10px"
            v-model="searchForm.business"
            :options="rootOrganizationChildrenAndAll(searchForm.ascription)"
            :props="cascaderProps"
            clearable
          ></el-cascader>
        </el-form-item>
        <el-form-item label="创建时间">
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
        </el-form-item>
      </el-form>
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
          :searchForm="searchForm"
          @totalChange="totalChange"
          ref="workflow"
          @getManyData="getManyData()"
        ></workflow-table>
        <drafts-table
          v-show="activeName === 'drafts'"
          :searchForm="searchForm"
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

<style scoped lang="scss">
.search-wrapper {
  height: 106px;
  background-color: $card-bg-color;

  @include searchForm;

  .el-form {
    width: 100%;
    display: flex;
    align-items: center;
    padding: 0 43px;
  }

  .el-form-item {
    margin-bottom: 0;
  }
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
