<template>
  <div>
    <div class="search-wrapper">
      <el-form inline>
        <el-form-item label="项目">
          <el-select v-model="searchForm.ascription">
            <el-option
              v-for="{ id, label, value } in rootOrganizations"
              :key="id"
              :label="label"
              :value="value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="业务">
          <el-cascader
            v-model="searchForm.business"
            :key="searchForm.ascription"
            :options="rootOrganizationChildrenAndAll(searchForm.ascription)"
            :props="cascaderProps"
            @change="onBusinessChange"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="发起时间">
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
        </el-form-item>
      </el-form>
    </div>
    <div class="statistics-wrapper">
      <div>
        <div class="data-wrapper" v-for="({ label, value, icon }, index) in workflowStatistics" :key="index">
          <div class="icon">
            <img :src="icon" />
          </div>
          <div class="title">
            {{ value }}
          </div>
          <div class="label">
            {{ label }}
          </div>
        </div>
      </div>
      <div v-role="{ id: 'RunTimeAdd', type: 'button', business: searchForm.ascription }">
        <div class="data-wrapper" @click="onAddTicket">
          <div class="icon">
            <img :src="require('../../assets/image/runtime/create.svg')" />
          </div>
          <div class="label">创建工单</div>
        </div>
      </div>
    </div>
    <div class="content-wrapper">
      <el-tabs v-model="searchForm.taskType" type="border-card" @tab-click="onTaskTypeChange">
        <el-tab-pane v-for="({ label, display }, index) in taskTypeRadios" :key="index" :name="label">
          <span slot="label">{{ display }}</span>
          <div>
            <el-table :data="newTasks">
              <el-table-column type="index" label="序号"> </el-table-column>
              <el-table-column prop="processDeployName" label="名称" show-overflow-tooltip="" />
              <el-table-column prop="displayEnergyType" label="部署类型" />
              <el-table-column prop="starter" label="发起人" />
              <el-table-column prop="startTime" label="发起时间" />
              <el-table-column label="执行进程" min-width="250">
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
              <el-table-column label="操作">
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
        </el-tab-pane>
      </el-tabs>
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
          className: 'table-step-hang',
        },
        rejected: {
          title: '驳回',
          className: 'table-step-rejected',
        },
        deleted: {
          title: '删除',
          className: 'table-step-rejected',
        },
        timedOut: {
          title: '超时',
          className: 'table-step-rejected'
        }
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
          icon: require('../../assets/image/runtime/executed.svg'),
          label: '执行工作流总数',
          value: this.workflowCounts.executionTotalProcessCount,
        },
        {
          icon: require('../../assets/image/runtime/executing.svg'),
          label: '执行中',
          value: this.workflowCounts.executionInProcessCount,
        },
        {
          icon: require('../../assets/image/runtime/completed.svg'),
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
  watch: {
    searchForm: {
      deep: true,
      immediate: true,
      handler() {
        this.pageInfo.page = 1
      },
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
    onAddTicket() {
      this.runtimeAddVisible = true
    },
    onRuntimeAddClose() {
      this.runtimeAddVisible = false
    },
    onTaskSuccess() {
      this.runtimeImplementVisible = false
      this.getAllApi()
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
          ascription: this.searchForm.ascription,
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
@import './index.scss';

.search-wrapper {
  height: 106px;
  background-color: $card-bg-color;
  border-radius: 6px;

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

.statistics-wrapper {
  display: flex;
  flex-direction: row;
  margin-top: 20px;
  width: 100%;

  & > div {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    background-color: $card-bg-color;
    color: $font-color;
    border-radius: 6px;

    img {
      width: 32px;
      height: 34px;
    }

    .data-wrapper {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-size: 24px;
      line-height: 24px;
      font-weight: 400;
      padding: 28px 0px;
    }

    .title {
      margin-top: 16px;
    }

    .label {
      font-size: 14px;
      line-height: 20px;
      font-weight: 400;
      color: #6e7e88;
      margin-top: 10px;
    }

    .icon {
      width: 68px;
      height: 68px;
      border-radius: 50%;
      background: #d4fdd9;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    &:first-child {
      margin-right: 20px;
      flex-grow: 3;
    }

    &:last-child {
      margin-left: 20px;
      flex-grow: 1;

      .data-wrapper {
        cursor: pointer;
      }

      .icon {
        background-color: #009efb;
      }
    }
  }
}

.content-wrapper {
  margin-top: 20px;
}

.el-pagination {
  text-align: right;
  padding: 34px 0;
}
</style>
