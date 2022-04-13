<template>
  <div>
    <el-dialog title="执行工作流" :visible="dialogVisible" width="85%" :before-close="handleClose">
      <div class="Implement">
        <div class="Implement-left">
          <ProcessInformation></ProcessInformation>
          <div class="function-list">
            <span class="function-item" @click="changeFunction('agency')" :class="functionCheck === 'agency' ? 'function-check' : ''">代办</span>
            <span class="function-item" @click="changeFunction('Circulate')" :class="functionCheck === 'Circulate' ? 'function-check' : ''">传阅</span>
            <span class="function-item" @click="changeFunction('signature')" :class="functionCheck === 'signature' ? 'function-check' : ''">加减签</span>
            <span class="function-item" @click="changeFunction('Hang')" :class="functionCheck === 'Hang' ? 'function-check' : ''">挂起</span>
            <span class="function-item" @click="changeFunction('reject')" :class="functionCheck === 'reject' ? 'function-check' : ''">驳回</span>
            <span class="function-item" @click="changeFunction('termination')" :class="functionCheck === 'termination' ? 'function-check' : ''">终止</span>
            <span class="function-see">查看</span>
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
              <div v-if="dataList.reject" class="HangStyle">
                <span style="color: #0066cc;">当前流程正常运行，如需将流程驳回，请进行认证操作</span>
                <div class="confirm" @click="confirmation()">驳回验证</div>
              </div>
              <div v-if="dataList.reject">
                <span style="color: #0066cc;">当前流程已被挂起，如需将继续执行流程，请进行认证操作</span>
                <div class="confirm">重新激活</div>
              </div>
            </div>
            <div v-if="functionCheck === 'termination'">
               <div v-if="dataList.termination" class="HangStyle">
                 <span style="color: #0066cc;">当前流程正常运行，如需将流程终止，请进行认证操作</span>
                 <div class="confirm">终止确认</div>
               </div>
               <div v-if="dataList.termination">
                 <span style="color: #0066cc;">当前流程已被终止，如需将继续执行流程，请进行认证操作</span>
                 <div class="confirm">重新激活</div>
               </div>
            </div>
          </div>
        </div>
        <div class="Implement-right">
    
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
        dataList: {
          agency: [],
          Circulate: [],
          signature: [],
          Hang: true,
          reject: true,
          termination: true
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
      }
    },
    components: {
      ProcessInformation,
      runtimePeople,
      runtimeConfirmation
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
    flex: 8;
  }

  .Implement-right {
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
</style>
