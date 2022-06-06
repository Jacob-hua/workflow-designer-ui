<template>
  <el-dialog title="引用工作流" :visible="dialogVisible" width="70%" custom-class="dialogVisible" @close="close">
    <div class="dialogVisible-main">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="index" label="序号" width="180" align="center">
        </el-table-column>
        <el-table-column prop="name" label="名称" align="center">
        </el-table-column>
<!--        <el-table-column prop="date" label="版本" align="center">-->
<!--        </el-table-column>-->
        <el-table-column prop="createBy" label="创建人" align="center">
        </el-table-column>
        <el-table-column prop="createTime" label="编辑时间" align="center">
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="lookBpmnShow('引用', scope.$index, scope.row)">查看</el-button>
            <el-button size="mini" @click="addProjectShow('引用工作流', scope.$index, scope.row)">引用</el-button>
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
  import {workFlowRecord} from "@/api/managerWorkflow";

  export default {
    props: {
      dialogVisible: {
        type: Boolean,
        default: false
      },
      valueDate: {
        default: () => []
      },
      ascription: {
        type: String,
        default: ''
      },
      business: {
        type: String,
        default: ''
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
    mounted() {
      this.findWorkFlowRecord()
    },
    methods: {
      async findWorkFlowRecord () {
        let data = await workFlowRecord({
          tenantId: this.$store.state.tenantId || null,
          status: 'enabled,disabled' || '',
          ascription: 'public' || '',
          business: this.business || '',
          createBy: this.$store.state.userInfo.name || '',
          numberCode: '',
          name: this.input,
          startTime: this.valueDate[0]? `${this.valueDate[0]} 00:00:00` || '' : '',
          endTime: this.valueDate[1]? `${this.valueDate[1]} 23:59:59` || '' : '' ,
          page: this.getData.page,
          limit: this.getData.limit
        })
        this.tableData = data.result.list
      },
      close() {
        this.$emit('close')
      },
      lookBpmnShow(tit, index, row) {
        this.$emit('lookBpmnShow', row, tit)
      },
      addProjectShow(title,index, row) {
        this.$emit('addProjectShow',title, row)
      },
      handleSizeChange(val) {
        this.getData.limit = val
        this.findWorkFlowRecord()
        
      },
      handleCurrentChange(val) {
        this.getData.page = val
        this.findWorkFlowRecord()
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
