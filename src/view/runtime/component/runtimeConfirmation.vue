<template>
  <div>
    <el-dialog title="流程挂起" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <div class="runtimeConfirmation">
        <div class="title">请输入账号密码进行校验，将此工作流程挂起</div>
        <el-form ref="form" :model="form" label-width="40px">
          <el-form-item label="账号">
            <el-input v-model="form.username" @keyup.native.enter="handleOK"></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="form.password" show-password @keyup.native.enter="handleOK"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleOK()">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="驳回" :visible.sync="dialogVisible2" width="70%" :before-close="handleClose">
      <processData ref="processData" v-if="dialogVisible2" @selection="selection" v-bind="$attrs" :processInstanceId="processInstanceId"></processData>
      <div>
        <div class="rejectWord">驳回原因（必填）</div>
        <div>
          <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="textarea">
          </el-input>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="handleReject()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="终止" :visible.sync="dialogVisible3" width="70%" :before-close="handleClose">
            <div>
              <div class="rejectWord">终止原因（必填）</div>
              <div>
                <el-input
                  type="textarea"
                  :rows="15"
                  placeholder="请输入内容"
                  v-model="termination">
                </el-input>
              </div>
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible3 = false">取 消</el-button>
              <el-button type="primary" @click="handleTermination()">确 定</el-button>
            </span>
          </el-dialog>
  </div>

</template>

<script>
  import processData from './processData.vue'
  import {
    putHangInstance,
    postVerifyUser,
    putRejectTask,
    putCancelInstance,
    getActiveInstance
  } from '@/api/unit/api.js'
  export default {
    props:{
      processInstanceId: {
        type: String,
        default: ''
      },
      processInstanceDetail: {
         type: Object,
      },
      taskKey: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        dialogVisible: false,
        dialogVisible2: false,
        dialogVisible3: false,
        textarea: '',
        termination: '',
        selectData: null,
        selectValue: null,
        form: {
          username: '',
          password: ''
        }
      }
    },
    methods: {
      handleClose() {
        this.dialogVisible = false
        this.dialogVisible2 = false
        this.dialogVisible3 = false
      },
      selection(val, selectValue) {
        this.selectData = val
        this.selectValue = selectValue
      },
      handleReject() {
        putRejectTask({
          message: this.textarea,
          processInstanceId: this.processInstanceId,
          taskKey: this.selectValue,
          userId: this.$store.state.userInfo.name,
          currentTaskId: this.taskKey,
          processKey: this.processInstanceDetail.deployKey,
          currentTaskName: this.processInstanceDetail.taskName,
          currentTaskKey: this.processInstanceDetail.taskKey,
          createBy: this.$store.state.userInfo.name
        }).then((res) => {
          // this.$parent.dataList.reject.rejectBollen = false
          // this.$parent.dataList.reject.data = '2022-04-15 11:11:11'
          // this.$parent.dataList.reject.name = 'admin'
          // this.$parent.dataList.reject.rejectResult = this.selectData.businessObject.name
          this.dialogVisible2 = false
          this.$parent.$emit('taskSuccess')
        })
      },
      handleOK() {
        postVerifyUser(this.form).then((res) => {
          this.dialogVisible = false
          switch (this.$parent.functionCheck) {
            case 'Hang':
              if (this.$parent.dataList.Hang) {
                putHangInstance({
                  processInstanceId: this.$parent.$refs.ProcessInformation.postData.processInstanceId
                }).then((res) => {
                  this.$message.success('挂起成功')
                  // this.$parent.dataList[this.$parent.functionCheck] = !this.$parent.dataList[this.$parent.functionCheck]
                  this.$parent.$emit('taskSuccess')
                })
              } else{
                getActiveInstance({
                  processInstanceId: this.$parent.$refs.ProcessInformation.postData.processInstanceId
                }).then((res) => {
                  this.$message.success('激活成功')
                  // this.$parent.dataList[this.$parent.functionCheck] = !this.$parent.dataList[this.$parent.functionCheck]
                  this.$parent.$emit('taskSuccess')
                })
              }
              break;
            case 'reject':
              this.dialogVisible2 = true
              break;
            case 'termination':
              this.dialogVisible3 = true
              break;
            default:
              break;
          }
        })
      },
      handleTermination() {
        
        putCancelInstance({
          cancelReason: this.termination,
          processInstanceId: this.processInstanceId
        }).then((res) => {
          this.$message.success('终止成功')
          this.dialogVisible3 = false
          // this.$parent.dataList.termination.terminationBollon = false
          this.$parent.$emit('taskSuccess')
          // this.$parent.dataList.termination.data = '2022-04-15 11:11:11'
          // this.$parent.dataList.termination.name = '昊昊'
        })
        
       
      }
    },
    components: {
      processData
    }
  }
</script>

<style scoped="scoped">
  .runtimeConfirmation {
    padding: 0px 40px;
  }

  .title {
    text-align: center;
    color: #ff3352;
    margin: 20px 0px;
  }

  .rejectWord {
    margin: 20px 0px;
  }
</style>
