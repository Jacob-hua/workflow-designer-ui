<template>
  <div class="personnel">
    <div class="personnel-left">
      <div class="personnel-header">
        <i class="el-icon-share"></i>
        <span class="personnel-header-word">组织结构</span>
      </div>
      <div class="personnel-left-tree">
        <PeTree></PeTree>
      </div>
    </div>
    <div class="personnel-right">
      <div class="personnel-header padding20">
        <i class="el-icon-share"></i>
        <span class="personnel-header-word">权限</span>
      </div>
      <div class="personnel-right-table">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column type="index" label="序号" align="center" width="50">
          </el-table-column>
          <el-table-column prop="name" label="姓名" align="center">
          </el-table-column>
          <el-table-column prop="address" label="角色" align="center">
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="seeData()">查看</el-button>
              <el-button type="text" size="small" @click="editData()">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <editRole :dialogVisible="dialogVisible" @handleClose="handleClose()" ref="editRole"></editRole>
  </div>
</template>

<script>
  import PeTree from '@/components/PeTree.vue'
  import editRole from './component/editRole.vue'
  export default {
    data() {
      return {
        data: [{
          label: '一级 1',
          children: [{
            label: '二级 1-1',
            children: [{
              label: '三级 1-1-1'
            }]
          }]
        }, {
          label: '一级 2',
          children: [{
            label: '二级 2-1',
            children: [{
              label: '三级 2-1-1'
            }]
          }, {
            label: '二级 2-2',
            children: [{
              label: '三级 2-2-1'
            }]
          }]
        }, {
          label: '一级 3',
          children: [{
            label: '二级 3-1',
            children: [{
              label: '三级 3-1-1'
            }]
          }, {
            label: '二级 3-2',
            children: [{
              label: '三级 3-2-1'
            }]
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        dialogVisible: false,
        tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }]
      }
    },
    methods: {
      handleNodeClick(data) {
        console.log(data);
      },
      seeData() {
        this.dialogVisible = true
        this.$nextTick(() => {
          this.$refs.editRole.type = 'see'
        })
      },
      editData() {
        this.dialogVisible = true
        this.$nextTick(() => {
          this.$refs.editRole.type = 'edit'
        })
      },
      handleClose() {
        this.dialogVisible = false
      }
    },
    components: {
      PeTree,
      editRole
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
