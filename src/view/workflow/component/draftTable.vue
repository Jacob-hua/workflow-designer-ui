<template>
  <div>
    <div class="home-table-main">
      <el-table :data="formListSecond"
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
                         label="编辑时间"
                         align="center">
        </el-table-column>
        <el-table-column label="操作"
                         align="center">
          <template slot-scope="scope">
            <el-button @click.native.prevent="draftTableEdit(scope.row)"
                       v-role="{ id: 'WorkflowEdit', type: 'button', business: business }"
                       type="text"
                       size="small"
                       class="button1">
              编辑
            </el-button>
            <el-button @click.native.prevent="onDeleteRow(scope.row)"
                       v-role="{ id: 'WorkflowDelete', type: 'button', business: business }"
                       type="text"
                       size="small">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="home-table-page">
      <el-pagination @size-change="onSizeChange"
                     @current-change="onCurrentChange"
                     :current-page="getData.page"
                     :page-size="getData.limit"
                     layout="prev, pager, next, jumper"
                     :total="getData.total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { deleteWorkflow } from '@/api/managerWorkflow'

export default {
  props: {
    valueDate: {
      default: () => [],
    },
    formListSecond: {
      type: Array,
      default: () => [],
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
        total: 1,
        business: '',
        startTime: '',
        endTime: '',
      },
      tableData: [],
    }
  },
  methods: {
    onSizeChange(val) {
      this.$emit('pageSizeChange', val)
    },
    onCurrentChange(val) {
      this.$emit('pageChange', val)
    },
    draftTableEdit(row) {
      window.oneBpmnInstances = true
      this.$emit('draftTableEdit', row)
    },
    async onDeleteRow(row) {
      try {
        await this.$confirm('删除不可恢复, 请确认是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
        const { errorInfo } = await deleteWorkflow(row.id)
        if (errorInfo.errorCode) {
          this.$message.error(errorInfo.errorMsg)
          return
        }

        this.$message.success('删除成功!')
        this.$emit('deleteRow', row)
      } catch (error) {}
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
