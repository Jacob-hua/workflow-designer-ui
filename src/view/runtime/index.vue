<template>
  <div class="runtime">
    <div class="runtime-filter">
      <div class="projectSelect marginRight20">
        <el-select v-model="getData.projectCode">
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
          v-model="getData.businessCode"
          :key="getData.projectCode"
          :options="rootOrganizationChildrenAndAll(getData.projectCode)"
          :props="cascaderProps"
          @change="onBusinessChange"
        ></el-cascader>
      </div>
      <div class="datePick">
        <span class="datePickTitle">时间</span>
        <el-date-picker
          v-model="timeRange"
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
        <div class="data">
          <div class="title">
            <b class="value">{{ numberList.executionTotalProcessCount }}</b>
          </div>
          <div class="titLabel">执行工作流总数</div>
        </div>
        <div class="data">
          <div class="title">
            <b class="value">{{ numberList.executionInProcessCount }}</b>
          </div>
          <div class="titLabel">执行中</div>
        </div>
        <div class="data">
          <div class="title">
            <b class="value">{{ numberList.executionCompleteCount }}</b>
          </div>
          <div class="titLabel">已完成数量</div>
        </div>
      </div>
      <div class="runtime-home-button" v-role="{ id: 'RunTimeAdd', type: 'button', business: getData.projectCode }">
        <div class="button1" :class="getData.projectCode ? '' : 'disableStyle'" @click="onAddTicket">
          <div class="title">
            <i class="el-icon-circle-plus"></i>
          </div>
          <div class="titLabel">创建工单</div>
        </div>
      </div>
    </div>
    <div class="runtime-check">
      <el-radio-group v-model="getData.taskType" @change="onTaskTypeChange">
        <el-radio label="all"> 全部任务（{{ amount.all }}） </el-radio>
        <el-radio label="self"> 我的任务（{{ amount.self }}） </el-radio>
        <el-radio label="notice"> 告知（{{ amount.notice }}） </el-radio>
      </el-radio-group>
    </div>
    <div class="runtime-table">
      <div class="home-table-main">
        <el-table :data="newTasks">
          <el-table-column type="index" label="序号" align="center"> </el-table-column>
          <el-table-column prop="processName" label="名称" align="center" show-overflow-tooltip=""> </el-table-column>
          <el-table-column prop="energyType" label="部署类型" align="center">
            <template slot-scope="scope">
              <span>{{ $getMappingName(scope.row.energyType) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="starter" label="发起人" align="center"> </el-table-column>
          <el-table-column prop="startTime" label="发起时间" align="center"> </el-table-column>
          <el-table-column label="执行进程" align="center" min-width="250">
            <template slot-scope="scope">
              <el-steps :active="scope.row.trackList.length" align-center process-status="success">
                <el-step
                  :title="item.taskName"
                  :description="statusObj[item.status]"
                  icon="el-icon-edit"
                  :class="statusClassObj[item.status]"
                  v-for="(item, index) in scope.row.trackList"
                  :key="index"
                ></el-step>
              </el-steps>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="deployDiolog(scope.row)"
                type="text"
                size="small"
                v-if="showDeployDiologButton(scope.row)"
              >
                执行
              </el-button>
              <el-button
                @click.native.prevent="detailsDiolog(scope.row)"
                type="text"
                size="small"
                v-role="{ id: 'RunTimeLook', type: 'button', business: getData.projectCode }"
              >
                查看
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="home-table-page">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="getData.page"
          :page-size.sync="getData.limit"
          layout="prev, pager, next, jumper"
          :total="getData.total"
        >
        </el-pagination>
      </div>
    </div>
    <runtime-add
      :dialogVisible="runtimeAddVisible"
      :projectCode="getData.projectCode"
      @close="closeDialogAdd"
      @succseeAdd="succseeAdd()"
    ></runtime-add>
    <runTimeImplement
      :dialogVisible="runtimeImplementVisible"
      @close="closeDialogImplement"
      @goSee="detailsDiolog"
      ref="runTimeImplement"
      @taskSuccess="taskSuccess()"
      :business="getData.projectCode"
    ></runTimeImplement>
    <lookover ref="lookover" @goReject="deployDiolog"></lookover>
  </div>
</template>

<script>
import RuntimeAdd from './component/RuntimeAdd.vue'
import runTimeImplement from './component/runTimeImplement.vue'
import lookover from './component/lookover.vue'
import { getTaskCountStatistic, getNewTaskList, postTaskCountStatistics } from '@/api/unit/api.js'
import { mapActions, mapGetters, mapState } from 'vuex'

import { currentOneMonthAgo } from '@/util/date'

export default {
  name: 'Runtime',
  components: {
    RuntimeAdd,
    runTimeImplement,
    lookover,
  },
  data() {
    const { start, end } = currentOneMonthAgo('YYYY-MM-DD HH:mm:ss')
    return {
      numberList: {
        executionCount: 0,
        completeCount: 0,
        executionInCount: 0,
      },
      amount: {
        all: 0,
        notice: 0,
        self: 0,
      },
      timeRange: [start, end],
      runtimeAddVisible: false,
      runtimeImplementVisible: false,
      newTasks: [],
      statusObj: {
        completed: '通过',
        run: '执行',
        deleted: '删除',
        hang: '挂起',
        '-': '执行',
        rejected: '驳回',
      },
      statusClassObj: {
        completed: '',
        '-': 'tableStepOnly',
        deleted: 'tableStepDeleted',
        hang: 'tableStepHang',
        rejected: 'tableStepDeleted',
      },
      getData: {
        order: 'desc',
        taskType: 'all',
        page: 1,
        limit: 10,
        total: 1,
        projectCode: '',
        businessCode: '',
      },
    }
  },
  computed: {
    ...mapState('account', ['userInfo', 'tenantId', 'currentOrganization']),
    ...mapState('uiConfig', ['cascaderProps']),
    ...mapGetters('config', ['rootOrganizations', 'rootOrganizationChildrenAndAll']),
  },
  async mounted() {
    await this.dispatchRefreshOrganization()
    this.getData['projectCode'] = this.currentOrganization
    await this.fetchNewTasks()
    await this.fetchAmount()
    await this.fetchDataNumber()
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
      this.getData.page = 1
      this.getData.limit = 10
      this.fetchNewTasks()
    },
    async fetchNewTasks() {
      try {
        const { errorInfo, result } = await getNewTaskList({
          ...this.getData,
          taskFilter: this.getData.taskType,
          startTime: this.timeRange[0],
          endTime: this.timeRange[1],
          tenantId: this.tenantId,
          assignee: this.userInfo.account,
        })
        if (errorInfo.errorCode) {
          this.$message.error(errorInfo.errorMessage)
          return
        }
        this.newTasks = result.dataList
        this.newTasks.forEach((item) => {
          if (item.taskAssignee.split(',').indexOf(this.userInfo.account) !== -1) {
            item.newTaskId = item.taskId.split(',')[item.taskAssignee.split(',').indexOf(this.userInfo.account)]
          } else {
            item.trackList[item.trackList.length - 1].candidateUsers.forEach((item1) => {
              if (item1.candidateUsers.indexOf(this.userInfo.account) !== -1) {
                item.newTaskId = item1.taskId
              }
            })
          }
        })
        this.getData.total = +result.count
      } catch (error) {
        this.newTasks = []
      }
    },
    async fetchAmount() {
      try {
        const { errorInfo, result } = await postTaskCountStatistics({
          assignee: this.userInfo.account,
          business: this.getData.businessCode,
          startTime: this.timeRange[0],
          endTime: this.timeRange[1],
          projectCode: this.getData.projectCode,
          tenantId: this.tenantId,
        })
        if (errorInfo.errorCode) {
          this.$message.error(errorInfo.errorMessage)
          return
        }
        this.amount = result
      } catch (error) {}
    },
    showDeployDiologButton(row) {
      let rolePeopleList = []
      row.trackList[row.trackList.length - 1].candidateUsers.forEach((item) => {
        item.candidateUsers.forEach((item1) => {
          rolePeopleList.push(item1)
        })
      })
      return rolePeopleList.concat(row.taskAssignee.split(',')).indexOf(this.userInfo.account) !== -1
    },
    handleSizeChange() {
      this.fetchNewTasks()
    },
    handleCurrentChange() {
      this.fetchNewTasks()
    },
    deployDiolog(row) {
      this.runtimeImplementVisible = true
      this.$nextTick(() => {
        this.$refs.runTimeImplement.getNachList(row.trackList)
        this.$refs.runTimeImplement.$refs.ProcessInformation.createNewDiagram(row.content, row.taskKey)
        this.$refs.runTimeImplement.$refs.ProcessInformation.postData = row
        this.$refs.runTimeImplement.$refs.ProcessInformation.postData.deployName = row.processName
        this.$refs.runTimeImplement.$refs.ProcessInformation.postData.version = row.starter
        this.$refs.runTimeImplement.$refs.ProcessInformation.postData.createTime = row.startTime
        this.$refs.runTimeImplement.$refs.ProcessInformation.postData.systemType = row.energyType
        this.$refs.runTimeImplement.dataList.Hang = row.taskStatus.split(',').indexOf('hang') == '-1'
        if (!this.$refs.runTimeImplement.dataList.Hang) {
          this.$refs.runTimeImplement.functionCheck = 'Hang'
        }
      })
    },
    closeDialogImplement() {
      this.runtimeImplementVisible = false
    },
    succseeAdd() {
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
        this.$refs.lookover.$refs.ProcessInformation.postData.systemType = row.energyType
        this.$refs.lookover.getListData(row.trackList)
        this.$refs.lookover.$refs.ProcessInformation.createNewDiagram(row.content, row.taskKey)
      })
    },
    onAddTicket() {
      if (!this.getData.projectCode) {
        this.$message.error('请选择项目')
        return
      }
      this.runtimeAddVisible = true
    },
    closeDialogAdd() {
      this.runtimeAddVisible = false
    },
    taskSuccess() {
      this.runtimeImplementVisible = false
      this.fetchNewTasks()
    },
    getAllApi() {
      this.fetchDataNumber()
      this.fetchNewTasks()
      this.fetchAmount()
    },
    async fetchDataNumber() {
      getTaskCountStatistic({
        ascription: this.getData.projectCode,
        assignee: this.userInfo.account,
        business: this.getData.businessCode,
        startTime: this.timeRange[0],
        endTime: this.timeRange[1],
        tenantId: this.tenantId,
      }).then((res) => {
        if (res) {
          this.numberList = res.result
        } else {
          this.numberList = {
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
