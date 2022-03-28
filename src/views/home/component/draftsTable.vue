<template>
  <div>
    <div class="home-table-main">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="index" label="序号" width="180" align="center">
        </el-table-column>
        <el-table-column prop="name" label="名称" width="180" align="center">
        </el-table-column>
        <el-table-column prop="version" label="版本" align="center">
        </el-table-column>
        <el-table-column prop="docName" label="流程文件" align="center">
          <template slot-scope="scope">
            <span class="fileStyle">周期巡视.bpmn</span>
          </template>
        </el-table-column>
        <el-table-column prop="createId" label="创建人" align="center">
        </el-table-column>
        <el-table-column prop="date" label="编辑时间" align="center">
        </el-table-column>
        <el-table-column prop="name" label="操作" align="center">
          <template slot-scope="scope">
            <el-button @click.native.prevent="deployDiolog()" type="text" size="small" class="button1">
              编辑
            </el-button>
            <el-button @click.native.prevent="deleteRow()" type="text" size="small">
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
    <deploy ref="deploy"></deploy>
  </div>
</template>

<script>
  import deploy from './deploy.vue'
  import {
      getProcessDesignService
  } from '@/unit/api.js'
  export default {
    data() {
      return {
        currentPage4: 1,
        getData: {
          page: 1,
          limit: 10,
          total: 100,
          name: '',
          tenantId: '',
          createName: '',
          code: '',
          ascription: '',
          business: '',
          startTime: '',
          endTime: ''
        },
        tableData: [{
            date: '2021-11-12 14:11:23',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          }, {
            date: '2021-11-12 14:11:23',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1517 弄'
          }, {
            date: '2021-11-12 14:11:23',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄'
          }, {
            date: '2021-11-12 14:11:23',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
          },
          {
            date: '2021-11-12 14:11:23',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
          },
          {
            date: '2021-11-12 14:11:23',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
          },
          {
            date: '2021-11-12 14:11:23',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
          },
          {
            date: '2021-11-12 14:11:23',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
          },
          {
            date: '2021-11-12 14:11:23',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
          },
          {
            date: '2021-11-12 14:11:23',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
          }
        ]
      }
    },
    methods: {
      getTableData() {
        getProcessDesignService(this.getData).then((res) => {
          console.log(res, '0000')
        })
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      },
      deleteRow() {
        this.$confirm('从草稿箱删除草稿不可恢复, 请确认是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
      deployDiolog() {
        this.$refs.deploy.dialogVisible2 = true
      }
    },
    components:{
      deploy
    },
    created() {
      this.getTableData()
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
  }
  .home-table-page {
    text-align: right;
    padding: 20px 0px;
  }
  .button1 {
    margin-right: 50px;
  }
</style>
