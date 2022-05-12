<template>
  <div class="pe-tree tree-container">
    <el-tree :data="data" class="tree" :indent="0">
      <div class="custom-tree-node" slot-scope="{ node }">
        <span class="pe-tree-label">{{ node.label }}</span>
      </div>
    </el-tree>
  </div>
</template>

<script>
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
      }
    }
  }
</script>

<style scoped="scoped">
 /deep/ .el-tree {
    background: transparent;
  }
  /deep/ .el-tree-node__content {
    height: 40px;
    line-height: 40px;
    width: 100%;
    margin: 5px 0px;
    background-color: transparent !important;
  }
  /deep/ .el-tree-node__content:hover {
    background-color: transparent;
  }
  .custom-tree-node {
    width: 100%;
    /* background-image: url(img/defBg.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-color: transparent !important; */
  }
  
	/deep/ .el-tree .is-current>.el-tree-node__content .custom-tree-node {
		/* background-image: url(img/checkBg.png); */
    background-color: #cce4ff;
	}
	
  .pe-tree-label {
    display: inline-block;
    margin-left: 10px;
  }
 
	/deep/ .el-tree>.el-tree-node::before {
		display: none;
	}
	
  /deep/ .el-tree-node__expand-icon {
    /* display: none; */
  }
  
  .tree /deep/ .el-tree-node {
    position: relative;
    padding-left: 10px;
  }
   
  .tree /deep/ .el-tree-node__children {
    padding-left: 30px;
  }
   
  .tree /deep/ .el-tree-node :last-child:before {
    height: 45px;
  }
   
  .tree /deep/ .el-tree > .el-tree-node:before {
    border-left: none;
  }
   
  .tree-container /deep/ .el-tree > .el-tree-node:after {
    border-top: none;
  }
   
  .tree /deep/ .el-tree-node:before {
    content: "";
    left: -15px;
    position: absolute;
    right: auto;
    border-width: 1px;
  }
   
  .tree /deep/ .el-tree-node:after {
    content: "";
    left: -15px;
    position: absolute;
    right: auto;
    border-width: 1px;
  }
  .tree /deep/ .el-tree-node__expand-icon.is-leaf {
    display: none;
  }
   
  .tree /deep/ .el-tree-node:before {
    border-left: 1px dashed #C0C4CC;
    bottom: 0px;
    height: 110%;
    top: -26px;
    width: 1px;
  }
   
  .tree /deep/ .el-tree-node:after {
    border-top: 1px dashed #C0C4CC;
    height: 20px;
    top: 20px;
    width: 25px;
  }
</style>
