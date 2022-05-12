<template>
  <div>
    <div class="home-table-main">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="index" label="序号" width="180" align="center">
        </el-table-column>
        <el-table-column prop="source" label="资源类型" width="180" align="center">
        </el-table-column>
        <el-table-column prop="sourceMark" label="资源类型" width="180" align="center">
        </el-table-column>
        <el-table-column prop="apiCount" label="API数量" align="center">
        </el-table-column>
        <el-table-column prop="createBy" label="创建人" align="center">
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center">
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button @click.native.prevent="showAddOrEidtDailog(scope.row)" type="text" size="small" >
              编辑
            </el-button>
            <el-button @click.native.prevent="showDetail(scope.row)" type="text" size="small" >
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
          :current-page="pageInfo.page"
          :page-size="pageInfo.limit"
          layout="prev, pager, next, jumper"
          :total="pageInfo.total">
      </el-pagination>
    </div>
    <Guide
        ref="guide"
        @showAddDialog="showAddDialog"
    />
    <AddOrEidtDailog
      ref="AddOrEidtDailog"
      @showAddOrEidtDailog="showAddOrEidtDailog"
      v-if="AddOrEidtDailogFlag"
      :guideForm="guideForm"
    />
    <Detail
        @showAddOrEidtDailog="showAddOrEidtDailog"
     ref="detail"/>
  </div>
</template>

<script>

import Guide from "@/views/configuration/visitCall/Guide";
import AddOrEidtDailog from "@/views/configuration/visitCall/AddOrEidtDailog";
import Detail from "@/views/configuration/visitCall/Detail";
import {apiDetail, GetGlobalList} from "@/api/globalConfig";
export default {
  components: {
    Guide,
    AddOrEidtDailog,
    Detail
  },
  props: {},
  data() {
    return {
      guideForm: {},
      AddOrEidtDailogFlag: false,
      dateRang: ["2022-01-01","2022-12-31"],
      radio: '1',
      tableData: [
        {
          id: 1,
          processInstanceName: '第三方api'
        }
      ],
      pageInfo: {
        page: 1,
        limit: 10,
        total: 0
      }
    }

  },
  watch: {
    pageInfo:{
      deep: true,
      immediate: true,
      handler(newValue) {
        this.GetGlobalList(newValue)
      }
    }
  },
  methods: {
      showDetail(row) {
        this.$refs.detail.dialogVisible = true
        this.$refs.detail.currentRow = row
      },
    apiDetail(params) {
        apiDetail(params).then((res)=> {
          console.log(res)
          res.result.forEach(api => {
            api.configParams = []
              if (api.methods === 'POST') {
                let obj= {key: '', value: ''}
                Object.keys( JSON.parse(api.body)).forEach(keys => {
                  obj.key = keys
                  obj.value = api.body[keys]
                  api.configParams.push(obj)
                })
              }
          })
          console.log(res.result)
        })
    },
      showAddOrEidtDailog(row, code){
        console.log('222222222222',row)
        if (code) {
          this.$refs.guide.dialogVisible = true
          return
        }
        Object.keys(row).length ?
            (
                this.AddOrEidtDailogFlag = true,
                this.$nextTick(() => {
                      this.$refs.AddOrEidtDailog.dialogVisible = true,
                      this.apiDetail({
                        source: row.source,
                        sourceMark: row.sourceMark,
                        tenantId: this.$store.state.tenantId
                      })
                })
            )
            : this.$refs.guide.dialogVisible = true
      },
      showAddDialog(form) {

        this.AddOrEidtDailogFlag = true
        this.guideForm = form
        this.$nextTick(() => {

          this.$refs.AddOrEidtDailog.dialogVisible = true
        })

          // this.$refs.AddOrEidtDailog.guideForm = form
    },
    async GetGlobalList(pageInfo) {
      let data =  await GetGlobalList({
        ...pageInfo,
        "tenantId": this.$store.state.tenantId // 租户id
      })
      if (data.result) {
        this.tableData =  data.result.dataList
        this.pageInfo.total =  +data.result.count
      }
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageInfo.limit = val
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pageInfo.page = val
    }
  }
}
</script>

<style scoped>
button {
  font-size: 14px;
  margin-left: 10px;
}
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
  font-style: normal
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
