<template>
  <div class="personnel">
    <div class="personnel-left">
      <div class="personnel-header">
        <i class="el-icon-share"></i>
        <span class="personnel-header-word">组织结构</span>
      </div>
      <div class="personnel-left-tree">
        <PeTree :data="data" :currentNodeKey="currentNodeKey" @nodeClick="getTable"></PeTree>
      </div>
    </div>
    <div class="personnel-right">
      <div class="personnel-header padding20">
        <i class="el-icon-share"></i>
        <span class="personnel-header-word">权限</span>
      </div>
      <div class="personnel-right-table">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column type="index" label="序号" width="50" align="center">
          </el-table-column>
          <el-table-column prop="lastName" label="姓名" align="center">
          </el-table-column>
          <el-table-column label="角色" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.groupList[0].name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="seeData(scope.row)">查看</el-button>
              <el-button type="text" size="small" @click="editData(scope.row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <editRole :dialogVisible="dialogVisible" @handleClose="handleClose()" ref="editRole"></editRole>
  </div>
</template>

<script>
  import PeTree from '@/component/PeTree.vue'
  import editRole from './component/editRole.vue'
  import { getSystemGroupTree, postPersonUser } from '@/api/unit/api.js'
  export default {
    data() {
      return {
        data: [],
        dialogVisible: false,
        tableData: [],
        currentNodeKey: 'XM_aff0659724a54c119ac857d4e560b47b:-1:template:78'
      }
    },
    methods: {
      handleNodeClick(data) {
        console.log(data);
      },
      seeData(item) {
        this.dialogVisible = true
        this.$nextTick(() => {
          this.$refs.editRole.type = 'see'
          this.$refs.editRole.getMapping(item)
        })
      },
      editData(item) {
        this.dialogVisible = true
        this.$nextTick(() => {
          this.$refs.editRole.type = 'edit'
          this.$refs.editRole.getMapping(item)
        })
      },
      handleClose() {
        this.dialogVisible = false
      },
      getTree() {
        getSystemGroupTree({
          projectCode: 'XM_aff0659724a54c119ac857d4e560b47b',
          displayType: 'tree'
        }).then((res) => {
          this.data = res.result
          this.currentNodeKey = res.result[0].groupId
          this.getTable(res.result[0])
        })
      },
      getTable(value) {
        postPersonUser({
          groupId: value.groupId,
          limit: 999999,
          name: '',
          page: 1,
          tenantId: this.$store.state.tenantId,
          userId: this.$store.state.userInfo.name
        }).then((res) => {
          this.tableData = res.result.dataList
        })
      }
      
    },
    components: {
      PeTree,
      editRole
    },
    created() {
      this.getTree()
    }
  }
</script>

<style scoped="scoped">
  .personnel {
    display: flex;
    margin-left: 20px;
    margin-top: 30px;
  }

  .personnel-left {
    padding-left: 20px;
    padding-right: 20px;
    height: 650px;
    flex: 4;
    border: 1px solid #cccccc;
  }

  .personnel-header {
    line-height: 60px;
    font-size: 16px;
    border-bottom: 1px solid #CCCCCC;
    color: black;
  }

  .personnel-header-word {
    margin-left: 20px;
  }

  .personnel-right {
    flex: 6;
    /* padding-left: 20px; */
    /* padding-right: 20px; */
    border: 1px solid #cccccc;
    margin-left: 40px;
    margin-right: 40px;
  }
  
  .padding20 {
    padding: 0px 20px;
  }
  
  .personnel-right-table /deep/ .el-table th.el-table__cell {
    background-color: #f5f7f9;
  }
</style>
