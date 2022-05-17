<template>
  <div>
    <el-dialog
        title="自定义启动"
        :visible.sync="dialogVisible2"
        v-if="dialogVisible2"
        width="30%"
        append-to-body
    >
      <div>
        <p class="tit">自定义启动项</p>
        <el-tag
            v-for="tag in tags"
            :key="tag.name"
            closable
            @close="handleClose(tag)"
            :type="tag.type">
          {{tag.name}}
        </el-tag>
        <p class="tit">新增</p>
        <div style="display: flex">
          <el-input v-model="inputValue"></el-input><el-button @click="handleInputConfirm" type="primary">新增</el-button>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary"  @click="saveTag">保 存</el-button>
        <el-button @click="dialogVisible2= false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
        title="启动项配置"
        :visible.sync="dialogVisible"
        v-if="dialogVisible"
        width="60%"
        append-to-body
    >
      <div class="start_container">
        <div class="start_left">
          <el-tree class="tree" default-expand-all :data="data" :props="defaultProps" ></el-tree>
        </div>
        <div class="start_right">
          <p>自定义启动项</p>
          <div v-if="!tableData.length" class="tip_content">当前未配置自定义启动项</div>
          <el-button @click="showSelf">自定义</el-button>
          <el-button @click="editTable" v-if="btnFlag && tableData.length" style="margin-left: 560px" type="primary">编辑</el-button>
          <el-table
              v-if="tableFlag && tableData.length > 0"
              :data="tableData"
              style="width: 100%">
            <el-table-column
                prop="name"
                label="启动项"
                width="180">
            </el-table-column>
            <el-table-column
                prop=""
                label="配置"
                width="180">
              <template slot-scope="scope">
                <el-checkbox :disabled="scope.row.disabled" v-model="scope.row.isConfig"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column
                prop=""
                label="必填">
              <template slot-scope="scope">
                <el-checkbox :disabled="scope.row.disabled" v-model="scope.row.required"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column
                v-if="processFlag"
                prop=""
                label="操作">
              <template slot-scope="scope">
                <span style="color: #1d89ff; cursor: pointer">删除</span>
              </template>
            </el-table-column>
          </el-table>
        </div>

      </div>
      <span slot="footer" class="dialog-footer">
        <el-button   @click="dialogVisible = false">保 存</el-button>
        <el-button   @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "startItemCon",
  data() {
    return {
      processFlag: false,
      btnFlag: false,
      tableFlag: false,
      tableData: [],
      inputValue: '',
      tags: [],
      color: ['','success','info','warning','danger'],
      dialogVisible: false,
      dialogVisible2: false,
      data:  [
        {
          id: 1,
          label: '莱芜供热项目',
          children: [{
            label: '二级 1-1',
            children: [{
              label: '三级 1-1-1'
            }]
          }]
        },],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  methods: {
    editTable() {
      console.log(this.tableData)
      this.processFlag =true
      this.tableData.forEach(item => item.disabled = false)
    },
    saveTag () {
      this.dialogVisible2 = false;
      this.tableData = this.tags;
      this.tableFlag= true;
      this.btnFlag= true;
    },
    showSelf() {
      this.dialogVisible2 = true
    },
    handleClose(tag) {
      this.tags.splice(this.tags.findIndex((item,index) => item.name === tag.name ), 1);
    },
    handleInputConfirm() {
      let inputValue = this.inputValue;
      let index = parseInt(Math.random() * 5)
      if (inputValue) {
        this.tags.push({
          name: this.inputValue,
          isConfig: true,
          required: true,
          type: this.color[index],
          disabled: true});
      }
      this.inputValue = '';
    }
  }
}
</script>

<style scoped>
/deep/ .el-dialog__header {
  background-color: #e4e4e4;
  border-bottom: 1px solid #000000;
}
/deep/ .el-input {
  width: 420px;
}
/deep/ .el-tag {
  margin-right: 10px;
  margin-top: 5px;
}
.tit {
  color: #1d89ff;
}
.tip_content {
  width: 713px;
  height: 73px;
  line-height: 73px;
  text-align: center;
  font-size: 20px;
  color: blue;
  box-sizing: border-box;
  border-radius: 4px;
  background-color: rgb(242, 242, 242);
}
.start_container {
  display: flex;
}
.start_right {
  width: 70%;
  padding: 10px;
  margin-left: 20px;
  border: 1px solid rgb(204, 204, 204);
}
.start_right p {
  color: #000;
}
.start_right button {
  margin-top: 20px;
}
.start_left {
  padding-left: 10px;
  width: 300px;
  height: 600px;
  border: 1px solid rgb(204, 204, 204);
}
.tree /deep/ .el-tree-node {
  position: relative;
  padding-left: 0 ;
}

.tree /deep/ .el-tree-node__children {
  padding-left: 26px;
  padding-top: 20px;
}

.tree /deep/ .el-tree-node :last-child:before {
  height: 12px;
}

.tree /deep/ .el-tree > .el-tree-node:before {
  border-left: none;
}

.tree-container /deep/ .el-tree > .el-tree-node:after {
  border-top: none;
}

.tree /deep/ .el-tree-node:before {
  content: '';
  left: -4px;
  position: absolute;
  right: auto;
  border-width: 2px;
  border-left: 2px dashed #5abcde;
  bottom: 0px;
  height: 100%;
  top: 0px;
  width: 1px;
}

.tree /deep/ .el-tree-node:after {
  content: '';
  left: -4px;
  position: absolute;
  right: auto;
  border-width: 2px;
  border-top: 2px dashed #5abcde;
  height: 20px;
  top:12px;
  width: 30px ;
}
</style>