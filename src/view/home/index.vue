<template>
  <div class="home">
    <div class="home-filter">
      <div class="projectSelect">
        <el-select @change="projectChange" v-model="ascription">
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
          v-model="projectCode"
          :options="rootOrganizationChildrenAndAll(ascription)"
          :props="cascaderProps"
          clearable
          @change="handleChange"
        ></el-cascader>
      </div>
      <div class="datePick">
        <span class="datePickTitle">时间</span>
        <el-date-picker
          v-model="valueDate"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="——"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd HH:mm:ss"
          :default-time="['00:00:00', '23:59:59']"
          :clearable="false"
          @change="getManyData()"
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
        <div @click="goBpmn()">
          <div class="title">
            <i class="el-icon-circle-plus"></i>
          </div>
          <div class="titLabel">新建工作流</div>
        </div>
      </div>
    </div>
    <div class="home-main">
      <div class="home-main-tab">
        <span class="home-main-tab-item" :class="activeName === 'first' ? 'active' : ''" @click="changeAction('first')">
          工作流（{{ WorkflowTableNum }}）
        </span>
        <span
          class="home-main-tab-item"
          :class="activeName === 'second' ? 'active' : ''"
          @click="changeAction('second')"
        >
          草稿箱（{{ draftsTableNum }}）
        </span>
      </div>
      <div class="home-table">
        <WorkflowTable
          v-show="activeName === 'first'"
          :valueDate="valueDate"
          :ascription="ascription"
          :business="projectCode"
          @totalChange="totalChange"
          ref="first"
          @getManyData="getManyData()"
        ></WorkflowTable>
        <draftsTable
          v-show="activeName === 'second'"
          :valueDate="valueDate"
          :ascription="ascription"
          :business="projectCode"
          @totalChange="totalChange"
          ref="second"
          @getManyData="getManyData()"
        ></draftsTable>
      </div>
    </div>
  </div>
</template>

<script>
import WorkflowTable from './component/WorkflowTable.vue'
import draftsTable from './component/draftsTable.vue'
import { getDeployCount, getTaskCountStatistic } from '@/api/unit/api.js'
import { getProjectList } from '@/api/globalConfig'
import { mapState, mapGetters, mapActions } from 'vuex'
import { currentOneMonthAgo } from '@/util/date'

export default {
  components: {
    WorkflowTable,
    draftsTable,
  },
  data() {
    const { start, end } = currentOneMonthAgo('yyyy-MM-DD HH:mm:ss')
    return {
      projectOption: [],
      valueDate: [start, end],
      workflowContents: {
        executionCompleteCount: 0,
        executionInProcessCount: 0,
        executionTotalProcessCount: 0,
      },
      activeName: 'first',
      ascription: '',
      projectCode: '',
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
  async created() {
    await this.dispatchRefreshOrganization()
    this.ascription = this.findRootOrganizationByIndex(0).value
    this.getManyData()
  },
  methods: {
    ...mapActions('config', ['dispatchRefreshOrganization']),
    handleChange() {
      this.getManyData()
    },
    projectChange(val) {
      this.getManyData()
    },
    async getProjectList() {
      let res = await getProjectList({
        count: -1,
        projectCode: '',
        tenantId: this.tenantId,
        type: '',
      })
      this.projectOption = res?.result ?? []
      this.ascription = this.projectOption[0].code
    },
    goBpmn() {
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
      this.$refs[value].getTableData()
    },
    getDeployCountList() {
      getDeployCount({
        ascription: this.ascription,
        business: this.projectCode,
        startTime: this.valueDate[0],
        endTime: this.valueDate[1],
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
        this.$refs.first.getTableData()
        this.$refs.second.getTableData()
      })
    },
    getDataNumber() {
      getTaskCountStatistic({
        ascription: this.ascription,
        assignee: this.userInfo.account,
        business: this.projectCode,
        endTime: this.valueDate[1],
        startTime: this.valueDate[0],
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
