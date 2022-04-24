<template>
  <el-dialog title="引用工作流" :visible="dialogVisible" width="70%" custom-class="dialogVisible" @close="close">
    <div class="dialogVisible-main">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="index" label="序号" width="180" align="center">
        </el-table-column>
        <el-table-column prop="date" label="名称" align="center">
        </el-table-column>
        <el-table-column prop="date" label="版本" align="center">
        </el-table-column>
        <el-table-column prop="date" label="创建人" align="center">
        </el-table-column>
        <el-table-column prop="date" label="编辑时间" align="center">
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="lookBpmnShow(scope.$index, scope.row)">查看</el-button>
            <el-button size="mini" @click="addProjectShow(scope.$index, scope.row)">引用</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="table-page">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="getData.page"
          :page-size="getData.limit" layout="prev, pager, next, jumper" :total="getData.total">
        </el-pagination>
      </div>
    </div>
  </el-dialog>
</template>

<script>
  export default {
    props: {
      dialogVisible: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        tableData: [
          {
            date: '王小虎'
          }
        ],
        getData: {
          page: 1,
          limit: 10,
          total: 1
        }
      }
    },
    methods: {
      close() {
        this.$emit('close')
      },
      lookBpmnShow(index, row) {
        this.$emit('lookBpmnShow')
      },
      addProjectShow(index, row) {
        this.$emit('addProjectShow')
      },
      handleSizeChange() {
        
      },
      handleCurrentChange() {
        
      }
    }
  }
</script>

<style scoped="scoped">
  .dialogVisible-main {}
  /deep/ .el-table {
    height: 600px;
  }
  .table-page {
    margin-top: 20px;
    text-align: right;
  }
</style>
