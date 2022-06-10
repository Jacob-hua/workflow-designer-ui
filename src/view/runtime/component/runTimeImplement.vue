<template>
  <div>
    <el-dialog title="执行工作流" :visible="dialogVisible" width="90%" :before-close="handleClose">
      <div class="Implement">
        <div class="Implement-left">
          <ProcessInformation ref="ProcessInformation" :processTaskList="processTaskList" v-if="dialogVisible"
            @selectOneSet="selectOneSet" seeType="runTime"></ProcessInformation>
          <div class="function-list" v-if="bpmnType === 'bpmn:UserTask' && btnList.length > 0">
            <span class="function-item" v-for="(item, index) in btnList" :key="index" v-if="functionItemShow(item)"
              @click="changeFunction(btnListKey[item])" :class="functionCheck === btnListKey[item] ? 'function-check' : ''">{{ item }}</span>
            <!-- <span class="function-see" @click="goSee()">查看</span> -->
          </div>
          <div class="function-main" :class="btnList.length === 0 ? 'noData': ''">
            <div v-if="functionCheck === 'Agency' && roleBoolean">
              <div v-if="dataList.Agency.length > 0">
                <div class="peopleList-title">指定代办人员:</div>
                <div class="peopleList">
                  <div v-for="(item, index) in dataList.Agency">
                    <span> {{ item.assignee }}: </span>
                    <div class="peopleList-item" v-for="(item1
                    , index1) in item.candidateUsers" v-if="item.candidateUsers.length > 0">{{ item1 }}</div>
                    <div v-if="item.candidateUsers.length == 0" style="display: inline-block;"> <span>暂无代办</span>
                      <span class="addCirculate" @click="changePeopleList(item.taskId)" v-if="item.assignee === $store.state.userInfo.name && item.candidateUsers.length == 0">点击添加</span>
                    </div>
                    <div v-if="item.candidateUsers.length > 0" style="display: inline-block;">
                      <span class="addCirculate" @click="changePeopleList(item.taskId, 'edit', 'Agency', item.candidateUsers )"
                        v-if="item.assignee === $store.state.userInfo.name && item.candidateUsers.length > 0">编辑</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="functionCheck === 'Circulate' && roleBoolean">
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
                      <span class="addCirculate" @click="changePeopleList(item.taskId, 'edit', 'Circulate', item.circulations[0].unitList)"
                        v-if="item.assignee === $store.state.userInfo.name">编辑</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="functionCheck === 'Signature' && roleBoolean">
              <!-- <div class="peopleListDefatil">
                <div class="peopleList-item-defail" v-for="(item, index) in peopleListDefatil">{{ item.userId }}</div>
              </div> -->
              <div style="margin-top: 15px;">
                <div class="peopleList-title">加签:</div>
                <div class="peopleList">
                  <div class="peopleList-item" v-for="(item, index) in dataList.Signature">{{ item.userId }}</div>
                </div>
                <span class="editButton" @click="editDataList('Signature')">编辑</span>
              </div>
            </div>
            <div v-if="functionCheck === 'Hang' && roleBoolean">
              <div v-if="dataList.Hang" class="HangStyle">
                <span style="color: #0066cc;">当前流程正常运行，如需将流程挂起，请进行认证操作</span>
                <div class="confirm" @click="confirmation()">挂起确认</div>
              </div>
              <div v-if="!dataList.Hang" class="HangStyle">
                <span style="color: #0066cc;">当前流程已被挂起，如需将继续执行流程，请进行认证操作</span>
                <div class="confirm" @click="confirmation()">重新激活</div>
              </div>
            </div>
            <div v-if="functionCheck === 'Reject' && roleBoolean">
              <div v-if="dataList.Reject.rejectBollen" class="HangStyle">
                <span style="color: #0066cc;">当前流程正常运行，如需将流程驳回，请进行认证操作</span>
                <div class="confirm" @click="confirmation()">驳回验证</div>
              </div>
              <div v-if="!dataList.Reject.rejectBollen">
                <div class="rejectData">
                  <span>{{ dataList.Reject.data }}</span>
                </div>
                <div class="rejectName">
                  <span>{{ dataList.Reject.userId }}</span>
                </div>
                <div>
                  <span class="rejectWord">驳回至</span>
                  <span class="rejectResult">{{ dataList.Reject.rejectResult }}</span>
                </div>
              </div>
            </div>
            <div v-if="functionCheck === 'Termination' && roleBoolean">
              <div v-if="dataList.Termination.terminationBollon" class="HangStyle">
                <span style="color: #0066cc;">当前流程正常运行，如需将流程终止，请进行认证操作</span>
                <div class="confirm" @click="confirmation()">终止确认</div>
              </div>
              <div v-if="!dataList.Termination.terminationBollon">
                <div class="rejectData">
                  <span>{{ dataList.Termination.data }}</span>
                </div>
                <div class="rejectName">
                  <span>{{ dataList.Termination.name }}</span>
                </div>
                <div class="rejectWord">
                  流程终止
                </div>
              </div>
            </div>
            <div v-if="btnList.length === 0" class="heightFunction">
              无信息
            </div>
            <div v-if="!roleBoolean" class="heightFunction">
              无权限
            </div>
          </div>
        </div>
        <div class="Implement-right">
          <!-- <div class="bpmn-configure-basic">
            <div class="bpmn-configure-title">工单分配</div>
            <div class="bpmn-configure-Main">
              <div class="bpmn-configure-Main-item"> <span>名<span style="visibility: hidden;">占位</span>称</span>: <span>{{ bpmnData.name }}</span>
              </div>
              <div class="bpmn-configure-Main-item"> <span>绑定岗位</span>: <span>{{ bpmnData.grounp }}</span> </div>
              <div class="bpmn-configure-Main-item"> <span>绑定人员</span>: <span>{{ bpmnData.assignee }}</span> </div>
              <div class="bpmn-configure-Main-item"> <span>备<span style="visibility: hidden;">占位</span>注</span>: <span>{{ bpmnData.document }}</span>
              </div>
            </div>
          </div> -->
          <div style="margin-top: 20px;margin-bottom: 10px;">表单内容</div>
          <div class="Implement-right-form">
            <formRuntime :formContant="formContant.content" v-if="formShow && (formContant.docType === '.form' || formContant.docType === null)" ref="formRuntime"></formRuntime>
            <preview :itemList="formListFun(formContant)"  :formConf="configFun(formContant)" v-if="formShow && formContant.docType === 'json'" ref="preview"></preview>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer" style="text-align: center;">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary" @click="implement()" :disabled="!dataList.Hang">执 行</el-button>
      </span>
    </el-dialog>
    <runtimePeople ref="runtimePeople" v-if="$refs.ProcessInformation" :taskId="taskId" :processInstanceId="$refs.ProcessInformation.postData.processInstanceId"
      :taskKey="$refs.ProcessInformation.postData.taskKey"></runtimePeople>
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
  import preview from "@/plugin/FormDesign/component/preview";
  import {
    designFormDesignServiceAll,
    postCompleteTask,
    putHangInstance,
    putCancelInstance,
    getTaskDetailList,
    getProcessNodeInfo
  } from '@/api/unit/api.js'
  export default {
    props: {
      dialogVisible: {
        type: Boolean,
        default: false
      },
      business: {
        type: String,
        default: ''
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
        roleBoolean: true,
        bpmnData: {
          name: '',
          grounp: '',
          assignee: '',
          document: ''
        },
        btnListKey: {
          "代办": "Agency",
          "传阅": "Circulate",
          "加减签": "Signature",
          "挂起": "Hang",
          "驳回": "Reject",
          "终止": "Termination"
        },
        btnList: [],
        dataList: {
          Agency: [],
          Circulate: [],
          Signature: [],
          Hang: true,
          Reject: {
            rejectBollen: true,
            data: '',
            name: '',
            rejectResult: ''
          },
          Termination: {
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
        this.dataList.Signature = []
        this.dataList.Agency = []
        this.processTaskList = result
        this.dataList.Circulate = result[result.length - 1].circulationList
        if (result[result.length - 1].assignee) {
          result[result.length - 1].assignee.split(',').forEach((item) => {
            this.dataList.Signature.push({
              userId: item
            })
          })
        }
        this.dataList.Agency = result[result.length - 1].candidateUsers
      },
      functionItemShow(item) {
        let value = this.btnListKey[item]
        switch (value) {
          case 'Agency':
            return !!this.dataList.Hang
            break;
          case 'Circulate':
            return !!this.dataList.Hang
            break;
          case 'Signature':
            return !!(this.dataList.Hang && this.bpmnTypeloopChara === 'bpmn:MultiInstanceLoopCharacteristics')
            break;
          case 'Hang':
            return true
            break;
          case 'Reject':
            return !!this.dataList.Hang
            break;
          case 'Termination':
            return !!this.dataList.Hang
            break;
          default:
            break;
        }
      },
      changeFunction(value) {
        this.functionCheck = value
        let {
          permissions
        } = JSON.parse(sessionStorage.getItem('loginData'))
        let proJectRole = permissions.filter((item) => {
          return item.projectCode === this.business
        })[0]?.permissionSet || []
        let findEle = proJectRole.findIndex((item) => {
          return item.frontRoute === 'RunTime' + value
        })
        if (findEle === -1) {
          this.roleBoolean = false
        } else {
          this.roleBoolean = true
        }
      },
      changePeopleList(taskId, type, value, item) {
        if (type === 'edit') {
          let a = []
          item.forEach((item1) => {
            a.push({
              userId: item1
            })
          })
          switch (value) {
            case 'Agency':
              this.$refs.runtimePeople.detailSelection = JSON.parse(JSON.stringify(a))
              break;
            case 'Circulate':
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
        this.btnList = JSON.parse(value?.businessObject?.$attrs['camunda:btnList'] || '[]')
        if (this.btnList.length > 0) {
          if (!this.dataList.Hang) {
            this.changeFunction('Hang')
          } else {
            this.changeFunction(this.btnListKey[this.btnList[0]])
          }
        } else {
          this.changeFunction('')
        }
        this.bpmnType = value.type
        this.bpmnTypeloopChara = value.businessObject.loopCharacteristics && value.businessObject.loopCharacteristics.$type
        this.selection(value)
      },
      
      formListFun(item) {
        let content = JSON.parse(item.content)
          let list = content.list
          // for (const formItem of list) {
          //   if (formItem.columns && formItem.columns.length) {
          //     for (const formItemElement of formItem.columns) {
          //       for (const formItemElementElement of formItemElement.list) {
          //         formItemElementElement.disabled = true
          //       }
          //     }
          //   } else {
          //     if ( Object.keys(formItem).includes('disabled')) {
          //       formItem.disabled  =  true
          //     } else  {}
          //   }
          // }
        return list
      },
      configFun(item) {
        return JSON.parse(item.content).config
      },
      
      implement() {
        let formData = []
        let data = {}
        let errors = {}
        if (this.formShow) {
          switch (this.formContant.docType){
            case '.form':
              data = this.$refs.formRuntime.formEditor.submit().data
              errors = this.$refs.formRuntime.formEditor.submit().errors
              
              formData = JSON.parse(this.formContant.content)
              // formData.forEach((item) => {
              //   switch (item.type) {
              //     case 'radio':
              //       item.value = item.values.filter((values) => {
              //         return values.value == data[item.key]
              //       })[0].label
              //       break;
              //     default:
              //       item.value = data[item.key]
              //       break;
              //   }
              // })
              break;
            case null:
              data = this.$refs.formRuntime.formEditor.submit().data
              errors = this.$refs.formRuntime.formEditor.submit().errors
              
              formData = JSON.parse(this.formContant.content)
              console.log(formData)
              formData.components.forEach((item) => {
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
              break;
            case 'json':
              this.$refs.preview.$refs[this.$refs.preview.formConf.formModel].validate((valid) => {
                if (valid) {
                  data = this.$refs.preview.form
                  formData = JSON.parse(this.formContant.content)
                  formData.list.forEach((item) => {
                    item.value = data[item.id]
                  })
                } else {
                  errors.boolean = true
                }
              })
              break
            default:
              break;
          }
        }
        if (Object.keys(errors).length > 0) {
          this.$message.error('有必填项未填写')
          return
        }
        getProcessNodeInfo({
          processInstanceId: this.$refs.ProcessInformation.postData.processInstanceId
        }).then((res) => {
          let nodeInfoBoole = res.result.some((item) => {
            if (item.assignee || item.candidateGroup || item.candidateUser) {
              return true
            }
          })
          if (nodeInfoBoole) {
            postCompleteTask({
              assignee: this.$store.state.userInfo.name,
              commentList: [],
              formData: formData,
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
          } else {
            this.$message.error('下一步流程无执行人')
          }
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
            this.formContant = res.result[0]
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
      formRuntime,
      preview
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
    height: 768px;
    border: 1px solid #000000;
    overflow: auto;
    padding: 20px 20px 20px 0px;
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
