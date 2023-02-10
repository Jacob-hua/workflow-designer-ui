<template>
  <div>
    <div class="search-wrapper">
      <el-form :model="searchForm" inline>
        <el-form-item label="项目" style="display: none">
          <el-select v-model="searchForm.ascription">
            <el-option
              v-for="{ id, label, value } in rootOrganizations"
              :key="id"
              :label="label"
              :value="value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工单类型">
          <el-select v-model="searchForm.processDeployName">
            <el-option
              v-for="({ label, value }, index) in deployNameList"
              :key="index"
              :label="label"
              :value="value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="能源系统">
          <el-cascader
            v-model="searchForm.business"
            :options="rootOrganizationChildrenAndAll(searchForm.ascription)"
            :props="cascaderProps"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="时间选择">
          <el-date-picker
            v-model="searchForm.valueDate"
            :clearable="false"
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
        </el-form-item>
      </el-form>
    </div>
    <div class="statistics-wrapper">
      <div v-for="(cardData, index) in statisticCards" :key="index">
        <div class="data-wrapper" v-for="({ label, value, icon }, index) in cardData" :key="index">
          <div class="icon">
            <img :src="icon" />
          </div>
          <div class="title">{{ value }}</div>
          <div class="label">{{ label }}</div>
        </div>
      </div>
    </div>
    <div class="content-wrapper">
      <el-table :data="tableData">
        <el-table-column type="index" label="序号" width="180"> </el-table-column>
        <el-table-column prop="workOrderName" label="工单名称" show-overflow-tooltip="" />
        <el-table-column prop="processDeployName" label="工单类型" width="180"> </el-table-column>
        <el-table-column prop="displayProcessDeployType" label="能源系统"> </el-table-column>
        <el-table-column prop="starter" label="创建人"> </el-table-column>
        <el-table-column prop="startTime" label="创建时间"> </el-table-column>
        <!-- <el-table-column prop="displayAssignee" label="操作人"> </el-table-column> -->
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              @click="onClickDetail(scope.row)"
              type="text"
              v-role="{
                id: 'HistoryLook',
                type: 'button',
                business: searchForm.ascription,
              }"
            >
              查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="onPageSizeChange"
        @current-change="onPageChange"
        :current-page="pageInfo.page"
        :page-size="pageInfo.limit"
        layout="prev, pager, next, jumper"
        :total="pageInfo.total"
      >
      </el-pagination>
    </div>
    <lookover
      v-if="lookoverVisible"
      :detailFunc="getHistoryTaskDetail"
      :visible.sync="lookoverVisible"
      :processInstanceId="processInstanceId"
    />
  </div>
</template>
<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import { currentOneMonthAgo } from '@/util/date'
import { getHistoryTaskDetail, listHistoryTask, postHistoryProcessCountStatistic } from '@/api/historyWorkflow.js'
import { getAllBusinessConfig } from '@/api/globalConfig'
import { getDeployNameList } from '@/api/unit/api.js'
import Lookover from '@/view/runtime/component/lookover.vue'

