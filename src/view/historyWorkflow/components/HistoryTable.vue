<template>
  <div>
    <div class="home-table-main">
      <el-table :data="tableData"
                style="width: 100%">
        <el-table-column type="index"
                         label="序号"
                         width="180"
                         align="center">
        </el-table-column>
        <el-table-column prop="processInstanceName"
                         label="名称"
                         width="180"
                         align="center">
        </el-table-column>
        <el-table-column prop="energyTypeName"
                         label="部署类型"
                         align="center">
        </el-table-column>
        <el-table-column prop="docName"
                         label="执行厂站"
                         align="center">
        </el-table-column>
        <el-table-column prop="startUser"
                         label="发起人"
                         align="center">
        </el-table-column>
        <el-table-column prop="startTime"
                         label="发起时间"
                         align="center">
        </el-table-column>
        <el-table-column prop="createTime"
                         label="执行人"
                         align="center">
          <template slot-scope="scope">
            <span v-for=" (item,index) in scope.row.assigneeList"
                  :key="index"> {{ item }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作"
                         align="center">
          <template slot-scope="scope">
            <el-button @click.native.prevent="$emit('showDetail', scope.row)"
                       type="text"
                       size="small"
                       v-role="{ id: 'HistoryLook', type: 'button', business: projectValue }">
              查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="home-table-page">
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="pageInfo.page"
                     :page-size="pageInfo.limit"
                     layout="prev, pager, next, jumper"
                     :total="pageInfo.total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import {historyTaskList} from '@/api/historyWorkflow'
import CONSTANT from '@/constant'
import {mapState} from 'vuex'
import {getAllBusinessConfig} from "@/api/globalConfig";

export default {
  props: {},
  data() {
    return {
      dateRang: ['2022-01-01', '2022-12-31'],
      radio: '1',
      tableData: [],
      projectValue: '',
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
      immediate: true,
      handler(newValue, oldValue) {
        this.getHistoryTaskList(newValue)
      },
    },
  },
  methods: {
    async getHistoryTaskList(pageInfo) {
      Promise.all([await historyTaskList({
        assignee: this.userInfo.account, // 执行人
        candidate: true, // 是否包含候选
        endTime: `${this.dateRang[1]} 23:59:59`, // 结束时间
        ...pageInfo,
        order: 'desc', // 排序方式
        startTime: `${this.dateRang[0]} 00:00:00`, // 起始时间
        tenantId: this.tenantId, // 租户id
      }),
        await getAllBusinessConfig({tenantId: this.tenantId})
      ]).then(res => {
        this.tableData = res[0].result.dataList
        this.tableData.forEach(table => {
          res[1].result.forEach(item => {
            if (table.businessMap.business === item.code) {
              table.energyTypeName = item.name
            }
          })
        })
        this.pageInfo.total = +data.result.count
      })
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.pageInfo.limit = val
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.pageInfo.page = val
    },
  },
}
</script>

<style scoped>
.his_checkbox {
  margin: 30px 0;
}

.history_date {
  margin-left: 20px;
}

.his_checkbox {
  display: flex;
}

.taskNO {
  font-size: 24px;
  color: #000;
  font-weight: 400;
  font-style: normal;
}

.taskTit {
  font-size: 14px;
  color: #000;
  font-weight: 400;
  font-style: normal;
}

.home-table-main {
  padding: 10px;
  border: 1px solid #666666;
}

.fileStyle {
  color: #007edb;
}

/deep/ .el-table .el-table__cell {
  padding: 8px 0px;
}

/deep/ .el-table th.el-table__cell {
  padding: 16px 0px;
  background-color: #f5f7f9;
}

.home-table-page {
  text-align: right;
  padding: 20px 0px;
}

.button1 {
  margin-right: 50px;
}
</style>
