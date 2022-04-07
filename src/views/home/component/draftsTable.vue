<template>
  <div>
    <div class="home-table-main">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="index" label="序号" align="center">
        </el-table-column>
        <el-table-column prop="deployName" label="名称" align="center">
        </el-table-column>
        <!-- <el-table-column prop="version" label="版本" align="center">
        </el-table-column> -->
        <el-table-column prop="docName" label="流程文件" align="center">
          <template slot-scope="scope">
            <span class="fileStyle">{{ scope.row.deployName }}.bpmn</span>
          </template>
        </el-table-column>
        <el-table-column prop="createBy" label="创建人" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.createBy == -1 ? '系统' : scope.row.createBy }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center">
        </el-table-column>
        <el-table-column prop="name" label="操作" align="center">
          <template slot-scope="scope">
            <el-button @click.native.prevent="deployDiolog(scope.row)" type="text" size="small" class="button1">
              编辑
            </el-button>
            <el-button @click.native.prevent="deleteRow(scope.row.id)" type="text" size="small">
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
    <deploy ref="deploy" dataType="drafted" @addDraftSuccess="getTableData()" @addWorkSuccess="getTableData()"></deploy>
  </div>
</template>

<script>
  import deploy from './deploy.vue'
  import {
      getProcessDesignService,
      getProcessDraftList,
      deleteDraft
  } from '@/unit/api.js'
  export default {
    props: {
      valueDate: {
        default: []
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
        currentPage4: 1,
        getData: {
          page: 1,
          limit: 10,
          total: 100,
          ascription: '',
          business: '',
          createBy: '-1',
          systemType: '',
          tenantId: '12',
          startTime: '',
          endTime: '',
          order: 'desc'
        },
        tableData: []
      }
    },
    methods: {
      getTableData() {
        this.getData.startTime = this.valueDate[0]
        this.getData.endTime = this.valueDate[1]
        this.getData.business = this.business
        this.getData.ascription = this.ascription
        getProcessDraftList(this.getData).then((res) => {
          this.tableData = res.result.dataList
          this.getData.total = res.result.count * 1
          this.$emit('totalChange', res.result.count * 1, 'draftsTableNum')
        })
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.getData.limit = val
        this.getTableData()
      },
      handleCurrentChange(val) {
        this.getData.page = val
        console.log(`当前页: ${val}`);
        this.getTableData()
      },
      deleteRow(id) {
        this.$confirm('从草稿箱删除草稿不可恢复, 请确认是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteDraft(id).then((res) => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.getTableData()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
      deployDiolog(item) {
        this.$refs.deploy.dialogVisible2 = true
        this.$nextTick(() => {
          this.$refs.deploy.initData()
          this.$refs.deploy.$refs.ProcessInformation.postData = JSON.parse(JSON.stringify(item))
          this.$refs.deploy.$refs.ProcessInformation.createNewDiagram(item.content)
          this.$refs.deploy.getFormList()
        })
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
