<template>
  <div>
    <el-table :data="listData">
      <el-table-column type="index" label="序号" width="180" align="center"> </el-table-column>
      <el-table-column prop="processName" label="名称" width="180" align="center" show-overflow-tooltip> </el-table-column>
      <el-table-column prop="processName" label="流程文件" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span class="file">{{ scope.row.processName }}.bpmn</span>
        </template>
      </el-table-column>
      <el-table-column prop="creatorName" label="创建人" align="center"> </el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center"> </el-table-column>
      <el-table-column
        label="操作" align="center"
      >
        <template slot-scope="scope">
          <el-button
            @click.native.prevent="lookBpmnShow(scope.row)"
            type="text"
            size="small"
          >
            查看
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
import { fetchWorkflowList, deleteWorkflow } from '../../../api/workflow'
import { mapState } from 'vuex'

export default {
  props: {
    searchForm: {
      type: Object,
      default: () => ({}),
    },
    bindType: {
      type: String,
      default: 'bind'
    }
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
          this.fetchWorkflowList()
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
        const confirmMsg = '删除不可恢复, 请确认是否继续?'
        await this.$confirm(confirmMsg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          cancelButtonClass: 'btn-custom-cancel',
          type: 'warning',
        })
        const { code, msg } = await deleteWorkflow({
          processId: row.processId
        })
        if (code!=='200') {
          this.$message.error(msg)
          return
        }
        this.updatePageNum()
        await this.fetchWorkflowList()
        this.$message.success('删除成功!')
        this.$emit('deleteRow', row)
      } catch (error) {}
    },
    onSizeChange(val) {
      this.pageInfo.limit = val
      this.fetchWorkflowList()
    },
    onPageChange(val) {
      this.pageInfo.page = val
      this.fetchWorkflowList()
    },
    updatePageNum() {
      const totalPage = Math.ceil((this.pageInfo.total - 1) / this.pageInfo.limit)
      this.pageInfo.page = this.pageInfo.page > totalPage ? totalPage : this.pageInfo.page
      this.pageInfo.page = this.pageInfo.page < 1 ? 1 : this.pageInfo.page
    },

    async fetchWorkflowList(){
      const params = this.bindType === 'bind' ? {
        tenantId: this.searchForm.business[0]??"",
        projectId: this.searchForm.business[1]??"",
        applicationId: this.searchForm.business[2]??"",
        bindType: this.bindType,
        limit: this.pageInfo.limit,
        page: this.pageInfo.page,
        processName: this.searchForm.processName??'',
        startTime: this.searchForm.valueDate?.[0]??'',
        endTime: this.searchForm.valueDate?.[1]??''
      } : {
        bindType: this.bindType,
        limit: this.pageInfo.limit,
        page: this.pageInfo.page,
        processName: this.searchForm.processName??'',
        startTime: this.searchForm.valueDate?.[0]??'',
        endTime: this.searchForm.valueDate?.[1]??''
      }
      const {data, code, msg} = await fetchWorkflowList(params)
      if(code!=='200'){
        this.$message.error(msg);
        return;
      }
      this.listData = data.dataList;
      this.pageInfo.total = Number(data.total);
    }
  },
}
</script>

<style lang="scss" scoped>
.el-pagination {
  text-align: right;
  padding: 34px 10px;
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

<style lang="scss">
.btn-custom-cancel {
  @include cancelbutton;
}
</style>
