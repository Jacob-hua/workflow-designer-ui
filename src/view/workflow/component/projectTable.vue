<template>
  <div>
    <el-table :data="listData">
      <el-table-column type="index" label="序号" width="180"> </el-table-column>
      <el-table-column prop="name" label="名称" width="180"> </el-table-column>
      <el-table-column prop="docName" label="流程文件">
        <template slot-scope="scope">
          <span class="file">{{ scope.row.docName }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createBy" label="创建人"> </el-table-column>
      <el-table-column prop="createTime" label="编辑时间"> </el-table-column>
      <el-table-column prop="displayStatus" label="状态">
        <template slot-scope="scope">
          <span class="status" :class="scope.row.status === 'enabled' ? '' : 'status-failed'">{{
            scope.row.displayStatus
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        v-role="{ id: ['WorkflowLook', 'WorkflowDelete'], type: 'contain', business: business }"
      >
        <template slot-scope="scope">
          <el-button
            @click.native.prevent="lookBpmnShow(scope.row)"
            v-role="{ id: 'WorkflowLook', type: 'button', business: business }"
            type="text"
            size="small"
          >
            查看
          </el-button>
          <el-button
            @click.native.prevent="onDeleteRow(scope.row)"
            v-role="{ id: 'WorkflowDelete', type: 'button', business: business }"
            type="text"
            size="small"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="onSizeChange"
      @current-change="onPageChange"
      :current-page="pageInfo.page"
      :page-size="pageInfo.limit"
      layout="prev, pager, next, jumper"
      :total="pageInfo.total"
    >
    </el-pagination>
  </div>
</template>

<script>
import { workFlowRecord, deleteWorkflow } from '@/api/managerWorkflow'
import { mapState } from 'vuex'

export default {
  props: {
    business: {
      type: String,
      default: '',
    },
    searchForm: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      pageInfo: {
        page: 1,
        limit: 10,
        total: 0,
      },
      listData: [],
    }
  },
  computed: {
    ...mapState('account', ['tenantId', 'userInfo']),
  },
  watch: {
    searchForm: {
      immediate: true,
      handler(value) {
        if (Object.keys(value).length) {
          this.findWorkFlowRecord()
        }
      },
    },
  },
  methods: {
    lookBpmnShow(row) {
      this.$emit('lookBpmnShow', row)
    },
    async onDeleteRow(row) {
      try {
        await this.$confirm('删除不可恢复, 请确认是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
        const { errorInfo } = await deleteWorkflow({
          id: row.id,
          updateBy: this.userInfo.account,
        })
        if (errorInfo.errorCode) {
          this.$message.error(errorInfo.errorMsg)
          return
        }
        this.updatePageNum()
        await this.findWorkFlowRecord()
        this.$message.success('删除成功!')
        this.$emit('deleteRow', row)
      } catch (error) {}
    },
    onSizeChange(val) {
      this.pageInfo.limit = val
      this.findWorkFlowRecord()
    },
    onPageChange(val) {
      this.pageInfo.page = val
      this.findWorkFlowRecord()
    },
    updatePageNum() {
      const totalPage = Math.ceil((this.pageInfo.total - 1) / this.pageInfo.limit)
      this.pageInfo.page = this.pageInfo.page > totalPage ? totalPage : this.pageInfo.page
      this.pageInfo.page = this.pageInfo.page < 1 ? 1 : this.pageInfo.page
    },
    // 查询项目流程
    async findWorkFlowRecord() {
      try {
        const { errorInfo, result } = await workFlowRecord({
          ...this.searchForm,
          tenantId: this.tenantId,
          status: 'enabled,disabled',
          createBy: this.userInfo.account,
          page: this.pageInfo.page,
          limit: this.pageInfo.limit,
        })
        if (errorInfo.errorCode) {
          this.$message.error(errorInfo.errorMsg)
          return
        }

        this.pageInfo.total = result.total
        this.listData = result.list?.map((project) => {
          if (project.ascription === 'public') {
            project.displayStatus = project.status === 'enabled' ? '可关联' : '不可关联'
          } else {
            project.displayStatus = project.status === 'enabled' ? '可部署' : '不可部署'
          }
          return project
        })
      } catch (error) {}
    },
  },
}
</script>

<style lang="scss" scoped>
.el-pagination {
  text-align: right;
  padding: 34px 0;
}

.file {
  color: #007edb;
}

.status {
  width: 90px;
  height: 30px;
  color: white;
  background-color: #009900;
  display: inline-block;
  text-align: center;
  line-height: 30px;
}
.status-failed {
  background-color: #ff9900;
}
</style>
