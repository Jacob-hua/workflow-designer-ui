<template>
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
            @click.native.prevent="$emit('showDetail', scope.row)"
            type="text"
            v-role="{ id: 'HistoryLook', type: 'button', business: projectValue }"
          >
            查看
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageInfo.page"
      :page-size="pageInfo.limit"
      layout="prev, pager, next, jumper"
      :total="pageInfo.total"
    >
    </el-pagination>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { listHistoryTask } from '@/api/historyWorkflow'
import { getAllBusinessConfig } from '@/api/globalConfig'
import { currentOneMonthAgo } from '@/util/date'

export default {
  props: {},
  data() {
    const { start, end } = currentOneMonthAgo('yyyy-MM-DD HH:mm:ss')
    return {
      dateRang: [start, end],
      radio: '1',
      tableData: [],
      projectValue: '',
      business: '',
      pageInfo: {
        page: 1,
        limit: 10,
        total: 0,
      },
    }
  },
  computed: {
    ...mapState('account', ['userInfo', 'tenantId']),
  },
  watch: {
    pageInfo: {
      deep: true,
      immediate: false,
      handler(newValue) {
        this.getHistoryTaskList(newValue)
      },
    },
  },
  methods: {
    async getHistoryTaskList(pageInfo) {
      const [{ errorInfo, result }] = await Promise.all([
        await listHistoryTask({
          ascription: this.projectValue,
          assignee: this.userInfo.account, // 执行人
          business: this.business,
          endTime: this.dateRang[1], // 结束时间
          startTime: this.dateRang[0], // 起始时间
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
    handleSizeChange(val) {
      this.pageInfo.limit = val
    },
    handleCurrentChange(val) {
      this.pageInfo.page = val
    },
  },
}
</script>

<style scoped lang="scss">
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
