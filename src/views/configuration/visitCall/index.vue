<template>
  <div>
    <div class="home-table-main">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="商品名称">
                <span>{{ props.row.name }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column type="index" label="序号" align="center">
        </el-table-column>
        <el-table-column prop="name" label="资源类型" align="center">
        </el-table-column>
        <el-table-column prop="version" label="资源标识" align="center">
        </el-table-column>
        <el-table-column prop="createName" label="api名称" align="center">
        </el-table-column>
        <el-table-column prop="createTime" label="api标识" align="center">
        </el-table-column>
        <el-table-column prop="name" label="api类型" align="center">
        </el-table-column>
        <el-table-column prop="name" label="主机地址" align="center">
        </el-table-column>
        <el-table-column prop="name" label="访问路径" align="center">
        </el-table-column>
        <el-table-column prop="name" label="请求类型" align="center">
        </el-table-column>
        <el-table-column prop="name" label="请求头" align="center">
        </el-table-column>
        <el-table-column prop="name" label="api类型" align="center">
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" class="button1" @click="editTable(scope.row)">
              编辑
            </el-button>
            <el-button type="text" size="small" @click="deleteTable(scope.row)">
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
    <visitDiolog ref="visitDiolog"></visitDiolog>
  </div>
</template>

<script>
  import visitDiolog from './visitDiolog.vue'
  export default {
    data() {
      return {
        getData: {
          page: 1,
          limit: 10,
          total: 100
        },
        tableData: [
          {
            name: '资源类型',
            version: '资源标识',
            createName: '创建人',
            createTime: '创建时间'
          },
        ]
      }
    },
    methods: {
      editTable(row) {
        this.$emit('editTable', row)
      },
      deleteTable(row) {
        this.$emit('deleteTable', row)
      },
      handleSizeChange() {
        
      },
      handleCurrentChange() {
        
      }
    },
    components:{
      visitDiolog
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
    margin-right: 20px;
  }
</style>
