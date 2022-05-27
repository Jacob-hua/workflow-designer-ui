<template>
  <div>
    <el-dialog title="执行工作流" :visible="dialogVisible" width="90%" :before-close="handleClose">
      <div class="Implement">
        <div class="Implement-left">
          <ProcessInformation ref="ProcessInformation" :processTaskList="processTaskList" v-if="dialogVisible"
            @selectOneSet="selectOneSet" seeType="runTime"></ProcessInformation>
          <div class="function-list" v-if="bpmnType === 'bpmn:UserTask' && btnList.length > 0">
            <span class="function-item" v-for="(item, index) in btnList" :key="index" v-if="functionItemShow(item)" @click="changeFunction(btnListKey[item])" :class="functionCheck === btnListKey[item] ? 'function-check' : ''">{{ item }}</span>
            <!-- <span class="function-see" @click="goSee()">查看</span> -->
          </div>
          <div class="function-main" :class="btnList.length === 0 ? 'noData': ''">
            <div v-if="functionCheck === 'agency'">
              <div v-if="dataList.agency.length > 0">
                <div class="peopleList-title">指定代办人员:</div>
                <div class="peopleList">
                  <div v-for="(item, index) in dataList.agency">
                    <span> {{ item.assignee }}: </span>
                    <div class="peopleList-item" v-for="(item1, index1) in item.candidateUsers" v-if="item.candidateUsers.length > 0">{{ item1 }}</div>
                    <div v-if="item.candidateUsers.length == 0" style="display: inline-block;"> <span>暂无代办</span>
                        <span class="addCirculate" @click="changePeopleList(item.taskId)" v-if="item.assignee === $store.state.userInfo.name && item.candidateUsers.length == 0">点击添加</span>
                    </div>
                    <div v-if="item.candidateUsers.length > 0" style="display: inline-block;">
                        <span class="addCirculate" @click="changePeopleList(item.taskId, 'edit', 'agency', item.candidateUsers )" v-if="item.assignee === $store.state.userInfo.name && item.candidateUsers.length > 0">编辑</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="functionCheck === 'Circulate'">
              <div v-if="dataList.Circulate.length > 0">
                <div class="peopleList-title">指定传阅人员:</div>
                <div class="peopleList">
                  <div v-for="(item, index) in dataList.Circulate">
                    <span> {{ item.assignee }}: </span>
                    <div class="peopleList-item" v-for="(item1, index1) in item.circulations[0].unitList" v-if="item.circulations[0].unitList.length > 0">{{ item1 }}</div>
                    <div v-if="item.circulations[0].unitList.length == 0" style="display: inline-block;"> <span>暂无传阅</span>
                        <span class="addCirculate" @click="changePeopleList(item.taskId)" v-if="item.assignee === $store.state.userInfo.name">点击添加</span>
                    </div>
                    <div v-if="item.circulations[0].unitList.length > 0" style="display: inline-block;">
                        <span class="addCirculate" @click="changePeopleList(item.taskId, 'edit', 'Circulate', item.circulations[0].unitList)" v-if="item.assignee === $store.state.userInfo.name">编辑</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="functionCheck === 'signature'">
              <!-- <div class="peopleListDefatil">
                <div class="peopleList-item-defail" v-for="(item, index) in peopleListDefatil">{{ item.userId }}</div>
              </div> -->
              <div style="margin-top: 15px;">
                <div class="peopleList-title">加签:</div>
                <div class="peopleList">
                  <div class="peopleList-item" v-for="(item, index) in dataList.signature">{{ item.userId }}</div>
                </div>
                <span class="editButton" @click="editDataList('signature')">编辑</span>
              </div>
            </div>
            <div v-if="functionCheck === 'Hang'">
              <div v-if="dataList.Hang" class="HangStyle">
                <span style="color: #0066cc;">当前流程正常运行，如需将流程挂起，请进行认证操作</span>
                <div class="confirm" @click="confirmation()">挂起确认</div>
              </div>
              <div v-if="!dataList.Hang" class="HangStyle">
                <span style="color: #0066cc;">当前流程已被挂起，如需将继续执行流程，请进行认证操作</span>
                <div class="confirm" @click="confirmation()">重新激活</div>
              </div>
            </div>
            <div v-if="functionCheck === 'reject'">
              <div v-if="dataList.reject.rejectBollen" class="HangStyle">
                <span style="color: #0066cc;">当前流程正常运行，如需将流程驳回，请进行认证操作</span>
                <div class="confirm" @click="confirmation()">驳回验证</div>
              </div>
              <div v-if="!dataList.reject.rejectBollen">
                <div class="rejectData">
                  <span>{{ dataList.reject.data }}</span>
                </div>
                <div class="rejectName">
                  <span>{{ dataList.reject.userId }}</span>
                </div>
                <div>
                  <span class="rejectWord">驳回至</span>
                  <span class="rejectResult">{{ dataList.reject.rejectResult }}</span>
                </div>
              </div>
            </div>
            <div v-if="functionCheck === 'termination'">
              <div v-if="dataList.termination.terminationBollon" class="HangStyle">
                <span style="color: #0066cc;">当前流程正常运行，如需将流程终止，请进行认证操作</span>
                <div class="confirm" @click="confirmation()">终止确认</div>
              </div>
              <div v-if="!dataList.termination.terminationBollon">
                <div class="rejectData">
                  <span>{{ dataList.termination.data }}</span>
                </div>
                <div class="rejectName">
                  <span>{{ dataList.termination.name }}</span>
                </div>
                <div class="rejectWord">
                  流程终止
                </div>
              </div>
            </div>
            <div v-if="btnList.length === 0" class="heightFunction">
              无信息
            </div>
          </div>
        </div>
        <div class="Implement-right">
          <div class="bpmn-configure-basic">
            <div class="bpmn-configure-title">工单分配</div>
            <div class="bpmn-configure-Main">
              <div class="bpmn-configure-Main-item"> <span>名<span style="visibility: hidden;">占位</span>称</span>: <span>{{ bpmnData.name }}</span>
              </div>
              <div class="bpmn-configure-Main-item"> <span>绑定岗位</span>: <span>{{ bpmnData.grounp }}</span> </div>
              <div class="bpmn-configure-Main-item"> <span>绑定人员</span>: <span>{{ bpmnData.assignee }}</span> </div>
              <div class="bpmn-configure-Main-item"> <span>备<span style="visibility: hidden;">占位</span>注</span>: <span>{{ bpmnData.document }}</span>
              </div>
            </div>
          </div>
          <div style="margin-top: 20px;margin-bottom: 10px;">表单内容</div>
          <div class="Implement-right-form">
            <formRuntime :formContant="formContant" v-if="formShow" ref="formRuntime"></formRuntime>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer" style="text-align: center;">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary" @click="implement()" :disabled="!dataList.Hang">执 行</el-button>
      </span>
    </el-dialog>
    <runtimePeople ref="runtimePeople" v-if="$refs.ProcessInformation" :taskId="taskId"
      :processInstanceId="$refs.ProcessInformation.postData.processInstanceId" :taskKey="$refs.ProcessInformation.postData.taskKey"></runtimePeople>
    <runtimeConfirmation v-if="$refs.ProcessInformation" ref="runtimeConfirmation" :processInstanceDetail="$refs.ProcessInformation.postData"
      :processInstanceId="$refs.ProcessInformation.postData.processInstanceId" :BpmnContant="$refs.ProcessInformation.postData.content"
      :taskId="$refs.ProcessInformation.postData.taskKey" :taskKey="$refs.ProcessInformation.postData.taskId"></runtimeConfirmation>
  </div>
