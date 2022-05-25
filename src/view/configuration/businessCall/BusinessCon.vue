<template>
  <el-dialog
      title="业务配置"
      :visible.sync="dialogVisible"
      v-if="dialogVisible"
      width="50%"
      append-to-body
  >
    <el-button @click="goEdit" v-if="!editFlag && showBtn  " type="primary" class="btn">继续编辑</el-button>
    <el-tree
        v-if="editFlag"
        class="tree"
        :data="data"
        node-key="id"
        default-expand-all
        :expand-on-click-node="false"
        @node-drag-start="handleDragStart"
        @node-drag-enter="handleDragEnter"
        @node-drag-leave="handleDragLeave"
        @node-drag-over="handleDragOver"
        @node-drag-end="handleDragEnd"
        @node-drop="handleDrop"
        draggable
    >
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span >{{ data.name }}<el-input size="mini" v-if="showinput && data.id === currentNode.id" @blur="onblur"  v-model="inptVal"></el-input></span>
        <span>
          <i v-if="editFlag" @click="(e)=> append(data,node)" style="font-size: 20px !important; color: #409eff;margin-left: 10px" class="el-icon-circle-plus-outline"></i>
          <i v-if="data.id !==1" @click="remove(node, data)" style="font-size: 20px !important; color: red;margin-left: 10px" class="el-icon-remove-outline"></i>
        </span>
      </span>
    </el-tree>
    <div v-if="!editFlag" class="preview"><el-tree class="tree" default-expand-all :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree></div>
    <span slot="footer" class="dialog-footer">
      <el-button v-if="editFlag && !edit"  @click="dialogVisible = false; $emit('showAddOrEidtDailog','pre')">上一步</el-button>
      <el-button v-if="showBtn"  @click="preview">{{btnTxt}}</el-button>
      <el-button v-if="showBtn"  @click="dialogVisible = false">取 消</el-button>
  </span>
  </el-dialog>
</template>

<script>
import {addBusinessConfig, UpdatebusinessConfig} from "@/api/globalConfig";

let id = 2;
export default {
  name: "BusinessCon",

  props: {
    edit: {
      type: Boolean,
      default: false
    },
    showBtn: {
      type: Boolean,
      default: true
    },
  },

  data() {
    return {
      btnTxt: '预览',
      editFlag: true,
      forms: {},
      currentNode: {},
      inptVal: '',
      showinput: false,
      dialogVisible: false,
      data:  [
        {
          "code": 1,
          "label": '莱芜供热项目',
          "name": '',
          "active": "Y",
          "type": 'industry',
          "parentId":	-1,
          "createBy": this.$store.state.userInfo.name,
          "tenantId": this.$store.state.tenantId
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  methods: {
    goEdit() {
      this.editFlag = true
      this.btnTxt = '预览'
    },
    preview() {
      let _this = this
      if (this.btnTxt === '保存') {
        console.log(this.data)
        if (!_this.edit) {
          delete this.data[0].id
        }
        addBusinessConfig(this.data).then((res)=> {
          this.dialogVisible = false
          this.$message({
            type: 'success',
            message: '保存成功'
          })

          _this.$parent.getBusinessConfigBasicList()
        })
      } else {
        this.editFlag = false
        this.btnTxt = '保存'
      }

    },
    onblur() {
      this.showinput = false
      const newChild = { "id": id++,  "code": id++, "tenantId": this.$store.state.tenantId,  "createBy": this.$store.state.userInfo.name,  "type": 'industry',   "active": "Y", "name": this.inptVal, "children": [] };
      if (!this.currentNode.children) {
        this.$set(this.currentNode, 'children', []);
      }
      this.currentNode.children.push(newChild);
    },
    handleNodeClick(data) {
    },
    append(data, node) {
      this.inptVal = ''
      this.showinput = true
      this.currentNode = data
    },

    remove(node, data) {
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.id === data.id);
      children.splice(index, 1);
    },

    renderContent(h, { node, data, store }) {
      return (
          <span class="custom-tree-node">
            <span>{node.label}</span>
            <span>
              <i className="el-icon-circle-plus-outline" on-click={ () => this.append(data) }></i>
              <el-button size="mini" type="text" on-click={ () => this.remove(node, data) }>Delete</el-button>
            </span>
          </span>);
    },
    handleDragStart(node, ev) {
      console.log('drag start', node);
    },
    handleDragEnter(draggingNode, dropNode, ev) {
      console.log('tree drag enter: ', dropNode.label);
    },
    handleDragLeave(draggingNode, dropNode, ev) {
      console.log('tree drag leave: ', dropNode.label);
    },
    handleDragOver(draggingNode, dropNode, ev) {
      console.log('tree drag over: ', dropNode.label);
    },
    handleDragEnd(draggingNode, dropNode, dropType, ev) {
      console.log('tree drag end: ', dropNode && dropNode.label, dropType);
    },
    handleDrop(draggingNode, dropNode, dropType, ev) {
      console.log('tree drop: ', dropNode.label, dropType);
    },
  }
}
</script>

<style scoped>

/deep/ .el-dialog__header {
  background-color: #e4e4e4;
  border-bottom: 1px solid #000000;
}
/deep/ .el-input--mini {
  width: 150px;
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
  border-width: 1px;
  border-left: 1px dashed #5abcde;
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
  border-width: 1px;
  border-top: 1px dashed #5abcde;
  height: 20px;
  top:12px;
  width: 30px ;
}
.btn {
  position: relative;
  left: 90%;
}
</style>