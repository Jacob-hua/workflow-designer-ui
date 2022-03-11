<template>
  <div>
    <div class="home-table-main">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="index" label="序号" width="180" align="center">
        </el-table-column>
        <el-table-column prop="name" label="名称" width="180" align="center">
        </el-table-column>
        <el-table-column prop="name" label="版本" align="center">
        </el-table-column>
        <el-table-column prop="name" label="流程文件" align="center">
          <template slot-scope="scope">
            <span class="fileStyle">周期巡视.bpmn</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="创建人" align="center">
        </el-table-column>
        <el-table-column prop="date" label="编辑时间" align="center">
        </el-table-column>
        <el-table-column prop="name" label="操作" align="center">
          <template slot-scope="scope">
            <el-button @click.native.prevent="deployDiolog()" type="text" size="small" class="button1">
              部署
            </el-button>
            <el-button @click.native.prevent="deleteRow(scope.$index, tableData)" type="text" size="small">
              查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="home-table-page">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage4"
        :page-sizes="[100, 200, 300, 400]" :page-size="100" layout="prev, pager, next, jumper" :total="400">
      </el-pagination>
    </div>
    <deploy ref="deploy"></deploy>
  </div>
</template>

<script>
  import deploy from './deploy.vue'
  export default {
    data() {
      return {
        currentPage4: 1,
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
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      },
      deleteRow() {
        
      },
      deployDiolog() {
        this.$refs.deploy.dialogVisible1 = true
      }
    },
    components:{
      deploy
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
