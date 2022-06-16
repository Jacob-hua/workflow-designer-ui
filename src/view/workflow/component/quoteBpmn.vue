<template>
  <el-dialog title="引用工作流"
             :visible="visible"
             width="70%"
             custom-class="dialogVisible"
             @close="close">
    <div class="dialogVisible-main">
      <el-table :data="tableData"
                style="width: 100%">
        <el-table-column type="index"
                         label="序号"
                         width="180"
                         align="center">
        </el-table-column>
        <el-table-column prop="name"
                         label="名称"
                         align="center">
        </el-table-column>
        <el-table-column prop="createBy"
                         label="创建人"
                         align="center">
        </el-table-column>
        <el-table-column prop="createTime"
                         label="编辑时间"
                         align="center">
        </el-table-column>
        <el-table-column label="操作"
                         align="center">
          <template slot-scope="{ $index, row }">
            <el-button size="mini"
                       @click="onLookBpmn('引用', $index, row)">查看</el-button>
            <el-button size="mini"
                       @click="onQuoteBpmn('引用工作流', $index, row)">引用</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="table-page">
        <el-pagination @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="getData.page"
                       :page-size="getData.limit"
                       layout="prev, pager, next, jumper"
                       :total="getData.total">
        </el-pagination>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { workFlowRecord } from '@/api/managerWorkflow'
import { mapState } from 'vuex'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    valueDate: {
      default: () => [],
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
      tableData: [],
      getData: {
        page: 1,
        limit: 10,
        total: 1,
      },
    }
  },
  computed: {
    ...mapState('account', ['userInfo', 'tenantId']),
  },
  mounted() {
    this.findWorkFlowRecord()
  },
  methods: {
    async findWorkFlowRecord() {
      try {
        const { errorInfo, result } = await workFlowRecord({
          tenantId: this.tenantId,
          status: 'enabled,disabled',
          ascription: 'public',
          business: this.business,
          createBy: this.userInfo.name,
          name: this.input,
          startTime: this.valueDate[0],
          endTime: this.valueDate[1],
          page: this.getData.page,
          limit: this.getData.limit,
        })
        if (errorInfo.errorCode) {
          this.$message.error(errorInfo.errorMsg)
          return
        }
        this.tableData = result.list
      } catch (error) {}
    },
    close() {
      this.$emit('close')
    },
    onLookBpmn(tit, _, row) {
      this.$emit('lookBpmn', row, tit)
    },
    onQuoteBpmn(title, _, row) {
      const newData = {...row}
      delete newData.id
      this.$emit('quoteBpmn', title, newData)
    },
    handleSizeChange(val) {
      this.getData.limit = val
      this.findWorkFlowRecord()
    },
    handleCurrentChange(val) {
      this.getData.page = val
      this.findWorkFlowRecord()
    },
  },
}
</script>

<style scoped>
::v-deep .el-table {
  height: 600px;
}
.table-page {
  margin-top: 20px;
  text-align: right;
}
</style>
