<template>
  <div class="runtime">
    <div class="runtime-filter">
      <div class="projectSelect marginRight20">
        <el-select v-model="searchForm.ascription">
          <el-option
            v-for="{ id, label, value } in rootOrganizations"
            :key="id"
            :label="label"
            :value="value"
          ></el-option>
        </el-select>
      </div>
      <div class="businessSelect marginRight20">
        <el-cascader
          v-model="searchForm.business"
          :key="searchForm.ascription"
          :options="rootOrganizationChildrenAndAll(searchForm.ascription)"
          :props="cascaderProps"
          @change="onBusinessChange"
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
          @change="onTimeRangeChange"
        >
        </el-date-picker>
      </div>
    </div>
    <div class="runtime-home">
      <div class="runtime-home-title">
        <div class="data" v-for="({ label, value }, index) in workflowStatistics" :key="index">
          <div class="title">
            <b class="value">{{ value }}</b>
          </div>
          <div class="titLabel">{{ label }}</div>
        </div>
      </div>
      <div class="runtime-home-button" v-role="{ id: 'RunTimeAdd', type: 'button', business: searchForm.ascription }">
        <div class="button1" :class="searchForm.ascription ? '' : 'disableStyle'" @click="onAddTicket">
          <div class="title">
            <i class="el-icon-circle-plus"></i>
          </div>
          <div class="titLabel">创建工单</div>
        </div>
      </div>
    </div>
    <div class="runtime-check">
      <el-radio-group v-model="searchForm.taskType" @change="onTaskTypeChange">
        <el-radio v-for="({ label, display }, index) in taskTypeRadios" :key="index" :label="label">
          {{ display }}
        </el-radio>
      </el-radio-group>
    </div>
    <div class="runtime-table">
      <div class="home-table-main">
        <el-table :data="newTasks">
          <el-table-column type="index" label="序号" align="center"> </el-table-column>
          <el-table-column prop="processDeployName" label="名称" align="center" show-overflow-tooltip="" />
          <el-table-column prop="displayEnergyType" label="部署类型" align="center" />
          <el-table-column prop="starter" label="发起人" align="center" />
          <el-table-column prop="startTime" label="发起时间" align="center" />
          <el-table-column label="执行进程" align="center" min-width="250">
            <template slot-scope="{ row }">
              <el-steps :active="row.displayTrackList.length" align-center process-status="success">
                <el-step
                  v-for="({ title, className, taskName }, index) in row.displayTrackList"
                  icon="el-icon-edit"
                  :key="index"
                  :title="taskName"
                  :description="title"
                  :class="className"
                ></el-step>
              </el-steps>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="{ row }">
              <el-button v-if="row.canExecute" @click.native.prevent="onExecute(row)" type="text" size="small">
                执行
              </el-button>
              <el-button
                @click.native.prevent="onDetail(row)"
                type="text"
                size="small"
                v-role="{ id: 'RunTimeLook', type: 'button', business: searchForm.ascription }"
              >
                查看
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="home-table-page">
        <el-pagination
          :current-page.sync="pageInfo.page"
          :page-size.sync="pageInfo.limit"
          :total="pageInfo.total"
          @current-change="onPageChange"
          @size-change="onPageSizeChange"
          layout="prev, pager, next, jumper"
        >
        </el-pagination>
      </div>
    </div>
    <runtime-add
      :dialogVisible="runtimeAddVisible"
      :projectCode="searchForm.ascription"
      @close="onRuntimeAddClose"
      @succseeAdd="onAddSuccess"
    ></runtime-add>
    <runtime-implement
      v-if="runtimeImplementVisible"
      :visible="runtimeImplementVisible"
      :processInstanceId="workflow.processInstanceId"
      @close="onRuntimeImplementClose"
      @taskSuccess="onTaskSuccess"
    ></runtime-implement>
    <lookover
      v-if="lookoverVisible"
      ref="lookover"
      :visible="lookoverVisible"
      :processInstanceId="workflow.processInstanceId"
      @close="onLookoverClose"
    ></lookover>
  </div>
</template>

<script>
import RuntimeAdd from './component/RuntimeAdd.vue'
import RuntimeImplement from './component/RuntimeImplement.vue'
import Lookover from './component/lookover.vue'
import { getTaskCountStatistic, postTaskCountStatistics, getExecuteList } from '@/api/unit/api.js'
import { mapActions, mapGetters, mapState } from 'vuex'

import { currentOneMonthAgo } from '@/util/date'

