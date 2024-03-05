<template>
  <div>
    <el-table :data="listData" style="width: 100%">
      <el-table-column type="index" label="序号" width="180" align="center"> </el-table-column>
      <el-table-column prop="name" label="名称" width="180" align="center"> </el-table-column>
      <el-table-column prop="docName" label="流程文件" align="center">
        <template slot-scope="scope">
          <span class="fileStyle">{{ scope.row.name + '.bpmn' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createBy" label="创建人" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createBy == -1 ? '系统' : scope.row.createBy }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center"> </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            @click.native.prevent="draftTableEdit(scope.row)"
            type="text"
            size="small"
            class="button1"
          >
            编辑
          </el-button>
          <el-button
            @click.native.prevent="onDeleteRow(scope.row)"
            type="text"
            size="small"
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
          this.pageInfo.page = 1
          this.findWorkFlowRecord()
        }
      },
    },
  },
  methods: {
    onPageSizeChange(val) {
      this.pageInfo.limit = val
      this.findWorkFlowRecord()
    },
    onPageChange(val) {
      this.pageInfo.page = val
      this.findWorkFlowRecord()
    },
    draftTableEdit(row) {
      window.oneBpmnInstances = true
      this.$emit('draftTableEdit', row)
      this.findWorkFlowRecord()
    },
    async onDeleteRow(row) {
      try {
        await this.$confirm('删除不可恢复, 请确认是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          cancelButtonClass: 'btn-custom-cancel',
          type: 'warning',
        })
        const { errorInfo } = await deleteWorkflow({
          id: row.id,
          tenantId: this.tenantId,
          updateBy: this.userInfo.account,
        })
        if (errorInfo.errorCode) {
          this.$message.error(errorInfo.errorMsg)
          return
        }
        this.updatePageNum()
        this.findWorkFlowRecord()
        this.$message.success('删除成功!')
        this.$emit('deleteRow', row)
      } catch (error) {}
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
          status: 'drafted',
          createBy: this.userInfo.account,
          page: this.pageInfo.page,
          limit: this.pageInfo.limit,
        })
        if (errorInfo.errorCode) {
          this.$message.error(errorInfo.errorMsg)
          return
        }

        this.pageInfo.total = Number(result.total);
        this.listData = result.list
      } catch (error) {}
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

<style lang="scss">
.btn-custom-cancel {
  @include cancelbutton;
}
</style>
