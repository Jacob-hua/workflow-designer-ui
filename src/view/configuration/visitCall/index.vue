<template>
  <div>
    <div class="home-table-main">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="index" label="序号" width="180" align="center">
        </el-table-column>
        <el-table-column
          prop="source"
          label="资源类型"
          width="180"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="sourceMark"
          label="资源标识"
          width="180"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="apiCount" label="API数量" align="center">
        </el-table-column>
        <el-table-column prop="createBy" label="创建人" align="center">
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center">
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="showAddOrEidtDailog(scope.row)"
              type="text"
              size="small"
              v-role="{
                id: 'VisitCallEdit',
                type: 'button',
                business: business,
              }"
            >
              编辑
            </el-button>
            <!-- TODO: id: 权限名，type: 权限类型， business：项目归属 -->
            <el-button
              @click.native.prevent="showDetail(scope.row)"
              type="text"
              size="small"
              v-role="{
                id: 'VisitCallLook',
                type: 'button',
                business: business,
              }"
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
        :current-page.sync="pageInfo.page"
        :page-size.sync="pageInfo.limit"
        layout="prev, pager, next, jumper"
        :total="pageInfo.total"
      >
      </el-pagination>
    </div>
    <Guide ref="guide" :business="business" @showAddDialog="showAddDialog" />
    <AddOrEidtDailog
      ref="AddOrEidtDailog"
      v-if="addConfig"
      :business="business"
      :type="type"
      @showAddOrEidtDailog="showAddOrEidtDailog"
      @refreshList = "GetGlobalList"
      :visible.sync="addConfig"
      :guideForm="guideForm"
    />
    <Detail
      @showAddOrEidtDailog="showAddOrEidtDailog"
      v-if="DetailFlag"
      :currentRow="currentRow"
      ref="detail"
    />
  </div>
</template>

<script>
import Guide from "@/view/configuration/visitCall/Guide";
import AddOrEidtDailog from "@/view/configuration/visitCall/AddOrEidtDailog";
import Detail from "@/view/configuration/visitCall/Detail";
import { mapState } from "vuex";
import { apiDetail, GetGlobalList } from "@/api/globalConfig";
import CONSTANT from "@/constant";
import ApiEnum from "@/enum/ApiTypeEnum";
export default {
  components: {
    Guide,
    AddOrEidtDailog,
    Detail,
  },
  props: {
    business: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      currentRow: [],
      DetailFlag: false,
      guideForm: {},
      addConfig: false,
      dateRang: ["2022-01-01", "2022-12-31"],
      radio: "1",
      type: "",
      tableData: [],
      pageInfo: {
        [CONSTANT.PAGE]: 1,
        [CONSTANT.LIMIT]: 10,
        [CONSTANT.TOTAL]: 0,
      },
    };
  },
  computed: {
    ...mapState("account", ["userInfo", "tenantId"]),
  },
  mounted() {},
  methods: {
    showDetail(row) {
      this.DetailFlag = false;
      apiDetail({
        source: row.source,
        sourceMark: row.sourceMark,
        tenantId: this.tenantId,
      }).then((res) => {
        res.result.forEach((api) => {
          api.configParams = [];
          if (api.method === ApiEnum.API_TYPE_POST) {
            let body = JSON.parse(api.body);
            for (const element in body) {
              let obj = { };
              obj.key = element;
              obj.value = body[element];
              api.configParams?.push(obj);
            }
          } else {
            let obj = {};
            if (api.parameter) {
              let parArr = api.parameter?.split("?");
              if (!api.parameter.includes("&")) {
                api.configParams?.push({
                  key: parArr[1]?.split("=")[0],
                  value: parArr[1]?.split("=")[1],
                });
              } else {
                let entry = parArr[1]?.split("&");
                for (const val of entry) {
                  api.configParams?.push({
                    key: val?.split("=")[0],
                    value: val?.split("=")[1],
                  });
                }
              }
            }
          }
          api.parseParams = [];
          if (api.dataParse) {
            let dataParse = JSON.parse(api.dataParse);
            Object.keys(dataParse).forEach((keys) => {
              let obj = { };
              obj.key = keys;
              obj.value = dataParse[keys];
              api.parseParams?.push(obj);
            });
          }
        });
        this.DetailFlag = true;
        this.$nextTick(() => {
          this.$refs.detail.dialogVisible = true;
          this.$refs.detail.editableTabsValue = "0";
        });
        this.currentRow = res.result;
      });
    },
    apiDetail(params) {
      apiDetail(params).then((res) => {
        this.$refs.AddOrEidtDailog.jsonData = {};
        res.result.forEach((api) => {
          api.configParams = [];
          if (api.method === ApiEnum.API_TYPE_POST) {
            let obj = {};
            let body = JSON.parse(api.body);
            let bodyArr = Object.keys(body);
            for (const keys of bodyArr) {
              api.configParams?.push({
                key: keys,
                value: body[keys],
              });
            }
          } else {
            let obj = { };
            let parArr = api.parameter?.split("?");
            if (!api.parameter.includes("&") && parArr[1]) {
              api.configParams?.push({
                key: parArr[1]?.split("=")[0],
                value: parArr[1]?.split("=")[1],
              });
            } else {
              let entry = parArr[1]?.split("&");
              if (entry) {
                for (const val of entry) {
                  api.configParams?.push({
                    key: val?.split("=")[0],
                    value: val?.split("=")[1],
                  });
                }
              }
            }
          }
          api.parseParams = [];
          let obj = {  };
          if (api.dataParse) {
            let dataParse = JSON.parse(api.dataParse);
            let dataArr = Object.keys(dataParse);
            for (const keys of dataArr) {
              api.parseParams?.push({
                key: keys,
                value: dataParse[keys],
              });
            }
          }
        });
        this.$refs.AddOrEidtDailog.apiBoxList = res.result;
      });
    },
    showAddOrEidtDailog(row, code) {
      this.type = code
      if (code === "pre") {
        this.addConfig = true
      } else if (code === "detail") {
        this.guideForm = row;
        this.addConfig = true
      } else if (code === "edit") {
        this.addConfig = true
        this.$nextTick(() => {
          this.$refs.AddOrEidtDailog.apiBoxList = row;
        })
      } else {
        Object.keys(row).length
          ? ((this.addConfig = true),
            this.$nextTick(() => {
                this.apiDetail({
                  source: row.source,
                  sourceMark: row.sourceMark,
                  tenantId: this.tenantId,
                });
            }))
          : (this.addConfig = true);
      }
    },
    showAddDialog(form) {
      this.addConfig = true
      this.guideForm = form;
    },
    async GetGlobalList(business) {
      let data = await GetGlobalList({
        ...this.pageInfo,
        tenantId: this.tenantId, // 租户id
        ascription: business,
      });
      if (data.result) {
        this.tableData = data.result.dataList;
        this.pageInfo.total = +data.result.count;
      }
    },
    handleSizeChange(val) {
      this.pageInfo.limit = val;
      this.GetGlobalList(this.business);
    },
    handleCurrentChange(val) {
      this.pageInfo.page = val;
      this.GetGlobalList(this.business);
    },
  },
};
</script>

<style scoped lang="scss">
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
  font-style: normal;
}

.fileStyle {
  color: #007edb;
}
.home-table-page {
  text-align: right;
  padding: 20px 0px;
}

.button1 {
  margin-right: 50px;
}
</style>