export default {
  name: 'Runtime',
  components: {
    RuntimeAdd,
    RuntimeImplement,
    Lookover,
  },
  data() {
    const { start, end } = currentOneMonthAgo('YYYY-MM-DD HH:mm:ss')
    return {
      runtimeAddVisible: false,
      runtimeImplementVisible: false,
      lookoverVisible: false,
      newTasks: [],
      searchForm: {
        ascription: '',
        business: '',
        valueDate: [start, end],
        taskType: 'all',
        order: 'desc',
      },
      pageInfo: {
        page: 1,
        limit: 10,
        total: 0,
      },
      workflow: {},
      workflowCounts: {
        executionTotalProcessCount: 0,
        executionInProcessCount: 0,
        executionCompleteCount: 0,
      },
      taskTypeCounts: {
        all: 0,
        notice: 0,
        self: 0,
      },
      taskStatusConfig: {
        run: {
          title: '执行',
          className: '',
        },
        completed: {
          title: '通过',
          className: '',
        },
        hang: {
          title: '挂起',
          className: 'tableStepHang',
        },
        rejected: {
          title: '驳回',
          className: 'tableStepDeleted',
        },
        deleted: {
          title: '删除',
          className: 'tableStepDeleted',
        },
      },
    }
  },
  computed: {
    ...mapState('account', ['userInfo', 'tenantId', 'currentOrganization']),
    ...mapState('uiConfig', ['cascaderProps']),
    ...mapGetters('config', ['rootOrganizations', 'rootOrganizationChildrenAndAll']),
    workflowStatistics() {
      return [
        {
          label: '执行工作流总数',
          value: this.workflowCounts.executionTotalProcessCount,
        },
        {
          label: '执行中',
          value: this.workflowCounts.executionInProcessCount,
        },
        {
          label: '已完成数量',
          value: this.workflowCounts.executionCompleteCount,
        },
      ]
    },
    taskTypeRadios() {
      return [
        {
          label: 'all',
          display: `全部任务（${this.taskTypeCounts['all'] ?? 0}）`,
        },
        {
          label: 'self',
          display: `我的任务（${this.taskTypeCounts['self'] ?? 0}）`,
        },
        {
          label: 'notice',
          display: `告知（${this.taskTypeCounts['notice'] ?? 0}）`,
        },
      ]
    },
  },
  async mounted() {
    await this.dispatchRefreshOrganization()
    this.searchForm.ascription = this.currentOrganization
    this.fetchNewTasks()
    this.fetchAmount()
    this.fetchDataNumber()
  },
  methods: {
    ...mapActions('config', ['dispatchRefreshOrganization']),
    onBusinessChange() {
      this.getAllApi()
    },
    onTimeRangeChange() {
      this.getAllApi()
    },
    onTaskTypeChange() {
      this.pageInfo = {
        page: 1,
        limit: 10,
        total: 0,
      }
      this.fetchNewTasks()
    },
    onExecute(row) {
      this.workflow = { ...row }
      this.runtimeImplementVisible = true
    },
    onDetail(row) {
      this.workflow = { ...row }
      this.lookoverVisible = true
      // this.detailsDiolog(row)
    },
    onLookoverClose() {
      this.lookoverVisible = false
    },
    onPageSizeChange() {
      this.fetchNewTasks()
    },
    onPageChange() {
      this.fetchNewTasks()
    },
    onRuntimeImplementClose() {
      this.runtimeImplementVisible = false
    },
    onAddSuccess() {
      this.runtimeAddVisible = false
      this.fetchNewTasks()
    },
    detailsDiolog(row) {
      this.$refs.lookover.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.lookover.$refs.ProcessInformation.postData = row
        this.$refs.lookover.$refs.ProcessInformation.postData.deployName = row.processName
        this.$refs.lookover.$refs.ProcessInformation.postData.version = row.starter
        this.$refs.lookover.$refs.ProcessInformation.postData.createTime = row.startTime
        this.$refs.lookover.$refs.ProcessInformation.postData.systemType = row.processDeployType
        this.$refs.lookover.getListData(row.trackList)
        this.$refs.lookover.$refs.ProcessInformation.createNewDiagram(row.content, row.taskKey)
      })
    },
    onAddTicket() {
      this.runtimeAddVisible = true
    },
    onRuntimeAddClose() {
      this.runtimeAddVisible = false
    },
    onTaskSuccess() {
      this.runtimeImplementVisible = false
      this.fetchNewTasks()
    },
    async getAllApi() {
      await Promise.all([this.fetchDataNumber(), this.fetchNewTasks(), this.fetchAmount()])
    },
    async fetchDataNumber() {
      try {
        const { errorInfo, result } = await getTaskCountStatistic({
          ascription: this.searchForm.ascription,
          assignee: this.userInfo.account,
          business: this.searchForm.business,
          startTime: this.searchForm.valueDate[0],
          endTime: this.searchForm.valueDate[1],
          tenantId: this.tenantId,
        })
        if (errorInfo.errorCode) {
          this.$message.error(errorInfo.errorMsg)
          return
        }
        this.workflowCounts = result
      } catch (error) {
        this.workflowCounts = {
          executionCount: 0,
          completeCount: 0,
          executionInCount: 0,
        }
      }
    },
    async fetchNewTasks() {
      try {
        const { errorInfo, result } = await getExecuteList({
          ...this.searchForm,
          ...this.pageInfo,
          taskFilter: this.searchForm.taskType,
          startTime: this.searchForm.valueDate[0],
          endTime: this.searchForm.valueDate[1],
          tenantId: this.tenantId,
          assignee: this.userInfo.account,
        })
        if (errorInfo.errorCode) {
          this.$message.error(errorInfo.errorMsg)
          return
        }
        const { dataList = [], count } = result
        this.newTasks = dataList.map((task) => handleDisplay.call(this, task))
        this.pageInfo.total = +count
      } catch (error) {
        this.newTasks = []
      }

      function handleDisplay(task) {
        const newTask = { ...task }

        newTask.displayTrackList = newTask.progressBarList.map(({ taskName, taskStatus }) => ({
          taskName,
          ...(this.taskStatusConfig[taskStatus] ?? { title: '多人执行', className: '' }),
        }))
        newTask.displayEnergyType = this.$getMappingName(newTask.processDeployType)
        newTask.canExecute = task.taskUserSet.includes(this.userInfo.account)
        return newTask
      }
    },
    async fetchAmount() {
      try {
        const { errorInfo, result } = await postTaskCountStatistics({
          assignee: this.userInfo.account,
          business: this.searchForm.business,
          startTime: this.searchForm.valueDate[0],
          endTime: this.searchForm.valueDate[1],
          projectCode: this.searchForm.ascription,
          tenantId: this.tenantId,
        })
        if (errorInfo.errorCode) {
          this.$message.error(errorInfo.errorMessage)
          return
        }
        this.taskTypeCounts = result
      } catch (error) {}
    },
  },
}
</script>

