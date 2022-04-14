<template>
  <div>
    <el-dialog title="执行工作流" :visible="dialogVisible" width="90%" :before-close="handleClose">
      <div class="Implement">
        <div class="Implement-left">
          <ProcessInformation ref="ProcessInformation" v-if="dialogVisible"></ProcessInformation>
          <div class="function-list">
            <span class="function-item" @click="changeFunction('agency')" :class="functionCheck === 'agency' ? 'function-check' : ''">代办</span>
            <span class="function-item" @click="changeFunction('Circulate')" :class="functionCheck === 'Circulate' ? 'function-check' : ''">传阅</span>
            <span class="function-item" @click="changeFunction('signature')" :class="functionCheck === 'signature' ? 'function-check' : ''">加减签</span>
            <span class="function-item" @click="changeFunction('Hang')" :class="functionCheck === 'Hang' ? 'function-check' : ''">挂起</span>
            <span class="function-item" @click="changeFunction('reject')" :class="functionCheck === 'reject' ? 'function-check' : ''">驳回</span>
            <span class="function-item" @click="changeFunction('termination')" :class="functionCheck === 'termination' ? 'function-check' : ''">终止</span>
            <span class="function-see" @click="goSee()">查看</span>
          </div>
          <div class="function-main">
            <div v-if="functionCheck === 'agency'">
              <div v-if="dataList.agency.length === 0" class="noPeopleList">
                <span style="cursor: pointer;" @click="changePeopleList()">暂无代办人员，点击添加</span>
              </div>
              <div v-if="dataList.agency.length > 0">
                <div class="peopleList-title">指定代办人员:</div>
                <div class="peopleList">
                  <div class="peopleList-item" v-for="(item, index) in dataList.agency" :key="index">{{ item.name }}</div>
                </div>
                <span class="editButton" @click="editDataList('agency')">编辑</span>
              </div>
            </div>
            <div v-if="functionCheck === 'Circulate'">
              <div v-if="dataList.Circulate.length === 0" class="noPeopleList">
                <span style="cursor: pointer;" @click="changePeopleList()">暂无传阅人员，点击添加</span>
              </div>
              <div v-if="dataList.Circulate.length > 0">
                <div class="peopleList-title">指定代办人员:</div>
                <div class="peopleList">
                  <div class="peopleList-item" v-for="(item, index) in dataList.Circulate">{{ item.name }}</div>
                </div>
                <span class="editButton" @click="editDataList('Circulate')">编辑</span>
              </div>
            </div>
            <div v-if="functionCheck === 'signature'">
              <div class="peopleListDefatil">
                <div class="peopleList-item-defail" v-for="(item, index) in peopleListDefatil">{{ item.name }}</div>
              </div>
              <div style="margin-top: 15px;">
                <div class="peopleList-title">加签:</div>
                <div class="peopleList">
                  <div class="peopleList-item" v-for="(item, index) in dataList.signature">{{ item.name }}</div>
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
                  <span>{{ dataList.reject.name }}</span>
                </div>
                <div>
                  <span class="rejectWord">驳回至</span>
                  <span  class="rejectResult">{{ dataList.reject.rejectResult }}</span>
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
          </div>
        </div>
        <div class="Implement-right">
           <div class="bpmn-configure-basic">
             <div class="bpmn-configure-title">工单分配</div>
             <div class="bpmn-configure-Main">
               <div class="bpmn-configure-Main-item"> <span>名<span style="visibility: hidden;">占位</span>称</span>: <span>{{ bpmnData.name }}</span> </div>
               <div class="bpmn-configure-Main-item"> <span>绑定岗位</span>: <span>{{ bpmnData.grounp }}</span> </div>
               <div class="bpmn-configure-Main-item"> <span>绑定人员</span>: <span>{{ bpmnData.assignee }}</span> </div>
               <div class="bpmn-configure-Main-item"> <span>备<span style="visibility: hidden;">占位</span>注</span>: <span>{{ bpmnData.document }}</span> </div>
             </div>
           </div>
           <div style="margin-top: 20px;margin-bottom: 10px;">表单内容</div>
            <div class="Implement-right-form">
              <formRuntime></formRuntime>
            </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <runtimePeople ref="runtimePeople"></runtimePeople>
    <runtimeConfirmation ref="runtimeConfirmation"></runtimeConfirmation>
  </div>
</template>

<script>
  import ProcessInformation from '@/views/home/component/ProcessInformation.vue'
  import runtimePeople from './runtimePeople.vue'
  import runtimeConfirmation from './runtimeConfirmation.vue'
  import formRuntime from './formRuntime.vue'
  export default {
    props: {
      dialogVisible: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        functionCheck: 'agency',
        peopleListDefatil: [
          {
            name: '旺仔'
          },
          {
            name: '大乔'
          }
        ],
        bpmnData: {
          name: 'Task1',
          grounp: 'admin',
          assignee: 'admin1,admin2',
          document: '你好'
        },
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
        this.$emit('close')
      },
      changeFunction(value) {
        this.functionCheck = value
      },
      changePeopleList() {
        this.$refs.runtimePeople.dialogVisible = true
      },
      editDataList(value) {
        this.$refs.runtimePeople.multipleSelection = this.dataList[value]
        this.$refs.runtimePeople.dialogVisible = true
      },
      confirmation() {
        this.$refs.runtimeConfirmation.dialogVisible = true
      },
      goSee() {
        this.$emit('goSee')
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

  .noPeopleList {
    line-height: 181px;
    text-align: center;
    color: #5b5091;
  }

  .peopleList {
    display: flex;
    margin-top: 15px;
  }

  .peopleList-item {
    width: 96px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    border: 1px solid #108cee;
    border-radius: 5px;
    margin-right: 20px;
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
</style>