export default {
  name: 'HistoryWorkflow',
  components: {
    Lookover,
  },
  data() {
    const { start, end } = currentOneMonthAgo('yyyy-MM-DD HH:mm:ss')
    return {
      deployNameList: [],
      searchForm: {
        valueDate: [start, end],
        ascription: '',
        business: '',
        processDeployName: null,
      },
      headerNum: {
        currentDayAccumulateProcessCount: 0,
        currentDayAvgTime: '0时0分',
        currentDayCompleteProcessCount: 0,
        currentMonthAccumulateProcessCount: 0,
        currentMonthAvgTime: '0时0分',
        currentMonthCompleteProcessCount: 0,
      },
      lookoverVisible: false,
      processInstanceId: '',
      tableData: [],
      pageInfo: {
        page: 1,
        limit: 10,
        total: 0,
      },
    }
  },
  computed: {
    ...mapState('account', ['tenantId', 'userInfo', 'currentOrganization']),
    ...mapState('uiConfig', ['cascaderProps']),
    ...mapGetters('config', ['rootOrganizations', 'rootOrganizationChildrenAndAll']),
    statisticCards() {
      const currentMonthStatistic = [
        {
          label: '当月累计工作流',
          value: this.headerNum.currentMonthAccumulateProcessCount,
          icon: require('../../assets/image/history/total-month.svg'),
        },
        {
          label: '当月完成工作流',
          value: this.headerNum.currentMonthCompleteProcessCount,
          icon: require('../../assets/image/history/completed-month.svg'),
        },
        {
          label: '当月平均完成时长',
          value: this.headerNum.currentMonthAvgTime,
          icon: require('../../assets/image/history/online-month.svg'),
        },
      ]
      const currentDayStatistic = [
        {
          label: '当日累计工作流',
          value: this.headerNum.currentDayAccumulateProcessCount,
          icon: require('../../assets/image/history/total-day.svg'),
        },
        {
          label: '当日完成工作流',
          value: this.headerNum.currentDayCompleteProcessCount,
          icon: require('../../assets/image/history/completed-day.svg'),
        },
        {
          label: '当日平均完成时长',
          value: this.headerNum.currentDayAvgTime,
          icon: require('../../assets/image/history/online-day.svg'),
        },
      ]
      return [currentMonthStatistic, currentDayStatistic]
    },
  },
  watch: {
    'searchForm.ascription'(val) {
      if (val === this.currentOrganization) {
        return
      }
      this.updateCurrentOrganization({ currentOrganization: val })
    },
    searchForm: {
      deep: true,
      handler() {
        this.pageInfo.page = 1
        this.fetchHistoryTasks(this.pageInfo)
        this.fetchHistoryStatistic()
      },
    },
    currentOrganization: {
      immediate: true,
      handler(val) {
        this.searchForm.ascription = val
      },
    },
  },
  mounted() {
    this.fetchDeployNameList()
    this.dispatchRefreshOrganization()
  },
  methods: {
    ...mapMutations('account', ['updateCurrentOrganization']),
    ...mapActions('config', ['dispatchRefreshOrganization']),
    async getHistoryTaskDetail(processInstanceId, assignee) {
      const { errorInfo, result } = await getHistoryTaskDetail({
        processInstanceId,
        assignee,
      })
      if (errorInfo.errorCode) {
        return
      }
      return result
    },
    onPageSizeChange(val) {
      this.pageInfo.limit = val
      this.fetchHistoryTasks(this.pageInfo)
      this.fetchHistoryStatistic()
    },
    onPageChange(val) {
      this.pageInfo.page = val
      this.fetchHistoryTasks(this.pageInfo)
      this.fetchHistoryStatistic()
    },
    onClickDetail(row) {
      this.lookoverVisible = true
      this.processInstanceId = row.processInstanceId
    },
    async fetchHistoryStatistic() {
      const { ascription, business } = this.searchForm
      const { errorInfo, result } = await postHistoryProcessCountStatistic({
        assignee: this.userInfo.account,
        tenantId: this.tenantId,
        ascription,
        business,
        processDeployName: this.searchForm.processDeployName,
      })
      if (errorInfo.errorCode) {
        this.$message.error(errorInfo.errorMsg)
        return
      }
      this.headerNum = result
    },
    async fetchHistoryTasks(pageInfo) {
      const {
        ascription,
        business,
        valueDate: [startTime, endTime],
      } = this.searchForm
      const [{ errorInfo, result }] = await Promise.all([
        await listHistoryTask({
          ascription,
          assignee: this.userInfo.account, // 执行人
          business,
          endTime, // 结束时间
          startTime, // 起始时间
          order: 'desc', // 排序方式
          ...pageInfo,
          tenantId: this.tenantId, // 租户id
          processDeployName: this.searchForm.processDeployName,
        }),
        await getAllBusinessConfig({ tenantId: this.tenantId }),
      ])
      if (errorInfo.errorCode) {
        this.$message.error(errorInfo.erroMsg)
        return
      }
      if (!result?.dataList) {
        this.tableData = []
        return
      }
      this.tableData = result.dataList.map((row) => {
        const displayAssignee = row.assigneeList?.join(' ') ?? ''
        return {
          ...row,
          displayProcessDeployType: this.$getMappingName(row.processDeployType),
          displayAssignee,
        }
      })
      this.pageInfo.total = +result.count
    },
    async fetchDeployNameList() {
      try {
        const { errorInfo, result } = await getDeployNameList({
          ascriptionCode: this.searchForm.ascription,
          tenantId: this.tenantId,
        })
        if (errorInfo.errorCode) {
          this.$message.error(errorInfo.errorMessage)
          return
        }
        this.deployNameList = result.reduce(
          (deployNameList, deployName) => [
            ...deployNameList,
            {
              label: deployName,
              value: deployName,
            },
          ],
          [
            {
              label: '全部',
              value: null,
            },
          ]
        )
      } catch (error) {}
    },
  },
}
</script>

<style scoped lang="scss">
.search-wrapper {
  height: 106px;
  background-color: $card-bg-color;
  border-radius: 6px;

  @include searchForm;

  .el-form {
    display: flex;
    align-items: center;
    padding: 0 43px;
  }

  .el-form-item {
    margin-bottom: 0;
  }

  .button-wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;

    .search-button {
      @include primaryBtn;
    }
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
      background: #d1ebfb;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    &:first-child {
      margin-right: 20px;
      flex-grow: 1;
    }

    &:last-child {
      margin-left: 20px;
      flex-grow: 1;

      .data-wrapper {
        cursor: pointer;
      }

      .icon {
        background-color: #d4fdd9;
      }
    }
  }
}

.content-wrapper {
  margin-top: 20px;
  background: $card-bg-color;
  padding: 20px;
}

.el-pagination {
  text-align: right;
  padding: 34px 0;
}
</style>
