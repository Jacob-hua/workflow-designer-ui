<template>
  <div>
    <el-dialog title="部署工作流" :visible.sync="dialogVisible1" width="70%" custom-class="dialogVisible1">
      <div>
        <ProcessInformation></ProcessInformation>
      </div>
      <div>
        <div class="details-header">
          <span>能源系统</span>
          <span class="inputSelect">
            <el-select v-model="postData.system" placeholder="请选择">
                <el-option
                  v-for="item in optionSystem"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
          </span>
          <span class="frequency">已部署次数:5</span>
        </div>
        <div class="detail-list">
          <div class="detail-list-item" v-for="item in 4">
            <span class="detailsWord">详情</span>
            <div class="item-item">
              <span>部署名称:</span>
              <span>一般性周期巡视</span>
            </div>
            <div class="item-item">
              <span>部署人:</span>
              <span>张三</span>
            </div>
            <div class="item-item">
              <span>部署时间:</span>
              <span>2021-11-12 14:11:23</span>
            </div>
            <div class="item-item">
              <span>状态:</span>
              <span>已激活</span>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import ProcessInformation from './ProcessInformation.vue'
  export default {
    data() {
      return {
        dialogVisible1: false,
        postData: {
          system: ''
        },
        optionSystem: [
          {
            value: '1',
            label: '配电'
          },
          {
            value: '2',
            label: '空压'
          },
          {
            value: '3',
            label: '供暖'
          },
          {
            value: '4',
            label: '空调'
          },
        ]
      }
    },
    components:{
      ProcessInformation
    }
  }
</script>

<style scoped="scoped">
  /deep/ .el-dialog__body {
    max-height: 90vh;
  }
  .details-header {
    margin-top: 20px;
  }
  .inputSelect {
    margin-right: 20px;
    display: inline-block;
    margin-left: 20px;
  }
  .inputSelect /deep/ .el-input__inner {
    width: 180px;
    height: 43px;
    line-height: 43px;
    padding: 0px 10px;
    border: 1px solid black;
  }
  .frequency {
    color: #0066cc;
    font-weight: 700;
  }
  .detail-list {
    margin-top: 30px;
    display: flex;
    width: 1312px;
    height: 200px;
    overflow: auto;
  }
  .detail-list::-webkit-scrollbar {
    width: 0px;
    height: 2px;
  }
  .detail-list-item {
    position: relative;
    /* display: inline-block; */
    width: 290px;
    height: 165px;
    border: 1px solid black;
    padding: 20px 20px;
    margin-right: 40px;
  }
  .detailsWord {
    position: absolute;
    top: 10px;
    right: 10px;
    color: #0066CC;
    cursor: pointer;
  }
  
  .detail-list-item .item-item {
    line-height: 35px;
    color: black;
  }
  
</style>
