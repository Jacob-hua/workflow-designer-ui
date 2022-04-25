<template>
  <el-dialog title="代办指定" :visible.sync="dialogVisible" width="70%" :before-close="handleClose" @open="open()">
    <div class="people">
      <div>
        <span>组织结构</span>
      </div>
      <div class="people-main">
        <div class="people-main-left">
          <el-tree :data="data" :highlight-current="true"></el-tree>
        </div>
        <div class="people-main-right">
          <div class="people-main-right-search">
            <el-input v-model="input" placeholder="请输入姓名搜索人员" prefix-icon="el-icon-search"></el-input>
          </div>
          <!-- <div class="people-main-right-letter">
            <div>
              <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="全部" name=""></el-tab-pane>
                <el-tab-pane :label="item" :name="item" v-for="(item, index) in letterList" :key="index"></el-tab-pane>
              </el-tabs>
            </div>
          </div> -->
          <div class="people-main-right-table">
            <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" row-key="id" style="width: 100%" @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="55" align="center">
              </el-table-column>
              <el-table-column label="序号" type="index" align="center">
              </el-table-column>
              <el-table-column prop="name" label="姓名" align="center">
              </el-table-column>
              <el-table-column prop="name" label="手机号码" show-overflow-tooltip align="center">
              </el-table-column>
              <el-table-column prop="name" label="岗位" show-overflow-tooltip align="center">
              </el-table-column>
              <el-table-column prop="name" label="备注" show-overflow-tooltip align="center">
              </el-table-column>
            </el-table>
          </div>
          <div class="people-main-right-page">
            <el-pagination @size-change="handleSizeChange" :current-page.sync="getData.page"
              :page-size="getData.limit" layout="prev, pager, next, jumper" :total="getData.total">
            </el-pagination>
          </div>
        </div>
      </div>
      <div>
        <span>指定人员</span>
      </div>
      <div class="people-footer">
        <div class="peopleList-title">运维一班</div>
        <div class="peopleList">
          <div class="peopleList-item" v-for="(item, index) in multipleSelection">{{ item.name }} <i class="el-icon-remove-outline" @click="deletePeople(index)"></i> </div>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="dataBack()">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { getPersonUser } from '@/unit/api.js'
  export default {
    data() {
      return {
        dialogVisible: false,
        input: '',
        activeName: '',
        multipleSelection: [],
        getData: {
          page: 1,
          limit: 5,
          total: 1
        },
        tableData: [{
            id: '1',
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          }, {
            id: '2',
            date: '2016-05-04',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1517 弄'
          }, {
            id: '3',
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄'
          }, {
            id: '4',
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
          },
          {
            id: '5',
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
          }
        ],
        letterList: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
          'U', 'V', 'W', 'X', 'Y', 'Z'
        ],
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
        }]
      }
    },
    methods: {
      handleClick() {

      },
      open() {
        this.getPeopleList()
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleSizeChange() {
        
      },
      handleClose() {
        
      },
      getPeopleList() {
        getPersonUser({
          groupId: '',
          name: '',
          tenantId: '',
          userId: ''
        }).then((res) => {
          console.log(res)
        })
      },
      
      deletePeople(index) {
        this.multipleSelection.splice(index, 1)
      },
      dataBack() {
        this.$parent.dataList[this.$parent.functionCheck] = this.multipleSelection
        this.dialogVisible = false
      }
    }
  }
</script>

<style scoped="scoped">
  .people {}

  .people-main {
    display: flex;
  }

  .people-main-left {
    flex: 3;
    height: 480px;
    background-color: #f3f3f3;
    overflow: auto;
    padding: 20px 10px;
  }

  /deep/ .el-tree {
    background-color: transparent;
  }

  /deep/ .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
    background-color: #c2f5f5;
  }

  .people-main-right {
    flex: 7;
    height: 480px;
    background-color: #f3f3f3;
    margin-left: 10px;
    padding: 20px 10px;
  }

  .people-main-right-search /deep/ .el-input .el-input__inner {
    border-radius: 40px;
    border: 1px solid #000000;
    color: black;
  }

  /deep/ .el-tabs__item {
    padding: 0px 23px 0px 0px;
  }
  
  .people-main-right-page {
    margin-top: 20px;
    text-align: right;
  }
  
  .people-footer {
    height: 180px;
    background-color: #f3f3f3;
    padding: 20px;
    color: black;
  }
  
  .peopleList {
    display: flex;
    margin-top: 15px;
  }
  
  .peopleList-item {
    width: 96px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    border: 1px solid #108cee;
    border-radius: 5px;
    margin-right: 20px;
  }
  .people-footer .el-icon-remove-outline {
    color: #2f9aef;
    font-size: 16px;
  }
  
  .people-main-right-table {
    margin-top: 40px;
  }
</style>
