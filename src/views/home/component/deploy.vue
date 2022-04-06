<template>
  <div>
    <el-dialog title="部署工作流" :visible.sync="dialogVisible1" width="35%" custom-class="dialogVisible1">
      <div>
        <div class="from-item">
          <span>应用项目</span>
          <el-input v-model="firstData.ascription" placeholder="请输入应用项目" :disabled="true"></el-input>
        </div>
        <div class="from-item">
          <span>流程类型</span>
          <el-input v-model="firstData.business" placeholder="请输入流程类型" :disabled="true"></el-input>
        </div>
        <div class="from-item">
          <span>能源系统</span>
          <el-select v-model="firstData.systemType" placeholder="请选择能源系统">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="from-item">
          <span>部署名称</span>
          <el-input v-model="firstData.deployName" placeholder="请输入部署名称"></el-input>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="nextDiolog()" type="primary">下一步</el-button>
        <el-button @click="dialogVisible1 = false">取消</el-button>
      </span>
    </el-dialog>
    <el-dialog title="部署工作流" :visible.sync="dialogVisible2" width="90%" custom-class="dialogVisible2">
      <div class="dialogVisible2-left">
        <div class="bpmn-Main">
          <ProcessInformation type="deploy2" ref="ProcessInformation" v-if="dialogVisible2" @selection="selection"></ProcessInformation>
        </div>
        <div class="bpmn-configure">
          <div class="bpmn-configure-basic">
            <div class="bpmn-configure-title">工单分配</div>
            <div class="bpmn-configure-Main">
              <div class="bpmn-configure-Main-item"> <span>名<span style="visibility: hidden;">占位</span>称</span>: <span>{{ bpmnData.name }}</span> </div>
              <div class="bpmn-configure-Main-item"> <span>绑定岗位</span>: <span>{{ bpmnData.grounp }}</span> </div>
              <div class="bpmn-configure-Main-item"> <span>绑定人员</span>: <span>{{ bpmnData.assignee }}</span> </div>
              <div class="bpmn-configure-Main-item"> <span>备<span style="visibility: hidden;">占位</span>注</span>: <span>{{ bpmnData.document }}</span> </div>
            </div>
          </div>
          <div class="bpmn-configure-form">
            <div class="bpmn-configure-title">工单分配-表单内容</div>
            <div class="bpmn-configure-Main">
              <span v-if="!formShow" class="noneForm"> 当前未关联表单 </span>
              <span v-if="formShow" class="formRemove" @click="removeForm()">移除表单</span>
              <div v-if="formShow" class="formShowForm">
                <formOB v-if="formShow" :formContant="formContent" :key="formOBKey"></formOB>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="dialogVisible2-right">
        <div class="dialogVisible2-right-title">
          表单筛选
        </div>
        <div class="dialogVisible2-right-search">
          <el-input v-model="input" placeholder="请输入内容"></el-input>
        </div>
        <div class="formList">
          <div class="listItem" v-for="(item, index) in formList" :key="index">
            <span class="listItem-title">{{ item.name }}</span>
            <div class="listItem-V1">
              <el-select v-model="item.version " placeholder="请选择" :disabled="true">
                <el-option v-for="item in optionsV" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </div>
            <div class="listItem-button">
              <el-popover
                placement="right"
                width="400"
                trigger="click">
                <formOB :formContant="item.content"></formOB>
                <el-button type="text" size="small" class="listItem-button1" slot="reference">查看</el-button>
              </el-popover>

              <el-button type="text" size="small" class="listItem-button2" @click="showForm(item)">
                关联
              </el-button>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addWorkFlow()">部署</el-button>
        <el-button @click="Adddraft()">保存</el-button>
        <el-button @click="dialogVisible2 = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import ProcessInformation from './ProcessInformation.vue'
  import formOB from './formOB.vue'
  import { postProcessDraft, designFormDesignServiceAll, postDeployForOnline } from '@/unit/api.js'
  import X2JS from "x2js";
  export default {
    props:{
      editData: {
        type: Object
      }
    },
    data() {
      return {
        dialogVisible1: false,
        dialogVisible2: false,
        bpmnData: {
          name: '',
          grounp: '',
          assignee: '',
          document: '',
          id: ''
        },
        firstData: {
          ascription: '',
          business: '',
          systemType: '',
          deployName: ''
        },
        bpmnModeler: null,
        formContent: '',
        formOBKey: 0,
        formList: [],
        formShow: false,
        input: '',
        options: [
          {
            value: 'energy-1',
            label: '配电'
          },
          {
            value: 'energy-2',
            label: '空压'
          },
          {
            value: 'energy-3',
            label: '供暖'
          },
          {
            value: 'energy-4',
            label: '空调'
          }
        ],
        valueV: '1.0',
        optionsV: [{
          value: '1.0',
          label: 'V1.0'
        }]
      }
    },
    methods: {
      initData() {
        this.bpmnData = {
          name: '',
          grounp: '',
          assignee: '',
          document: '',
          id: ''
        }
        this.formShow = false
        this.formContent = ''
      },
      addWorkFlow() {
        const newConvert = new X2JS();
        let formIds = ''
        this.bpmnModeler.saveXML({ format: true }).then(({ xml }) => {
          const { definitions } = newConvert.xml2js(xml);
          var file1 = new File([xml], definitions.process._name + '.bpmn', {type: 'bpmn20-xml'});
          if (Array.isArray(definitions.process.userTask)) {
            definitions.process.userTask.forEach((item, index) => {
              console.log(item)
              formIds = formIds + item['_camunda:formKey'].split('.')[1].split('_')[1] + ','
            })
          } else{
            formIds = definitions.process.userTask['_camunda:formKey'].split('.')[1].split('_')[1]
          }
          let formData = new FormData()
          // formData.append('createTime', new Date())
          formData.append('createBy', this.$refs.ProcessInformation.postData.createBy)
          formData.append('deployKey', Date.parse(new Date()))
          formData.append('deployName', this.$refs.ProcessInformation.postData.deployName)
          formData.append('draftId', this.$refs.ProcessInformation.postData.id)
          formData.append('formIds', formIds)
          formData.append('operatorId', '1')
          formData.append('operatorName', 'admin')
          formData.append('processResource', file1)
          formData.append('processId', this.$refs.ProcessInformation.postData.id)
          formData.append('systemType', this.$refs.ProcessInformation.postData.systemType)
          formData.append('updateBy', this.$refs.ProcessInformation.postData.createBy)
          // formData.append('processResource', '')
          formData.append('tenantId', '12')
          postDeployForOnline(formData).then((res) => {
            this.$message.success('保存成功')
            this.dialogVisible2 = false
          })
        });
      },
      getFormList() {
        designFormDesignServiceAll({
          status: 'enabled',
          tenantId: '12',
          ascription: 'public',
          business: '',
          createId: '',
          numberCode: '',
          name: '',
          docName: ''
        }).then((res) => {
          this.formList = res.result
        })
      },
      nextDiolog() {
        this.dialogVisible1 = false
        this.dialogVisible2 = true
        this.getFormList()
        this.$nextTick(() => {
          this.$refs.ProcessInformation.postData = this.editData
          this.$refs.ProcessInformation.postData.ascription = this.firstData.ascription
          this.$refs.ProcessInformation.postData.business = this.firstData.business
          this.$refs.ProcessInformation.postData.systemType = this.firstData.systemType
          this.$refs.ProcessInformation.postData.deployName = this.firstData.deployName
          this.$refs.ProcessInformation.createNewDiagram(this.editData.content)
        })
      },
      selection(element, bpmn) {
          this.bpmnModeler = bpmn
          if (element) {
            window.bpmnInstances.modeler = element
            this.bpmnData.name = element.businessObject.name
            this.bpmnData.grounp = element.businessObject.$attrs['camunda:' + 'candidateGroups']
            this.bpmnData.assignee = element.businessObject.$attrs['camunda:' + 'assignee']
            this.bpmnData.document = element.businessObject.documentation && element.businessObject.documentation[0].text
            this.getFormData(element.businessObject.$attrs['camunda:' + 'formKey'])
            // window.bpmnInstances.modeling.updateProperties(element, { formKey: '56999' });
            // bpmn.saveXML({ format: true }).then(({ xml }) => {
            //   console.log(xml, '0000')
            // })
            // console.log(window.bpmnInstances.modeler, '0000')
          } else {
            this.initData()
          }
      },
      showForm(item) {
        if (window.bpmnInstances.modeler) {
          window.bpmnInstances.modeling.updateProperties(window.bpmnInstances.modeler , { 'camunda:formKey': item.docName });
          this.formShow = true
          this.formContent = item.content
        }
      },
      Adddraft() {
        const newConvert = new X2JS();
        let formIds = ''
        this.bpmnModeler.saveXML({ format: true }).then(({ xml }) => {
          const { definitions } = newConvert.xml2js(xml);
          var file1 = new File([xml], definitions.process._name + '.bpmn', {type: 'bpmn20-xml'});
          if (Array.isArray(definitions.process.userTask)) {
            definitions.process.userTask.forEach((item, index) => {
              formIds = formIds + item['_camunda:formKey'].split('.')[1].split('_')[1] + ','
            })
          } else{
            formIds = definitions.process.userTask['_camunda:formKey'].split('.')[1].split('_')[1]
          }
          let formData = new FormData()
          // formData.append('createTime', new Date())
          formData.append('deployKey', Date.parse(new Date()))
          formData.append('deployName', this.$refs.ProcessInformation.postData.deployName)
          formData.append('formIds', formIds)
          formData.append('operatorId', '1')
          formData.append('operatorName', 'admin')
          formData.append('processFile', file1)
          formData.append('processId', this.$refs.ProcessInformation.postData.id)
          // formData.append('processResource', '')
          formData.append('tenantId', '12')
          postProcessDraft(formData).then((res) => {
            this.$message.success('保存成功')
            this.dialogVisible2 = false
          })
        });
      },
      getFormData(formKey) {
        if (formKey) {
          designFormDesignServiceAll({
            status: 'enabled',
            tenantId: '12',
            ascription: 'public',
            business: '',
            createId: '',
            numberCode: '',
            name: '',
            docName: formKey
          }).then((res) => {
            this.formContent = res.result[0].content
            this.formOBKey++
            this.formShow = true
          })
        } else {
          this.formContent = ''
          this.formShow = false
        }
      },
      removeForm() {
        if (window.bpmnInstances.modeler) {
          window.bpmnInstances.modeling.updateProperties(this.bpmnModeler , { 'camunda:formKey': '' });
          this.formShow = false
          this.formContent = ''
        }
      }
    },
    components:{
      ProcessInformation,
      formOB
    }
  }
