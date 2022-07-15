<template>
  <div>
    <div class="search-wrapper">
      <el-form :model="searchForm" inline>
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
            :options="rootOrganizationChildrenAndAll(searchForm.ascription)"
            :props="cascaderProps"
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
            value-format="yyyy-MM-dd hh:mm:ss"
            :default-time="['00:00:00', '23:59:59']"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
    </div>
    <div class="statistics-wrapper">
      <div>
        <div class="data-wrapper">
          <div class="icon">
            <img :src="require('../../assets/image/history/total-month.svg')" />
          </div>
          <div class="title">{{ headerNum.currentMonthAccumulateProcessCount }}</div>
          <div class="label">当月累计工作流</div>
        </div>
        <div class="data-wrapper">
          <div class="icon">
            <img :src="require('../../assets/image/history/completed-month.svg')" />
          </div>
          <div class="title">{{ headerNum.currentMonthCompleteProcessCount }}</div>
          <div class="label">当月完成工作流</div>
        </div>
        <div class="data-wrapper">
          <div class="icon">
            <img :src="require('../../assets/image/history/online-month.svg')" />
          </div>
          <div class="title">{{ headerNum.currentMonthAvgTime }}</div>
          <div class="label">当月平均完成时长</div>
        </div>
      </div>
      <div>
        <div class="data-wrapper">
          <div class="icon">
            <img :src="require('../../assets/image/history/total-day.svg')" />
          </div>
          <div class="title">{{ headerNum.currentDayAccumulateProcessCount }}</div>
          <div class="label">当日累计工作流</div>
        </div>
        <div class="data-wrapper">
          <div class="icon">
            <img :src="require('../../assets/image/history/completed-day.svg')" />
          </div>
          <div class="title">{{ headerNum.currentDayCompleteProcessCount }}</div>
          <div class="label">当日完成工作流</div>
        </div>
        <div class="data-wrapper">
          <div class="icon">
            <img :src="require('../../assets/image/history/online-day.svg')" />
          </div>
          <div class="title">{{ headerNum.currentDayAvgTime }}</div>
          <div class="label">当日平均完成时长</div>
        </div>
      </div>
    </div>
    <div class="content-wrapper">
      <el-table :data="tableData">
        <el-table-column type="index" label="序号" width="180"> </el-table-column>
        <el-table-column prop="processDeployName" label="名称" width="180"> </el-table-column>
        <el-table-column prop="displayProcessDeployType" label="部署类型"> </el-table-column>
        <el-table-column prop="starter" label="发起人"> </el-table-column>
        <el-table-column prop="startTime" label="发起时间"> </el-table-column>
        <el-table-column prop="displayAssignee" label="执行人"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              @click="onClickDetail(scope.row)"
              type="text"
              v-role="{ id: 'HistoryLook', type: 'button', business: searchForm.ascription }"
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
    <lookover v-if="lookoverVisible" :visible.sync="lookoverVisible" :processInstanceId="processInstanceId" />
  </div>
</template>
<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import { currentOneMonthAgo } from '@/util/date'
import { listHistoryTask, postHistoryProcessCountStatistic } from '@/api/historyWorkflow.js'
import { getAllBusinessConfig } from '@/api/globalConfig'
import Lookover from '@/view/runtime/component/lookover.vue'

export default {
  name: 'HistoryWorkflow',
  components: {
    Lookover,
  },
  data() {
    const { start, end } = currentOneMonthAgo('yyyy-MM-DD HH:mm:ss')
    return {
      searchForm: {
        valueDate: [start, end],
        ascription: '',
        business: '',
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
        this.getHistoryTaskList(this.pageInfo)
        this.getHeaderNum()
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
    this.dispatchRefreshOrganization()
  },
  methods: {
    ...mapMutations('account', ['updateCurrentOrganization']),
    ...mapActions('config', ['dispatchRefreshOrganization']),
    onPageSizeChange(val) {
      this.pageInfo.limit = val
    },
    onPageChange(val) {
      this.pageInfo.page = val
    },
    onClickDetail(row) {
      this.lookoverVisible = true
      this.processInstanceId = row.processInstanceId
    },
    getHeaderNum() {
      postHistoryProcessCountStatistic({
        assignee: this.userInfo.account,
        ascription: this.searchForm.ascription,
        business: this.searchForm.business,
        startTime: this.searchForm.valueDate[0],
        endTime: this.searchForm.valueDate[1],
        tenantId: this.tenantId,
      }).then((res) => {
        this.headerNum = res.result
      })
    },
    async getHistoryTaskList(pageInfo) {
      const [{ errorInfo, result }] = await Promise.all([
        await listHistoryTask({
          ascription: this.searchForm.ascription,
          assignee: this.userInfo.account, // 执行人
          business: this.searchForm.business,
          endTime: this.searchForm.valueDate[1], // 结束时间
          startTime: this.searchForm.valueDate[0], // 起始时间
          order: 'desc', // 排序方式
          ...pageInfo,
          tenantId: this.tenantId, // 租户id
        }),
        await getAllBusinessConfig({ tenantId: this.tenantId }),
      ])
      if (errorInfo.errorCode) {
        this.$message.error(errorInfo.erroMsg)
        return
      }
      this.tableData = result.dataList.map((row) => {
        const displayAssignee = row.assigneeList?.join('') ?? ''
        return {
          ...row,
          displayProcessDeployType: this.$getMappingName(row.processDeployType),
          displayAssignee,
        }
      })
      this.pageInfo.total = +result.count
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
