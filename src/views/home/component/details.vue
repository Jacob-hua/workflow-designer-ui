<template>
  <div>
    <el-dialog title="部署工作流" :visible.sync="dialogVisible1" width="70%" custom-class="dialogVisible1">
      <div>
        <ProcessInformation type="details1"></ProcessInformation>
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
            <div class="detail-list-item" v-for="item in 5">
              <span class="detailsWord" @click="dialogVisible2Detail()">详情</span>
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
    <el-dialog title="部署工作流" :visible.sync="dialogVisible2" width="70%" custom-class="dialogVisible1">
      <div>
        <ProcessInformation type="details2"></ProcessInformation>
      </div>
      <div class="bpmn-configure">
        <div class="bpmn-configure-basic">
          <div class="bpmn-configure-title">工单分配</div>
          <div class="bpmn-configure-Main">
            <div class="bpmn-configure-Main-item"> <span>名<span style="visibility: hidden;">占位</span>称</span>: <span>工单分配</span> </div>
            <div class="bpmn-configure-Main-item"> <span>绑定岗位</span>: <span>班组长</span> </div>
            <div class="bpmn-configure-Main-item"> <span>绑定岗位</span>: <span>张三</span> </div>
            <div class="bpmn-configure-Main-item"> <span>备<span style="visibility: hidden;">占位</span>注</span>: <span>看不到看不到看不到</span> </div>
          </div>
        </div>
        <div class="bpmn-configure-form">
          <div class="bpmn-configure-title">工单分配-表单内容</div>
          <div class="bpmn-configure-Main">
            <span v-if="true" class="noneForm"> 当前未关联表单 </span>
            <div v-if="false"></div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">回收</el-button>
        <el-button @click="dialogVisible2 = false">删除</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import ProcessInformation from './ProcessInformation.vue'
  export default {
    data() {
      return {
        dialogVisible1: false,
        dialogVisible2: false,
        postData: {
          system: '1'
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
    },
    methods:{
      dialogVisible2Detail() {
        this.dialogVisible2 = true
      }
    }
  }
</script>

<style scoped="scoped">
  /deep/ .el-dialog__body {
    max-height: 90vh;
    word-break: normal;
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
    /* display: flex; */
    width: 1312px;
    padding-bottom: 10px;
    margin-bottom: 20px;
    /* height: 200px; */
    overflow: auto;
    white-space:nowrap;
  }
  .detail-list::-webkit-scrollbar {
    width: 0px;
    /* height: 2px; */
  }
  .detail-list-item {
    position: relative;
    display: inline-block;
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
  
  /deep/ .el-dialog__footer {
    text-align: center;
  }
  
  .bpmn-configure {
    display: flex;
  }
  
  .noneForm {
    display: inline-block;
    height: 160px;
    width: 100%;
    text-align: center;
    line-height: 160px;
  }
  
  .bpmn-configure-title {
    height: 40px;
    line-height: 40px;
  }
  
  .bpmn-configure-basic {
    flex: 1;
  }
  
  .bpmn-configure-form {
    flex: 3;
    margin-left: 20px;
  }
  
  .bpmn-configure-Main {
    height: 200px;
    border: 1px solid #000000;
    padding: 20px 10px;
  }
  
  .bpmn-configure-Main-item {
    margin-bottom: 20px;
    color: black;
  }
  
</style>
