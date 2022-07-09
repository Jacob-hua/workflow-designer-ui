<template>
  <div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="index" label="序号" align="center"> </el-table-column>
      <el-table-column prop="deployName" label="名称" align="center"> </el-table-column>
      <el-table-column prop="docName" label="流程文件" align="center">
        <template slot-scope="scope">
          <span class="file">{{ scope.row.docName }}.bpmn</span>
        </template>
      </el-table-column>
      <el-table-column prop="createBy" label="创建人" align="center"> </el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center"> </el-table-column>
      <el-table-column prop="name" label="操作" align="center">
        <template slot-scope="{ row }">
          <el-button
            @click.native.prevent="onEditWorkflow(row)"
            type="text"
            size="small"
            v-role="{ id: 'HomeLook', type: 'button', business: row.business }"
          >
            编辑
          </el-button>
          <el-button
            @click.native.prevent="onDeleteWorkflow(row)"
            type="text"
            size="small"
            v-role="{ id: 'HomeDelete', type: 'button', business: row.business }"
          >
            删除
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
    <deploy-options
      :visible.sync="deployOptionsVisible"
      :workflow="workflow"
      @deploySuccess="onDeploySuccess"
      @saveSuccess="onSaveSuccess"
    />
  </div>
</template>

<script>
import { getProcessDraftList, deleteDraft } from '@/api/unit/api.js'
import { mapState } from 'vuex'
import DeployOptions from './DeployOptions.vue'

export default {
  name: 'DraftsTable',
  components: { DeployOptions },
  props: {
    searchForm: {
      type: Object,
      required: true,
      default: () => ({}),
    },
  },
  data() {
    return {
      deployOptionsVisible: false,
      pageInfo: {
        page: 1,
        limit: 10,
        total: 0,
        order: 'desc',
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
        this.fetchWorkflows()
      },
    },
  },
  methods: {
    onDeploySuccess() {
      this.getManyData()
    },
    onSaveSuccess() {
      this.getManyData()
    },
    async fetchWorkflows() {
      const { errorInfo, result } = await getProcessDraftList({
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
      this.tableData = result.dataList
      this.pageInfo.total = +result.count
      this.$emit('totalChange', result.count, 'draftsTableNum')
    },
    getManyData() {
      this.$emit('getManyData')
    },
    onPageSizeChange(val) {
      this.pageInfo.limit = val
      this.fetchWorkflows()
    },
    onPageChange(val) {
      this.pageInfo.page = val
      this.fetchWorkflows()
    },
    async onDeleteWorkflow(workflow) {
      try {
        await this.$confirm('从草稿箱删除草稿不可恢复, 请确认是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
        const { errorInfo } = await deleteDraft(workflow.id)
        if (errorInfo.errorCode) {
          this.$message.error(errorInfo.errorMsg)
          return
        }
        this.updatePageNum()
        this.$message.success('删除成功!')
        this.fetchWorkflows()
      } catch (error) {}
    },
    updatePageNum() {
      const totalPage = Math.ceil((this.pageInfo.total - 1) / this.pageInfo.limit)
      this.pageInfo.page = this.pageInfo.page > totalPage ? totalPage : this.pageInfo.page
      this.pageInfo.page = this.pageInfo.page < 1 ? 1 : this.pageInfo.page
    },
    onEditWorkflow(workflow) {
      this.workflow = { ...workflow }
      this.deployOptionsVisible = true
    },
  },
}
</script>

<style scoped lang="scss">
.el-pagination {
  text-align: right;
  padding: 34px 0;
}

.file {
  color: #007edb;
}
</style>
