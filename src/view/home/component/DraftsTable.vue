<template>
  <div>
    <el-table :data="tableData" style="width: 100%" v-loading="loading">
      <el-table-column type="index" label="序号"> </el-table-column>
      <el-table-column prop="deployName" label="名称"> </el-table-column>
      <el-table-column prop="docName" label="流程文件">
        <template slot-scope="scope">
          <span class="file">{{ scope.row.deployName }}.bpmn</span>
        </template>
      </el-table-column>
      <el-table-column prop="periodicityFlag" label="周期性">
        <template slot-scope="scope">
          <span>{{ scope.row.periodicityFlag ? '是' : '否' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createBy" label="创建人"> </el-table-column>
      <el-table-column prop="createTime" label="创建时间"> </el-table-column>
      <el-table-column prop="name" label="操作">
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
    <deploy-options :visible.sync="deployOptionsVisible" :workflow="workflow" @deployed="onDeployed" @saved="onSaved" />
  </div>
</template>

<script>
import { postDraftlist, deleteDraft } from '@/api/unit/api.js'
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
      loading: false,
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
        this.pageInfo.page = 1
        this.fetchWorkflows()
      },
    },
  },
  methods: {
    onDeployed() {
      this.fetchWorkflows()
      this.$emit('deployed')
    },
    onSaved() {
      this.fetchWorkflows()
      this.$emit('saved')
    },
    async fetchWorkflows() {
      this.loading = true
      const { errorInfo, result } = await postDraftlist({
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
      this.tableData = result.dataList
      this.pageInfo.total = +result.count
      this.loading = false
      this.$emit('refreshTable', result.count)
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
          cancelButtonClass: 'btn-custom-cancel',
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
      this.workflow = {
        ...workflow,
        isCycle: workflow.ruleId,
        rule: {
          ruleId: workflow.ruleId,
          cronExpression: workflow.cronExpression,
        },
        status: 'drafted',
      }
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

<style lang="scss">
.btn-custom-cancel {
  @include cancelbutton;
}
</style>