</template>

<script>
  import ProcessInformation from '@/component/bpmnView/ProcessInformation.vue'
  import runtimePeople from './runtimePeople.vue'
  import runtimeConfirmation from './runtimeConfirmation.vue'
  import formRuntime from './formRuntime.vue'
  import {
    designFormDesignServiceAll,
    postCompleteTask,
    putHangInstance,
    putCancelInstance,
    getTaskDetailList
  } from '@/api/unit/api.js'
  export default {
    props: {
      dialogVisible: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        processTaskList: [],
        functionCheck: '',
        bpmnType: '',
        bpmnTypeloopChara: '',
        formContant: '',
        formShow: false,
        peopleListDefatil: [],
        taskId: '',
        bpmnData: {
          name: '',
          grounp: '',
          assignee: '',
          document: ''
        },
        btnListKey: {
          "待办": "agency",
          "传阅": "Circulate",
          "加减签": "signature",
          "挂起": "Hang",
          "驳回": "reject",
          "终止": "termination"
        },
        btnList: [
          '待办', '传阅', '加减签', '挂起', '驳回', '终止'
        ],
        dataList: {
          agency: [],
          Circulate: [],
          signature: [],
          Hang: true,
          reject: {
            rejectBollen: true,
            data: '',
            name: '',
            rejectResult: ''
          },
          termination: {
            terminationBollon: true,
            data: '',
            name: ''
          }
        }
      }
    },
    methods: {
      handleClose() {
        this.formShow = false
        this.$emit('close')
      },
      cancel() {
        this.$emit('close')
      },
      getNachList(result) {
        this.dataList.Circulate = []
        this.dataList.signature = []
        this.dataList.agency = []
        this.processTaskList = result
        this.dataList.Circulate = result[result.length - 1].circulationList
        if (result[result.length - 1].assignee) {
          result[result.length - 1].assignee.split(',').forEach((item) => {
            this.dataList.signature.push({
              userId: item
            })
          })
        }
        this.dataList.agency = result[result.length - 1].candidateUsers
      },
      
      // getNachList(processInstanceId) {
      //   this.dataList.Circulate = []
      //   this.dataList.signature = []
      //   this.dataList.agency = []
      //   return getTaskDetailList({
      //     processInstanceId: processInstanceId
      //   }).then((res) => {
      //     this.processTaskList = res.result
      //     res.result[res.result.length - 1].circulationList.forEach((item) => {
      //       this.dataList.Circulate.push({
      //         userId: item
      //       })
      //     })
      //     if (res.result[res.result.length - 1].assignee) {
      //       res.result[res.result.length - 1].assignee.split(',').forEach((item) => {
      //         this.dataList.signature.push({
      //           userId: item
      //         })
      //       })
      //     }
      //     res.result[res.result.length - 1].candidateUsers.forEach((item) => {
      //       this.dataList.agency.push({
      //         userId: item
      //       })
      //     })
      //   })
      // },
      functionItemShow(item) {
        let value = this.btnListKey[item]
        switch (value){
          case 'agency':
            return !!this.dataList.Hang
            break;
          case 'Circulate':
            return !!this.dataList.Hang
            break;
          case 'signature':
            return !!(this.dataList.Hang && this.bpmnTypeloopChara === 'bpmn:MultiInstanceLoopCharacteristics')
            break;
          case 'Hang':
            return true
            break;
          case 'reject':
            return !!this.dataList.Hang
            break;
          case 'termination':
            return !!this.dataList.Hang
            break;
          default:
            break;
        }
      },
      changeFunction(value) {
        this.functionCheck = value
      },
      changePeopleList(taskId, type, value, item) {
        if (type === 'edit') {
          let a = []
          item.forEach((item1) => {
            a.push({
              userId: item1
            })
          })
          switch (value){
            case 'agency':
              this.$refs.runtimePeople.detailSelection = JSON.parse(JSON.stringify(a))
              break;
            case 'Circulate':
              // this.$refs.runtimePeople.multipleSelection = JSON.parse(JSON.stringify(item))
              this.$refs.runtimePeople.detailSelection = JSON.parse(JSON.stringify(a))
              break;
            default:
              break;
          }
        }
        this.$refs.runtimePeople.dialogVisible = true
        this.taskId = taskId
        this.$nextTick(() => {
          this.$refs.runtimePeople.toggleRowSelection()
        })
      },
      editDataList(value) {
        this.$refs.runtimePeople.multipleSelection = JSON.parse(JSON.stringify(this.dataList[value]))
        this.$refs.runtimePeople.detailSelection = JSON.parse(JSON.stringify(this.dataList[value]))
        this.$refs.runtimePeople.dialogVisible = true
        this.$nextTick(() => {
          this.$refs.runtimePeople.toggleRowSelection()
        })
      },
      confirmation() {
        this.$refs.runtimeConfirmation.dialogVisible = true
      },
      goSee() {
        this.$emit('goSee', this.$refs.ProcessInformation.postData)
      },
      selectOneSet(value) {
        // this.btnList = JSON.parse(value?.businessObject?.$attrs['camunda:btnList'] || '[]' )
        console.log(this.btnList)
        if (this.btnList.length > 0) {
          this.changeFunction(this.btnListKey[this.btnList[0]])
        } else {
          this.changeFunction('')
        }
        this.bpmnType = value.type
        this.bpmnTypeloopChara = value.businessObject.loopCharacteristics && value.businessObject.loopCharacteristics.$type
        this.selection(value)
      },

      implement() {
        let data = {}
        let formData = []
        if (this.formShow) {
          data = this.$refs.formRuntime.formEditor.submit().data
          formData = JSON.parse(this.formContant).components
          formData.forEach((item) => {
            switch (item.type) {
              case 'radio':
                item.value = item.values.filter((values) => {
                  return values.value == data[item.key]
                })[0].label
                break;
              default:
                item.value = data[item.key]
                break;
            }
          })
          // if ( this.$refs.ProcessInformation.postData.taskId === '4c1f5686-c6c2-11ec-bd33-005056c00001') {
          //   let userList = []
          //   Object.keys(data).forEach((item) => {
          //     if (data[item]) {
          //       userList.push(item)
          //     }
          //   })
          //   data = {
          //     userList: userList
          //   }
          // }
        }
        let a = this.$refs.ProcessInformation.postData.taskAssignee.split(',')
        let b = this.$refs.ProcessInformation.postData.taskId.split(',')
        let c = a.indexOf(this.$store.state.userInfo.name)

        postCompleteTask({
          assignee: this.$store.state.userInfo.name,
          commentList: [],
          formDataList: formData,
          processInstanceId: this.$refs.ProcessInformation.postData.processInstanceId,
          processKey: this.$refs.ProcessInformation.postData.deployKey,
          taskId: this.$refs.ProcessInformation.postData.newTaskId,
          taskKey: this.$refs.ProcessInformation.postData.taskKey,
          taskName: this.$refs.ProcessInformation.postData.taskName,
          variable: data
        }).then((res) => {
          this.formShow = false
          this.$message.success('执行成功')
          this.$emit('taskSuccess')
        })
      },

      selection(element) {
        if (element) {
          this.bpmnData.name = element.businessObject.name
          this.bpmnData.grounp = element.businessObject.$attrs['camunda:' + 'candidateGroups']
          this.bpmnData.assignee = element.businessObject.$attrs['camunda:' + 'assignee']
          this.bpmnData.document = element.businessObject.documentation && element.businessObject.documentation[0].text
          this.getFormData(element.businessObject.$attrs['camunda:' + 'formKey'])
        } else {
          this.initData()
        }
      },

      getFormData(formKey) {
        if (formKey) {
          let docName = formKey.split(':')[2]
          designFormDesignServiceAll({
            status: 'enabled',
            tenantId: this.$store.state.tenantId,
            ascription: this.$refs.ProcessInformation.postData.ascription,
            // business: this.$refs.ProcessInformation.postData.business,
            business: '',
            createBy: '',
            numberCode: '',
            name: '',
            docName: docName
          }).then((res) => {
            this.formContant = res.result[0].content
            this.formShow = true
          })
        } else {
          this.formContant = ''
          this.formShow = false
        }
      }
    },
    components: {
      ProcessInformation,
      runtimePeople,
      runtimeConfirmation,
      formRuntime
    }
  }