<style scoped lang="scss">
.runtime {
  margin: 20px;
}

.runtime-filter {
  display: flex;
}

.runtime-filter ::v-deep .el-select .el-input__inner {
  border: 1px solid #000;
}

.runtime-filter ::v-deep .el-cascader .el-input__inner {
  border: 1px solid #000;
}

.marginRight20 {
  margin-right: 20px;
}

.button1 {
  cursor: pointer;
}

.datePickTitle {
  font-size: 14px;
  color: #000000;
  margin-right: 20px;
}

.datePick ::v-deep .el-date-editor {
  border: 1px solid #000000;
}

.runtime-home {
  margin-top: 40px;
  display: flex;
}

.runtime-home-title {
  width: 1286px;
  height: 142px;
  background-color: #f2f2f2;
  display: flex;
}

.runtime-home-title .data {
  flex: 1;
  text-align: center;
}

.runtime-home-title .data .title {
  font-size: 36px;
  height: 100px;
  line-height: 100px;
}

.runtime-home-button {
  width: 368px;
  height: 142px;
  background-color: #f2f2f2;
  margin-left: 20px;
  display: flex;
}

.runtime-home-button > div {
  flex: 1;
  text-align: center;
  padding: 20px 0px;
}

.runtime-home-button .title {
  font-size: 36px;
  height: 80px;
  line-height: 80px;
}

.titLabel {
  font-size: 14px;
}

.runtime-check {
  margin-top: 40px;
}

.runtime-table {
  padding: 10px;
  border: 1px solid #666666;
  margin-top: 20px;
}

.runtime-table .home-table-page {
  text-align: right;
  padding: 20px 0px;
}

.disableStyle {
  cursor: not-allowed;
  color: gray;
}

/deep/ .el-table {
  .el-steps {
    position: relative;
    line-height: 23px;
    top: 0px;

    .tableStepOnly {
      .el-step__icon {
        background-color: #0066cc !important;
      }
    }

    .tableStepDeleted {
      .el-step__icon {
        background-color: red !important;
      }
    }

    .tableStepHang {
      .el-step__icon {
        background-color: green !important;
      }
    }

    .el-step__head.is-finish {
      .el-step__icon {
        background-color: #66ccff;
      }

      .el-step__line {
        height: 2px;
        border-color: #66ccff;
      }
    }

    .el-step__head {
      margin-top: 20px;
    }

    .el-step__icon-inner {
      display: none;
    }

    .el-step__line {
      height: 2px;
    }

    .el-step__icon {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: #cccccc;
    }

    .el-step__line-inner {
      border-width: 1px !important;
      margin-top: 0px;
    }

    .el-step__title {
      color: #858585 !important;
      font-size: 12px;
    }

    .el-step__description {
      // color: white ;
      font-size: 12px;
      position: absolute;
      top: 5px;
      width: 100%;
    }
  }
}
</style>
