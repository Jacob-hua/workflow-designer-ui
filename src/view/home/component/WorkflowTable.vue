<template>
  <div>
    <div class="home-table-main">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="index" label="序号" width="180" align="center"> </el-table-column>
        <el-table-column prop="name" label="名称" width="180" align="center"> </el-table-column>
        <el-table-column prop="docName" label="流程文件" align="center">
          <template slot-scope="scope">
            <span class="fileStyle">{{ scope.row.docName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createBy" label="创建人" align="center"> </el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center"> </el-table-column>
        <el-table-column prop="count" label="已部署次数" align="center"> </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              @click="onDeploy(scope.row)"
              type="text"
              size="small"
              class="button1"
              v-role="{ id: 'HomeDeploy', type: 'button', business: searchForm.business }"
            >
              部署
            </el-button>
            <el-button
              @click="onDetails(scope.row)"
              type="text"
              size="small"
              v-role="{ id: 'HomeLook', type: 'button', business: searchForm.business }"
            >
              查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="home-table-page">
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
    <deploy-confirmation
      :visible.sync="deployConfirmationVisible"
      :workflow="workflow"
    />
    <deploy
      ref="deploy"
      :editData="workflow"
      @addWorkSuccess="getManyData()"
      dataType="enabled"
      :ascription="searchForm.ascription"
      :business="searchForm.business"
      @addDraftSuccess="getManyData()"
    ></deploy>
    <detailsBnpm
      ref="detailsBnpm"
      :ascription="searchForm.ascription"
      :business="searchForm.business"
      @deleteSuccess="fetchWorkflows()"
    ></detailsBnpm>
  </div>
</template>

<script>
import deploy from './deploy.vue'
import detailsBnpm from './details.vue'
import { postProcessDesignServicePage } from '@/api/unit/api.js'
import { mapState } from 'vuex'
import DeployConfirmation from './DeployConfirmation.vue'

export default {
  components: {
    deploy,
    detailsBnpm,
    DeployConfirmation,
  },
  props: {
    searchForm: {
      type: Object,
      required: true,
      default: () => ({}),
    },
  },
  data() {
    return {
      deployConfirmationVisible: false,
      pageInfo: {
        page: 1,
        limit: 10,
        total: 0,
        status: 'enabled',
      },
      tableData: [],
      workflow: {},
    }
  },
  computed: {
    ...mapState('account', ['userInfo', 'tenantId']),
  },
  methods: {
    async fetchWorkflows() {
      const { errorInfo, result } = await postProcessDesignServicePage({
        ...this.pageInfo,
        tenantId: this.tenantId,
        createBy: this.userInfo.account,
        startTime: this.searchForm.valueDate[0],
        endTime: this.searchForm.valueDate[1],
        business: this.searchForm.business,
        ascription: this.searchForm.ascription,
      })
      if (errorInfo.errorCode) {
        this.$message.error(errorInfo.errorMsg)
        return
      }
      this.tableData = result.list
      this.pageInfo.total = result.total
      this.$emit('totalChange', result.total, 'WorkflowTableNum')
    },
    onPageSizeChange(limit) {
      this.pageInfo.limit = limit
      this.fetchWorkflows()
    },
    onPageChange(page) {
      this.pageInfo.page = page
      this.fetchWorkflows()
    },
    getManyData() {
      this.$emit('getManyData')
    },
    onDeploy(row) {
      this.workflow = { ...row }
      this.deployConfirmationVisible = true
      // this.workflow = JSON.parse(JSON.stringify(row))
      // this.$refs.deploy.dialogVisible1 = true
      // this.$refs.deploy.firstData.ascription = row.ascription
      // this.$refs.deploy.firstData.business = row.business
      // this.$refs.deploy.changeOptions()
      // this.$refs.deploy.firstData.id = row.id
    },
    onDetails(item) {
      this.$refs.detailsBnpm.dialogVisible1 = true
      this.$nextTick(() => {
        this.$refs.detailsBnpm.postData.business = item.business
        this.$refs.detailsBnpm.changeOptions()
        this.$refs.detailsBnpm.$refs.details1.postData = JSON.parse(JSON.stringify(item))
        this.$refs.detailsBnpm.$refs.details1.postData.deployName = this.$refs.detailsBnpm.$refs.details1.postData.name

        this.$refs.detailsBnpm.$refs.details1.createNewDiagram(item.content)
        this.$refs.detailsBnpm.getDetailList()
      })
    },
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
