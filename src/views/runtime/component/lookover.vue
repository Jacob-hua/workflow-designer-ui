<template>
  <el-dialog title="终止" :visible.sync="dialogVisible" width="70%" :before-close="handleClose">
    <div>
      <ProcessInformation ref="ProcessInformation"></ProcessInformation>
    </div>
    <div style="position: relative;">
      <span style="position: absolute;right: 10px;color: #0055ff;cursor: pointer;" @click="goReject">执行</span>
      <div style="margin: 20px 0px 10px 0px;font-weight: 700;">工作流执行详情</div>
      <div class="processDetail">
        <div class="block">
          <el-timeline>
            <el-timeline-item timestamp="任务#1" placement="top">
              <div class="contant">
                <i class="el-icon-check success"></i>
                <span class="word1">巡视计划自动生成</span>
                <span class="dataYear">2020-04-01</span>
                <span class="dataMin">14:11:12</span>
              </div>
            </el-timeline-item>
            <el-timeline-item timestamp="任务#2" placement="top">
              <div class="contant">
                <div>
                  <span>现场负责人</span>
                  <span style="margin-left: 20px;">昊昊</span>
                </div>
                <div>
                  <span>现场操作人</span>
                  <span style="margin-left: 20px;">旺仔</span>
                  <span style="margin-left: 20px;">京博</span>
                </div>
                <div>
                  <i class="el-icon-check success"></i>
                  <span class="word1">大乔</span>
                  <span class="dataYear">2020-04-01</span>
                  <span class="dataMin">14:11:12</span>
                </div>
              </div>
            </el-timeline-item>
            <el-timeline-item timestamp="任务#3" placement="top">
              <div class="contant">
                <div>
                  <i class="el-icon-check success"></i>
                  <span class="word1">昊昊</span>
                  <span class="dataYear">2020-04-01</span>
                  <span class="dataMin">14:11:12</span>
                </div>
                <div>
                  <i class="el-icon-check success"></i>
                  <span class="word1">旺仔</span>
                  <span class="dataYear">2020-04-01</span>
                  <span class="dataMin">14:11:12</span>
                </div>
                <div>
                  <i class="el-icon-check error"></i>
                  <span class="word1">京博</span>
                </div>
              </div>
            </el-timeline-item>
            <el-timeline-item timestamp="任务#4" placement="top">
              <div class="contant">
                <i class="el-icon-check success"></i>
                <span class="word1">昊昊</span>
                <span class="dataYear">2020-04-01</span>
                <span class="dataMin">14:11:12</span>
              </div>
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
  import ProcessInformation from '@/views/home/component/ProcessInformation.vue'
  export default {
    data() {
      return {
        dialogVisible: false
      }
    },
    methods: {
      handleClose() {
        this.dialogVisible = false
      },
      goReject() {
        this.$emit('goReject')
      }
    },
    components:{
      ProcessInformation
    }
  }
</script>

<style scoped="scoped">
  .processDetail {
    border: 1px solid #000000;
    height: 300px;
    overflow: auto;
    padding: 10px 10px;
  }
  /deep/ .el-dialog__body {
    max-height: 97vh;
  }
  /deep/ .el-timeline-item__tail {
    border-left: 2px solid #7fbcff;
  }
  /deep/ .el-timeline-item__node {
    background-color: #7fbcff;
  }
  .contant {
    background-color: #f2f2f2;
    line-height: 54px;
    padding: 0px 20px;
    position: relative;
  }
  .el-icon-check {
    font-size: 20px;
    margin-right: 20px;
  }
  .success {
    background-color: #009900;
    color: white;
    border-radius: 50%;
    /* border: 1px solid #009900; */
    border: none;
  }
  .error {
    background-color: #999999;
     color: white;
     border-radius: 50%;
     border: none;
  }
  .dataYear {
    position: absolute;
    right: 100px;
  }
  .dataMin {
    position: absolute;
    right: 20px;
  }
</style>
