<template>
  <div>
    <el-table :data="tableData" v-loading="loading">
      <el-table-column type="index" label="序号" width="180"> </el-table-column>
      <el-table-column prop="name" label="名称" width="180"> </el-table-column>
      <el-table-column prop="docName" label="流程文件">
        <template slot-scope="scope">
          <span class="fileStyle">{{ scope.row.docName }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createBy" label="创建人"> </el-table-column>
      <el-table-column prop="createTime" label="创建时间"> </el-table-column>
      <el-table-column prop="count" label="已部署次数"> </el-table-column>
      <el-table-column label="操作">
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
    <el-pagination
      @size-change="onPageSizeChange"
      @current-change="onPageChange"
      :current-page="pageInfo.page"
      :page-size="pageInfo.limit"
      layout="prev, pager, next, jumper"
      :total="pageInfo.total"
    >
    </el-pagination>
    <deploy-confirmation
      :visible.sync="deployConfirmationVisible"
      :ascription="workflow.ascription"
      :business="workflow.business"
      @submit="onConfirmationSubmit"
    />
    <deploy-options :visible.sync="deployOptionsVisible" :workflow="workflow" @deployed="onDeployed" @saved="onSaved" />
    <deploy-cabin-detail :visible.sync="deployCabinDetailVisible" :workflow="workflow" @deleted="onDeletedDeploy" />
  </div>
</template>

<script>
import { postProcessDesignServicePage } from '@/api/unit/api.js'
import { mapState } from 'vuex'
import DeployConfirmation from './DeployConfirmation.vue'
import DeployCabinDetail from './DeployCabinDetail.vue'
import DeployOptions from './DeployOptions.vue'

export default {
  components: {
    DeployConfirmation,
    DeployCabinDetail,
    DeployOptions,
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
      loading: false,
      deployOptionsVisible: false,
      deployConfirmationVisible: false,
      deployCabinDetailVisible: false,
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
  watch: {
    searchForm: {
      deep: true,
      handler() {
        this.pageInfo.page = 1
        this.fetchWorkflows()
      },
    },
  },
  methods: {
    onConfirmationSubmit(workflow) {
      this.workflow = { ...this.workflow, ...workflow }
      this.deployOptionsVisible = true
    },
    onDeletedDeploy() {
      this.fetchWorkflows()
      this.$emit('deleted')
    },
    onDeployed() {
      this.fetchWorkflows()
      this.$emit('deployed')
    },
    onSaved() {
      this.$emit('saved')
    },
    async fetchWorkflows() {
      this.loading = true
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
        this.loading = false
        return
      }
      this.tableData = result.list
      this.pageInfo.total = result.total
      this.loading = false
      this.$emit('refreshTable', result.total)
    },
    onPageSizeChange(limit) {
      this.pageInfo.limit = limit
      this.fetchWorkflows()
    },
    onPageChange(page) {
      this.pageInfo.page = page
      this.fetchWorkflows()
    },
    onDeploy(row) {
      this.workflow = { ...row }
      this.deployConfirmationVisible = true
    },
    onDetails(row) {
      this.workflow = { ...row }
      this.deployCabinDetailVisible = true
    },
  },
}
</script>

<style scoped lang="scss">
.el-pagination {
  text-align: right;
  padding: 34px 0;
}

.fileStyle {
  color: #007edb;
}
</style>
