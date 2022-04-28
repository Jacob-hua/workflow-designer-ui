<template>
  <div>
    <div class="his_checkbox">
      <el-radio v-model="radio" label="1">
        <div>
          <p class="taskNO">51</p>
          <p class="taskTit">我的任务</p>
        </div>
      </el-radio>
      <el-radio v-model="radio" label="2">
        <div>
          <p class="taskNO">21</p>
          <p class="taskTit">告知</p>
        </div>
      </el-radio>
    </div>
    <div class="home-table-main">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="index" label="序号" width="180" align="center">
        </el-table-column>
        <el-table-column prop="name" label="名称" width="180" align="center">
        </el-table-column>
        <el-table-column prop="version" label="能源系统" align="center">
        </el-table-column>
        <el-table-column prop="docName" label="执行厂站" align="center">
        </el-table-column>
        <el-table-column prop="docName" label="发起人" align="center">
        </el-table-column>
        <el-table-column prop="createTime" label="发起时间" align="center">
        </el-table-column>
        <el-table-column prop="createTime" label="执行人" align="center">
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button @click.native.prevent="seeDetail(scope.row)" type="text" size="small" >
              查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="home-table-page">
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageInfo.page"
          :page-size="pageInfo.limit"
          layout="prev, pager, next, jumper"
          :total="pageInfo.total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      radio: '1',
      tableData: [
        {
          name: '电厂',
          version: '电厂',
          docName: '电厂',
          createTime: '电厂',
        }
      ],
      pageInfo: {
        page: 1,
        limit: 10,
        total: 0
      }
    }

  },
  watch: {
    pageInfo:{
      deep: true,
      immediate: true,
      handler(newValue, oldValue) {
        this.getTableData()
      }
    }
  },
  methods: {
    getTableData() {

    },
    seeDetail(row) {
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    }
  }
}
</script>

<style scoped>
.his_checkbox {
  margin: 30px 0;
}

.history_date {
  margin-left: 20px;
}


.his_checkbox {
  display: flex;
}
.taskNO {
  font-size: 24px;
  color: #000;
  font-weight: 400;
  font-style: normal;
}
.taskTit {
  font-size: 14px;
  color: #000;
  font-weight: 400;
  font-style: normal
}
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