</script>

<style scoped="scoped">
  /deep/ .dialogVisible1 .el-dialog__body {
    padding: 16px 180px 0px 100px;
  }

  /deep/ .dialogVisible1 .el-dialog__header .el-dialog__title {
    font-size: 14px;
  }

  /deep/ .dialogVisible1 .el-dialog__header {
    background-color: #e4e4e4;
    border-bottom: 1px solid #000000;
  }

  .from-item {
    display: flex;
    margin-bottom: 20px;
    text-align: center;
  }

  .from-item>span {
    width: 100px;
    height: 40px;
    line-height: 40px;
  }

  /deep/ .el-input__inner {
    color: black;
  }

  /deep/ .el-dialog__footer {
    text-align: center;
  }

  /deep/ .dialogVisible2 .el-dialog__header .el-dialog__title {
    font-size: 14px;
  }

  /deep/ .dialogVisible2 .el-dialog__header {
    background-color: #e4e4e4;
    border-bottom: 1px solid #000000;
  }

  /deep/ .dialogVisible2 .el-dialog__body {
    display: flex;
    height: 994px;
    max-height: 86vh;
  }

  /deep/ .dialogVisible2 .dialogVisible2-left {
    flex: 3;
    padding: 10px 20px 0px 40px;
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
    overflow: auto;
    position: relative;
  }
  
  .bpmn-configure-Main-item {
    margin-bottom: 20px;
    color: black;
  }
  
  /deep/ .dialogVisible2 .dialogVisible2-right {
    /* flex: 1; */
    border-left: 1px solid #CCCCCC;
    padding: 0px 0px 0px 30px;
    box-sizing: border-box;
    width: 375px;
  }
  .dialogVisible2-right-title {
    color: black;
    margin-bottom: 20px;
  }
  .dialogVisible2-right-search {
    margin-bottom: 30px;
  }
  .dialogVisible2-right-search /deep/ .el-input__inner {
    border-radius: 20px;
    border-color: black;
    color: #000000;
  }
  
  .formList {
    height: 690px;
    overflow: auto;
  }
  /deep/ .formList::-webkit-scrollbar {
    width: 0px;
    height: 0px;
  }
  
  .listItem {
    display: flex;
    border: 1px solid #666666;
    margin-bottom: 20px;
    height: 46px;
  }
  .listItem .listItem-title {
    width: 120px;
    margin-left: 10px;
    text-align: left;
    height: 46px;
    display: inline-block;
    line-height: 46px;
    color: black;
  }
  .listItem .listItem-V1 /deep/ .el-input__inner {
    width: 60px;
    border: none;
    height: 35px;
    margin-top: 5px;
    padding: 0px;
    line-height: 35px;
    background-color: transparent;
  }
  .listItem .listItem-V1 /deep/ .el-input__icon {
    line-height: 20px;
    color: black;
  }
  .listItem .listItem-button {
    text-align: left;
    line-height: 46px;
    margin-left: 60px;
    color: #0368cd;
  }
  .listItem .listItem-button1 {
    color: #0368cd;
    font-size: 14px;
    margin-right: 10px;
  }
  .listItem .listItem-button2 {
    color: #0368cd;
    font-size: 14px;
  }
  
  .formShowForm {
    position: relative;
  }
  
  .formRemove {
    position: absolute;
    right: 10px;
    top: 2px;
    z-index: 9;
    cursor: pointer;
  }
</style>
