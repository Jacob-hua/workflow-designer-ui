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
        <el-table-column prop="name"
                         label="名称"
                         width="180"
                         align="center">
        </el-table-column>
        <el-table-column prop="docName"
                         label="流程文件"
                         align="center">
          <template slot-scope="scope">
            <span class="fileStyle">{{ scope.row.name + '.bpmn' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createBy"
                         label="创建人"
                         align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.createBy == -1 ? '系统' : scope.row.createBy }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime"
                         label="创建时间"
                         align="center">
        </el-table-column>
        <el-table-column prop="count"
                         label="已部署次数"
                         align="center">
        </el-table-column>
        <el-table-column label="操作"
                         align="center">
          <template slot-scope="scope">
            <el-button @click.native.prevent="deployDiolog(scope.row)"
                       type="text"
                       size="small"
                       class="button1"
                       v-role="{ id: 'HomeDeploy', type: 'button', business: business }">
              部署
            </el-button>
            <el-button @click.native.prevent="detailsDiolog(scope.row)"
                       type="text"
                       size="small"
                       v-role="{ id: 'HomeLook', type: 'button', business: business }">
              查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="home-table-page">
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="getData.page"
                     :page-size="getData.limit"
                     layout="prev, pager, next, jumper"
                     :total="getData.total">
      </el-pagination>
    </div>
    <deploy ref="deploy"
            :editData="editData"
            @addWorkSuccess="getManyData()"
            dataType="enabled"
            :ascription="ascription"
            :business="business"
            @addDraftSuccess="getManyData()"></deploy>
    <detailsBnpm ref="detailsBnpm"
                 :ascription="ascription"
                 :business="business"
                 @deleteSuccess="getTableData()"></detailsBnpm>
  </div>
</template>

<script>
import deploy from './deploy.vue'
import detailsBnpm from './details.vue'
import { postProcessDesignServicePage } from '@/api/unit/api.js'
import { mapState, mapActions } from 'vuex'


export default {
  props: {
    valueDate: {
      default: [],
    },
    ascription: {
      type: String,
      default: '',
    },
    business: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      getData: {
        page: 1,
        limit: 10,
        total: 100,
        tenantId: '',
        ascription: '',
        business: '',
        startTime: '',
        endTime: '',
        status: 'enabled',
        createBy: '',
      },
      tableData: [],
      editData: {},
    }
  },
  computed: {
    ...mapState('account', ['userInfo', 'tenantId']),
  },
  methods: {
    ...mapActions('config', ['dispatchRefreshOrganization']),
    getTableData() {
      postProcessDesignServicePage({
        ...this.getData,
        tenantId: this.tenantId,
        createBy: this.userInfo.account,
        startTime: this.valueDate[0],
        endTime: this.valueDate[1],
        business: this.business.at(-1),
        ascription: this.ascription,
      }).then((res) => {
        this.tableData = res.result.list
        this.getData.total = res.result.total
        this.$emit('totalChange', res.result.total, 'WorkflowTableNum')
      })
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.getData.limit = val
      this.getTableData()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.getData.page = val
      this.getTableData()
    },
    deleteRow() {},
    getManyData() {
      this.$emit('getManyData')
    },
    deployDiolog(row) {
      this.editData = JSON.parse(JSON.stringify(row))
      this.$refs.deploy.dialogVisible1 = true
      this.$refs.deploy.firstData.ascription = row.ascription
      this.$refs.deploy.firstData.business = row.business.at(-1)
      this.$refs.deploy.changeOptions()
      this.$refs.deploy.firstData.id = row.id
    },
    detailsDiolog(item) {
      this.$refs.detailsBnpm.dialogVisible1 = true
      this.$nextTick(() => {
        this.$refs.detailsBnpm.$refs.details1.postData = JSON.parse(
          JSON.stringify(item)
        )
        this.$refs.detailsBnpm.$refs.details1.postData.deployName =
          this.$refs.detailsBnpm.$refs.details1.postData.name
        this.$refs.detailsBnpm.$refs.details1.createNewDiagram(item.content)
        this.$refs.detailsBnpm.getDetailList()
      })
    },
  },
  created() {
    // this.getTableData()
    this.dispatchRefreshOrganization()
  },
  components: {
    deploy,
    detailsBnpm,
  },
}
</script>

<style scoped="scoped">
.home-table-main {
  padding: 10px;
  border: 1px solid #666666;
}

.fileStyle {
  color: #007edb;
}

::v-deep .el-table .el-table__cell {
  padding: 8px 0px;
}

::v-deep .el-table th.el-table__cell {
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
