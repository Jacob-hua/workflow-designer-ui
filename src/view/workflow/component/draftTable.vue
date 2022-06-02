<template>
  <div>
    <div class="home-table-main">
      <el-table :data="formListSecond" style="width: 100%">
        <el-table-column type="index" label="序号" width="180" align="center">
        </el-table-column>
        <el-table-column prop="name" label="名称" width="180" align="center">
        </el-table-column>
<!--        <el-table-column prop="version" label="版本" align="center">-->
<!--        </el-table-column>-->
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
        <el-table-column prop="createTime" label="编辑时间" align="center">
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button @click.native.prevent="draftTableEdit(scope.row)" v-role="{ id: 'WorkflowEdit', type: 'button', business: business }" type="text" size="small" class="button1">
              编辑
            </el-button>
            <el-button @click.native.prevent="deleteRow(scope.row)" v-role="{ id: 'WorkflowDelete', type: 'button', business: business }" type="text" size="small">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="home-table-page">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="getData.page"
        :page-size="getData.limit" layout="prev, pager, next, jumper" :total="getData.total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import {deleteWorkflow, workFlowRecord} from '@/api/managerWorkflow'
  export default {
    props: {
      valueDate: {
        default: () => []
      },
      formListSecond: {
        type: Array,
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
        getData: {
          page: 1,
          limit: 10,
          total: 1,
          tenantId: this.$store.state.tenantId,
          ascription: '',
          business: '',
          startTime: '',
          endTime: ''
        },
        tableData: [
        ],
      }
    },
    methods: {
      getTableData() {
        this.getData.startTime = this.valueDate[0]
        this.getData.endTime = this.valueDate[1]
        this.getData.business = this.business
        this.getData.ascription = this.ascription
        workFlowRecord(this.getData).then((res) => {
          this.formListSecond = res.result.list
          this.getData.total = res.result.total
          this.$emit('totalChange', res.result.total, 'WorkflowTableNum')
        })
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.$parent.getData.limit = val
        this.$parent.findWorkFlowRecord('drafted')
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.$parent.getData.page = val
        this.$parent.findWorkFlowRecord('drafted')
      },
      draftTableEdit(row) {
        window.oneBpmnInstances = true
        this.$emit('draftTableEdit', row)
      },
      deleteRow(row) {
        this.$confirm('删除不可恢复, 请确认是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteWorkflow(row.id).then(res => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            // this.getTableData()
            this.$parent.findWorkFlowRecord('drafted')
          })


        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
      getManyData() {
        this.$emit('getManyData')
      },
      
    }
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
  
  /deep/ .el-table .el-table__cell {
    padding: 8px 0px;
  }
  
  /deep/ .el-table th.el-table__cell {
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
