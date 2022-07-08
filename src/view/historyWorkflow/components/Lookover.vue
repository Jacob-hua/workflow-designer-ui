<template>
  <el-dialog title="历史工作流详情" :visible.sync="dialogVisible" top="1vh" width="70%" :before-close="handleClose">
    <div>
      <ProcessInformation ref="ProcessInformation" v-if="dialogVisible"></ProcessInformation>
    </div>
    <div style="position: relative">
      <div style="margin: 20px 0px 10px 0px; font-weight: 700">工作流执行详情</div>
      <div class="processDetail">
        <div class="block">
          <template v-if="listData.length > 0">
            <el-timeline>
              <el-timeline-item
                :timestamp="item.taskName"
                placement="top"
                v-for="(item, index) in listData"
                :key="index"
              >
                <div class="contant">
                  <div v-if="item.formVariable && JSON.parse(item.formVariable).list" class="form">
                    <preview
                      :itemList="formListFun(item.formVariable)"
                      :formConf="configFun(item.formVariable)"
                    ></preview>
                  </div>
                  <div v-if="item.formVariable && JSON.parse(item.formVariable).components">
                    <div v-for="(item, index) in JSON.parse(item.formVariable).components" :key="index">
                      <span>{{ item.label }}</span>
                      <span style="margin-left: 20px">{{ item.value }}</span>
                    </div>
                  </div>
                  <div v-if="item.status === 'completed'">
                    <i class="el-icon-check" :class="item.time === '-' ? 'error' : 'success'"></i>
                    <span class="word1">{{ item.assignee }} <span>(执行)</span></span>
                    <span class="dataYear">{{ item.endTime }}</span>
                  </div>
                  <div v-if="item.status === 'deleted'">
                    <div>
                      <i class="el-icon-warning-outline success"></i>
                      <span class="word1">{{ item.commentList[0] && item.commentList[0] }}</span>
                    </div>
                    <div>
                      <i class="el-icon-check" :class="item.time === '-' ? 'error' : 'success'"></i>
                      <span class="word1">{{ item.assignee }} <span style="color: red">(驳回)</span> </span>
                      <span class="dataYear">{{ item.time }}</span>
                    </div>
                  </div>
                </div>
              </el-timeline-item>
            </el-timeline>
          </template>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import ProcessInformation from '@/view/historyWorkflow/components/ProcessInformation'
import { getTaskTrackList } from '@/api/unit/api.js'
import preview from '@/plugin/FormDesign/component/preview'
export default {
  data() {
    return {
      dialogVisible: false,
      listData: [],
    }
  },
  methods: {
    handleClose() {
      this.dialogVisible = false
    },
    getListData(id) {
      getTaskTrackList({
        processInstanceId: id,
      }).then((res) => {
        this.listData = res.result
      })
    },
    formListFun(item) {
      let content = JSON.parse(item)
      let list = content.list
      for (const formItem of list) {
        if (formItem.columns && formItem.columns.length) {
          for (const formItemElement of formItem.columns) {
            for (const formItemElementElement of formItemElement.list) {
              formItemElementElement.disabled = true
            }
          }
        } else {
          if (Object.keys(formItem).includes('disabled')) {
            formItem.disabled = true
          } else {
          }
        }
      }
      return list
    },
    configFun(item) {
      return JSON.parse(item).config
    },
  },
  components: {
    ProcessInformation,
    preview,
  },
}
</script>

<style scoped lang="scss">
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
  right: 20px;
}
.dataMin {
  position: absolute;
  right: 20px;
}
.contant .form {
  padding-top: 20px;
}
</style>
