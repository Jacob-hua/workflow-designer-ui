<template>
  <el-dialog
      title="业务配置"
      :visible.sync="dialogVisible"
      v-if="dialogVisible"
      width="50%"
      @close="handleClose()"
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
    >
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span >{{ data.name }}
          <el-input size="mini" v-if="showinput && data.id === currentNode.id" v-model="nodeCode" placeholder="请输入项目code"></el-input>
          <el-input size="mini" v-if="showinput && data.id === currentNode.id" placeholder="请输入节点名称"  v-model="inptVal"></el-input>
          <span class="plain" @click="onblur(node, data)"  v-if="showinput && data.id === currentNode.id">确定</span>
        </span>
        <span>
          <i v-if="editFlag && node.level < 3" @click="(e)=> append(data,node)" style="font-size: 20px !important; color: #409eff;margin-left: 10px" class="el-icon-circle-plus-outline"></i>
          <i v-if="data.id !==1 && data.parentId != -1" @click="remove(node, data)" style="font-size: 20px !important; color: red;margin-left: 10px" class="el-icon-remove-outline"></i>
        </span>
      </span>
    </el-tree>
    <div v-if="!editFlag" class="preview"><el-tree class="tree" default-expand-all :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree></div>
    <span slot="footer" class="dialog-footer">
<!--      <el-button class="next" v-if="editFlag && !edit"  @click="dialogVisible = false; $emit('showAddOrEidtDailog','pre')">上一步</el-button>-->
<!--      <el-button  class="next" v-if="showBtn && btnTxt === '预览'"  @click="preview">{{btnTxt}}</el-button>-->
      <el-button  class="cancel" v-if="showBtn"  @click="exit">退出</el-button>
  </span>
  </el-dialog>
</template>

<script>
import {
  checkCode,
  clearRedisBusinessConfigCode,
  createBusinessConfig,
  updateBusinessConfig,
  businessConfigWithTreeCreate, deleteBusinessConfig,
} from "@/api/globalConfig";

import { mapState } from 'vuex'
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
    type: {
      type: String,
      default: 'edit'
    }
  },

  data() {
    return {
      nodeCode: '',
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
          "createBy": '',
          "tenantId": '',
          "ascription": ''
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  computed: {
    ...mapState('account',['tenantId', 'userInfo'])
  },
  mounted() {
    this.data[0].tenantId = this.tenantId
    this.data[0].createBy = this.userInfo.account
  },
  methods: {
    businessConfigWithTreeCreate(params) {
      let _this = this
      businessConfigWithTreeCreate(params).then(res => {
        console.log(res)
        if (res.result.parentId === '-1' ) {
          _this.$set(_this.data, 0, res.result)
        } else {
          if (!this.currentNode.children) {
              this.$set(this.currentNode, 'children', []);
            }
            this.currentNode.children.push(res.result);
            this.showinput = false
        }

      })
    },
    exit() {
      this.dialogVisible = false
      this.clearRedisBusinessConfigCode({},true)
      this.$parent.getBusinessConfigBasicList()
    },
    handleClose() {
      this.clearRedisBusinessConfigCode({},true)
      this.$parent.getBusinessConfigBasicList()
    },
    goEdit() {
      this.editFlag = true
      this.btnTxt = '预览'
    },
    preview() {
      let _this = this
      if (this.btnTxt === '保存') {
        if (!_this.edit) {
          delete this.data[0].id
        }
        if(this.type === 'see') {
          createBusinessConfig(this.data).then((res)=> {
            this.dialogVisible = false
            this.$message({
              type: 'success',
              message: '保存成功'
            })
            _this.$parent.getBusinessConfigBasicList()
          })
        } else {
          updateBusinessConfig(this.data).then((res)=> {
            this.dialogVisible = false
            this.$message({
              type: 'success',
              message: '保存成功'
            })
            _this.$parent.getBusinessConfigBasicList()
          })
        }
      } else {
        this.editFlag = false
        this.btnTxt = '保存'
      }

    },
    onblur(node, data) {
      if (this.nodeCode && this.inptVal) {
        checkCode({
          tenantId: this.tenantId,
          code: this.nodeCode,
          projectCode: this.forms.code || this.data[0].code
        }).then(res => {
          if (res.errorInfo.errorMsg) {
            return
          }
          this.businessConfigWithTreeCreate({
            "code": this.nodeCode,
            "name": this.inptVal,
            "createBy":this.userInfo.account,
            "tenantId":this.tenantId,
            "type":"industry",
            "parentId":data.id,
            "ascription":this.data[0].code
          })
        })
      } else {
        this.$message({
          type: 'warning',
          message: 'code 或节点名称不能为空'
        })
      }
    },
    handleNodeClick(data) {
    },
    append(data, node) {
      this.nodeCode = ''
      this.inptVal = ''
      this.showinput = true
      this.currentNode = data
    },
    clearRedisBusinessConfigCode(data, cleaAllFlag = false) {
      clearRedisBusinessConfigCode({
        tenantId: this.tenantId,
        code: data.code ?? '',
        projectCode: this.forms.code?? '',
        cleaAllFlag
      })
    },
    remove(node, data) {
      deleteBusinessConfig({
        id: parseInt(data.id),
        projectCode: this.data[0].code,
        tenantId: this.tenantId,
        updateBy: this.userInfo.account
      }).then(res=> {
        this.$message({
          type: 'success',
          message: '删除成功'
        })
        const parent = node.parent;
        const children = parent.data.children || parent.data;
        const index = children.findIndex(d => d.id === data.id);
        children.splice(index, 1);
      })

    },
  }
}
</script>

<style scoped lang="scss">
.plain {
  display: inline-block;
  font-size: 14px;
  color: #FFAB00;
  width: 100px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  padding: 0;
  border: 1px solid #FFAB00;
  background-color: transparent;
  border-radius: 4px;
  cursor: pointer;
}

.next {
  @include primaryBtn;
}
.cancel {
  @include cancelBtn;
}

/deep/ .el-tree-node__content:hover, .el-upload-list__item:hover {
  background-color: unset !important;
}

/deep/ .el-tree-node:focus > .el-tree-node__content {
  background-color: unset !important;
}
/deep/ .custom-tree-node:hover  {
  background-color: unset !important;
}
.el-tree .is-current > .el-tree-node__content .custom-tree-node {
  background-color: unset !important; ;
}
/deep/ .el-input--mini {
  width: 150px;
}
@include tree;

.btn {
  position: relative;
  left: 90%;
}
</style>