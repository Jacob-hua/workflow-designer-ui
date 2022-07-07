<template>
  <div class="content-wrapper">
    <el-table :data="tableData">
      <el-table-column type="index" label="序号" width="180" align="center"> </el-table-column>
      <el-table-column prop="processInstanceName" label="名称" width="180" align="center"> </el-table-column>
      <el-table-column prop="energyTypeName" label="部署类型" align="center"> </el-table-column>

      <el-table-column prop="startUser" label="发起人" align="center"> </el-table-column>
      <el-table-column prop="startTime" label="发起时间" align="center"> </el-table-column>
      <el-table-column prop="createTime" label="执行人" align="center">
        <template slot-scope="scope">
          <span v-for="(item, index) in scope.row.assigneeList" :key="index"> {{ item }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            @click.native.prevent="$emit('showDetail', scope.row)"
            type="text"
            size="small"
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
import { historyTaskList } from '@/api/historyWorkflow'
import CONSTANT from '@/constant'
import { mapState } from 'vuex'
import { getAllBusinessConfig } from '@/api/globalConfig'

export default {
  props: {},
  data() {
    return {
      dateRang: ['2022-01-01', '2022-12-31'],
      radio: '1',
      tableData: [],
      projectValue: '',
      business: '',
      pageInfo: {
        [CONSTANT.PAGE]: 1,
        [CONSTANT.LIMIT]: 10,
        [CONSTANT.TOTAL]: 0,
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
      Promise.all([
        await historyTaskList({
          assignee: this.userInfo.account, // 执行人
          candidate: true, // 是否包含候选
          ascription: this.projectValue,
          business: this.business,
          endTime: `${this.dateRang[1]} 23:59:59`, // 结束时间
          ...pageInfo,
          order: 'desc', // 排序方式
          startTime: `${this.dateRang[0]} 00:00:00`, // 起始时间
          tenantId: this.tenantId, // 租户id
        }),
        await getAllBusinessConfig({ tenantId: this.tenantId }),
      ]).then((res) => {
        this.tableData = res[0].result.dataList
        this.pageInfo.total = +res[0].result.count
        this.tableData.forEach((table) => {
          res[1].result.forEach((item) => {
            if (table.businessMap.business === item.code) {
              table.energyTypeName = item.name
            }
          })
        })
      })
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
