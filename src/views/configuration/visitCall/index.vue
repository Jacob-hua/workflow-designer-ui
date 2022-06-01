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
            <el-button @click.native.prevent="showAddOrEidtDailog(scope.row)" type="text" size="small" v-role="{ id: 'VisitCallEdit', type: 'button', business: business }">
              编辑
            </el-button>
            <el-button @click.native.prevent="showDetail(scope.row)" type="text" size="small" v-role="{ id: 'VisitCallLook', type: 'button', business: business }">
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
        v-if="DetailFlag"
        :currentRow="currentRow"
        ref="detail"/>
  </div>
</template>

<script>

import Guide from "@/views/configuration/visitCall/Guide";
import AddOrEidtDailog from "@/views/configuration/visitCall/AddOrEidtDailog";
import Detail from "@/views/configuration/visitCall/Detail";
import {
  apiDetail,
  GetGlobalList
} from "@/api/globalConfig";
export default {
  components: {
    Guide,
    AddOrEidtDailog,
    Detail
  },
  props: {},
  data() {
    return {
      currentRow: [],
      DetailFlag: false,
      guideForm: {},
      AddOrEidtDailogFlag: false,
      dateRang: ["2022-01-01","2022-12-31"],
      radio: '1',
      business: '',
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
      apiDetail({
        source: row.source,
        sourceMark: row.sourceMark,
        tenantId: this.$store.state.tenantId
      }).then((res)=> {
        res.result.forEach(api => {
          api.configParams = []
          if (api.method === 'POST') {
            let obj= {key: '', value: ''}
            let body = JSON.parse(api.body)
            Object.keys(body).forEach(keys => {
              obj.key = keys
              obj.value = body[keys]
              api.configParams.push(obj)
            })
          } else {
            //?scope=103&&format=json&&appid=379020&&bk_key=关键字&&bk_length=600
            let obj= {key: '', value: ''}
            if(api.parameter) {
              let parArr = api.parameter.split('?')
              if (!api.parameter.includes('&')) {
                api.configParams.push({
                  key: parArr[1].split('=')[0],
                  value: parArr[1].split('=')[1]
                })
              } else {
                let entry = parArr[1].split("&")
                for (const val of entry) {
                  api.configParams.push({
                    key:val.split('=')[0],
                    value: val.split('=')[1]
                  })
                }
              }
            }
          }
          api.parseParams = []
          let obj= {key: '', value: ''}
          let dataParse = JSON.parse(api.dataParse)
          Object.keys(dataParse).forEach(keys => {
            obj.key = keys
            obj.value = dataParse[keys]
          })

          api.parseParams.push(obj)
        })
        this.DetailFlag = true
        this.$nextTick(() => {
          this.$refs.detail.dialogVisible = true
          this.$refs.detail.editableTabsValue = "0"
        })
        this.currentRow = res.result
      })
    },
    apiDetail(params) {
      apiDetail(params).then((res)=> {
        console.log(res)
        res.result.forEach(api => {
          api.configParams = []
          if (api.method === 'POST') {
            let obj= {key: '', value: ''}
            let body = JSON.parse(api.body)
            let bodyArr = Object.keys(body)
            for (const keys of bodyArr) {
              api.configParams.push({
                key: keys,
                value: bodyArr[keys]
              })
            }

          } else {
            //?scope=103&&format=json&&appid=379020&&bk_key=关键字&&bk_length=600
            let obj= {key: '', value: ''}
            let parArr = api.parameter.split('?')
            if (!api.parameter.includes('&')) {
              api.configParams.push({
                key: parArr[1].split('=')[0],
                value: parArr[1].split('=')[1]
              })
            } else {
              let entry = parArr[1].split("&")
              for (const val of entry) {
                api.configParams.push({
                  key:val.split('=')[0],
                  value: val.split('=')[1]
                })
              }
            }
          }
          api.parseParams = []
          let obj= {key: '', value: ''}
          let dataParse = JSON.parse(api.dataParse)
           let dataArr = Object.keys(dataParse)
          for (const keys of dataArr) {
            api.parseParams.push({
              key: keys,
              value: dataParse[keys]
            })
          }
        })
        this.$refs.AddOrEidtDailog.apiBoxList = res.result
      })
    },
    showAddOrEidtDailog(row, code){
      console.log('222222222222',row)
      if (code === 'pre') {
        this.$refs.guide.dialogVisible = true
      }  else if(code === 'detail') {
        this.AddOrEidtDailogFlag = true
        this.guideForm = row
        this.$nextTick(() => {
          this.$refs.AddOrEidtDailog.dialogVisible = true
        });
      } else if (code==='edit') {
        this.AddOrEidtDailogFlag = true,
            this.$nextTick(() => {
              this.$refs.AddOrEidtDailog.dialogVisible = true
              this.$refs.AddOrEidtDailog.apiBoxList = row
            })

      } else  {
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
      }
    },
    showAddDialog(form) {
      this.AddOrEidtDailogFlag = true
      this.guideForm = form
      this.$nextTick(() => {
        this.$refs.AddOrEidtDailog.dialogVisible = true
        this.$refs.AddOrEidtDailog.apiBoxList =[
          {
            // source: '', //系统名称
            // sourceMark: '', // 系统标识
            ...form,
            name: '', //api名称
            apiMark: '', // api标识
            type: '', // api类型,
            typeName: '', //api类型名称
            host: '',// 系统host
            path: '',// 请求路径
            method: '', //请求方式
            headers: '', //请求头信息
            parameter: '', // GET请求参数 eg: ?id=${id}&&name=${name}
            body: '', //POST请求参数 eg: {\"id\":\"${id}\",\"name\":\"${name}\"}
            dataParse: '', //解析配置
            isUse: 1, // 是否使用 1 使用 0禁用 2删除
            createTime: '', //创建时间
            createBy: this.$store.state.userInfo.name, //创建人
            tenantId: +this.$store.state.tenantId, //租户id
            configParams: [
              {
                key: '',
                value: ''
              }
            ],
            parseParams: [
              {
                key: '',
                value: ''
              }
            ]
          }
        ]
      })
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