</script>

<style scoped="scoped">
  /deep/ .el-dialog__body {
    max-height: 90vh;
  }

  .Implement {
    display: flex;
  }

  .Implement-left {
    flex: 6;
  }

  .Implement-right {
    padding-left: 20px;
    border-left: 1px solid #eeeeee;
    margin-left: 20px;
    flex: 2;
  }

  .function-list {
    margin-top: 20px;
    position: relative;
  }

  .function-item {
    width: 120px;
    height: 48px;
    display: inline-block;
    text-align: center;
    background-color: #b2b2ff;
    line-height: 48px;
    border: 1px solid #474794;
    cursor: pointer;
  }

  .function-check {
    background-color: #0055ff;
    color: #b2b2ff;
  }

  .function-see {
    position: absolute;
    right: 10px;
    top: 5px;
    color: #0055ff;
    cursor: pointer;
  }

  .function-main {
    height: 181px;
    border: 1px solid #000000;
    padding: 10px 20px;
    position: relative;
    color: #000000;
  }
  
  .heightFunction {
    line-height: 141px;
    text-align: center;
    display: block;
  }
  
  .noPeopleList {
    line-height: 181px;
    text-align: center;
    color: #5b5091;
  }

  .peopleList {
    margin-top: 15px;
  }

  .peopleList-item {
    display: inline-block;
    width: 96px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    border: 1px solid #108cee;
    border-radius: 5px;
    margin-left: 20px;
  }

  .peopleListDefatil {
    margin-top: 15px;
    display: flex;
    color: #a599b1;
  }

  .peopleList-item-defail {
    width: 96px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    border: 1px solid #666666;
    background-color: #f5f5f5;
    border-radius: 5px;
    margin-right: 20px;
  }

  .editButton {
    position: absolute;
    right: 20px;
    top: 10px;
    color: #4d478e;
    cursor: pointer;
  }

  .HangStyle {
    text-align: center;
    margin-top: 50px;
  }

  .confirm {
    cursor: pointer;
    color: rgb(255, 76, 0);
    margin-top: 20px;
  }

  .rejectData {
    margin-top: 20px;
  }

  .rejectName {
    margin-top: 10px;
  }

  .rejectWord {
    display: inline-block;
    margin-top: 20px;
    color: #0066cc;
    margin-right: 15px;
  }

  .rejectResult {
    display: inline-block;
    border: 1px solid #0066cc;
    text-align: center;
    height: 36px;
    line-height: 36px;
    width: 120px;
    border-radius: 5px;
    color: #0066cc;
  }

  .bpmn-configure-basic {
    flex: 1;
  }

  .bpmn-configure-title {
    height: 40px;
    line-height: 40px;
  }

  .bpmn-configure-Main {
    height: 250px;
    border: 1px solid #000000;
    padding: 20px 10px;
    overflow: auto;
    position: relative;
  }

  .bpmn-configure-Main-item {
    margin-bottom: 20px;
    color: black;
  }

  .Implement-right-form {
    height: 475px;
    border: 1px solid #000000;
    overflow: auto;
  }

  .addCirculate {
    margin-left: 10px;
    display: inline-block;
    color: #5b5091;
    cursor: pointer;
  }
  
  .noData {
    margin-top: 68px;
  }
</style>
