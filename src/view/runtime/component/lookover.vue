<template>
  <el-dialog title="终止" :visible.sync="dialogVisible" width="70%" :before-close="handleClose">
    <div>
      <ProcessInformation ref="ProcessInformation" :processTaskList="listData" v-if="dialogVisible" seeType="runTime"></ProcessInformation>
    </div>
    <div style="position: relative;">
      <!-- <span style="position: absolute;right: 10px;color: #0055ff;cursor: pointer;" @click="goReject">执行</span> -->
      <div style="margin: 20px 0px 10px 0px;font-weight: 700;">工作流执行详情</div>
      <div class="processDetail">
        <div class="block">
          <el-timeline>
            <el-timeline-item :timestamp="item.taskName" placement="top" v-for="(item, index) in listData" :key="index">
              <div class="contant">
                <div v-for="(item1, index1) in item.formDataList">
                  <div v-for="(item2, index2) in JSON.parse(item1.formData)">
                    <span>{{ item2.label }}</span>
                    <span style="margin-left: 20px;">{{ item2.value }}</span>
                  </div>
                  <div v-if="item1.status === 'completed'">
                    <i class="el-icon-check" :class="item.endTime === '-' ? 'error' : 'success'"></i>
                    <span class="word1">{{ item1.assignee }} <span>(执行)</span></span>
                    <span class="dataYear">{{ item.endTime }}</span>
                  </div>
                 <div v-if="item.status === 'rejected'">
                    <div v-for="(item1, index1) in item.commentList">
                      <div v-for="(item2, index2) in item1.comments">
                        <i class="el-icon-warning-outline success"></i>
                        <span class="word1">{{ item2.message }}</span>
                      </div>
                      <div>
                        <i class="el-icon-check" :class="item.endTime === '-' ? 'error' : 'success'"></i>
                        <span class="word1">{{ item1.assignee }} <span style="color: red;">(驳回)</span> </span>
                        <span class="dataYear">{{ item.endTime }}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- <div v-for="(item, index) in JSON.parse(item.formData)">
                  <span>{{ item.label }}</span>
                  <span style="margin-left: 20px;">{{ item.value }}</span>
                </div> -->
                <!-- <div v-if="item.status === 'completed'">
                  <i class="el-icon-check" :class="item.time === '-' ? 'error' : 'success'"></i>
                  <span class="word1">{{ item.assignee }} <span>(执行)</span></span>
                  <span class="dataYear">{{ item.time }}</span>
                </div> -->
                <!-- <div v-if="item.status === 'deleted'">
                  <div>
                    <i class="el-icon-warning-outline success"></i>
                    <span class="word1">{{ item.commentList[0] }}</span>
                  </div>
                  <div>
                    <i class="el-icon-check" :class="item.time === '-' ? 'error' : 'success'"></i>
                    <span class="word1">{{ item.assignee }} <span style="color: red;">(驳回)</span> </span>
                    <span class="dataYear">{{ item.time }}</span>
                  </div>
                </div> -->
              </div>
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
  import ProcessInformation from '@/component/bpmnView/ProcessInformation.vue'
  import {
    getTaskTrackList
  } from '@/api/unit/api.js'
  export default {
    data() {
      return {
        dialogVisible: false,
        listData: []
      }
    },
    methods: {
      handleClose() {
        this.dialogVisible = false
      },
      goReject() {
        this.$emit('goReject', this.$refs.ProcessInformation.postData)
      },
      getListData(result) {
        this.listData = JSON.parse(JSON.stringify(result))
        this.listData.forEach((item, index) => {
          item.status.split(',').forEach((item1, index1) => {
            item.formDataList[index1].status = item1
          })
        })
        
      },
      // getListData(id) {
      //   return getTaskTrackList({
      //     processInstanceId: id
      //   }).then((res) => {
      //     this.listData = res.result
      //   })
      // }
    },
    components: {
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

  .el-icon-warning-outline {
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
    right: 20px;
  }

  .dataMin {
    position: absolute;
    right: 20px;
  }
</style>
