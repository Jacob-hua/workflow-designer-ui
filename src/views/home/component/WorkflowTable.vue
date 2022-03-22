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
            <span class="fileStyle">{{ scope.row.name + '.bpmn' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createName" label="创建人" align="center">
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center">
        </el-table-column>
        <el-table-column prop="name" label="已部署次数" align="center">
        </el-table-column>
        <el-table-column prop="name" label="操作" align="center">
          <template slot-scope="scope">
            <el-button @click.native.prevent="deployDiolog()" type="text" size="small" class="button1">
              部署
            </el-button>
            <el-button @click.native.prevent="detailsDiolog()" type="text" size="small">
              查看
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
    <detailsBnpm ref="detailsBnpm"></detailsBnpm>
  </div>
</template>

<script>
  import deploy from './deploy.vue'
  import detailsBnpm from './details.vue'
  import {
      getFormService,
      getProcessDesignService
  } from '@/unit/api.js'
  export default {
    data() {
      return {
        
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
        tableData: [] 
      }
    },
    methods: {
      getTableData() {
        getProcessDesignService(this.getData).then((res) => {
          this.tableData = res.result.list
          this.getData.total = res.result.total
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
        
      },
      deployDiolog() {
        this.$refs.deploy.dialogVisible1 = true
      },
      detailsDiolog() {
        this.$refs.detailsBnpm.dialogVisible1 = true
      }
    },
    created() {
      this.getTableData()
    },
    components:{
      deploy,
      detailsBnpm
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
