<template>
  <div class="bpmnView">
    <div class="bpmnView-title" v-if="valueType === 'project'">
      <div class="title-item">
        <span class="title-item-label">
          流程编码
        </span>
        <div class="title-item-main">
          <el-input v-model="postData.numberCode" placeholder="" :disabled="true"></el-input>
        </div>
      </div>
      <div class="title-item">
        <span class="title-item-label marginLeft40">
          流程名称
        </span>
        <div class="title-item-main">
          <el-input v-model="postData.name" placeholder="" :disabled="true"></el-input>
        </div>
      </div>
      <div class="title-item">
        <span class="title-item-label marginLeft40">
          流程版本
        </span>
        <div class="title-item-main">
          <el-input v-model="postData.version" placeholder="" :disabled="true"></el-input>
        </div>
      </div>
      <div class="title-item">
        <span class="title-item-label marginLeft40">
          创建时间
        </span>
        <div class="title-item-main">
          <el-input v-model="postData.createTime" placeholder="" :disabled="true"></el-input>
        </div>
      </div>
      <div class="title-item">
        <span class="title-item-label">
          应用项目
        </span>
        <div class="title-item-main">
          <el-input v-model="postData.business" placeholder="" :disabled="true"></el-input>
        </div>
      </div>
      <div class="title-item">
        <span class="title-item-label marginLeft40">
          流程类型
        </span>
        <div class="title-item-main">
          <el-input v-model="postData.ascription" placeholder="" :disabled="true"></el-input>
        </div>
      </div>
      <div class="title-item">
        <span class="title-item-label marginLeft40">
          能源系统
        </span>
        <div class="title-item-main">
          <el-select v-model="postData.systemType" placeholder="请选择" :disabled="true">
            <el-option v-for="item in $store.state.optionsSystemType" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
    </div>
    <div class="bpmnView-title" v-if="valueType === 'public'">
      <div class="bpmnView-title-public">
        <span class="bpmnView-title-public-label">流程编码:</span><span class="bpmnView-title-public-value">21321321</span>
        <span class="bpmnView-title-public-label">流程名称:</span><span class="bpmnView-title-public-value">巡视工作流</span>
        <span class="bpmnView-title-public-label">流程版本:</span><span class="bpmnView-title-public-value">V1.0</span>
        <span class="bpmnView-title-public-label">创建时间:</span><span class="bpmnView-title-public-value">2011-11-11 19:11:11</span>
      </div>
      <div class="bpmnView-title-button">
        <el-button type="primary" @click="$emit('edit')">编辑</el-button>
        <el-button type="primary" @click="$emit('quote')">引用</el-button>
      </div>
    </div>
    <div class="bpmnView-process">
      <span class="bpmn-Main-title">BPMN流程</span>
      <div class="my-process-designer__canvas" ref="bpmn-canvas"></div>
    </div>
    <div class="bpmnView-data">
      <div class="bpmn-configure">
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
        <div class="bpmn-configure-form">
          <div class="bpmn-configure-title">工单分配-表单内容</div>
          <div class="bpmn-configure-Main">
            <span v-if="!formShow" class="noneForm"> 当前未关联表单 </span>
            <div v-if="formShow" class="formShowForm">
              <formOB v-if="formShow" :formContant="formContent" :key="formOBKey"></formOB>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import BpmnModeler from "bpmn-js/lib/Modeler";
  import DefaultEmptyXML from "@/components/package/designer/plugins/defaultEmpty";
  import bpmnData from "@/assets/js/bpmnMock.js"
  import {
    designFormDesignServiceAll
  } from '@/unit/api.js'
  export default {
    props:{
      valueType: {
        type: String,
        default: 'project'
      }
    },
    data() {
      return {
        postData: {
          numberCode: '',
          deployName: '',
          version: '',
          createTime: '',
          business: '',
          ascription: '',
          systemType: ''
        },
        bpmnData: {
          name: '',
          grounp: '',
          assignee: '',
          document: ''
        },
        formShow: false,
        formContent: '',
        formOBKey: 0
      }
    },
    methods: {
      initBpmnModeler() {
        if (this.bpmnModeler) return;
        this.bpmnModeler = new BpmnModeler({
          container: this.$refs["bpmn-canvas"],
          additionalModules: [],
          moddleExtensions: [],
        });
        this.bpmnModeler.on("selection.changed", ({
          newSelection
        }) => {
          this.selection(newSelection[0] || null)
        });
        window.bpmnInstances = {
          modeler: this.bpmnModeler,
          modeling: this.bpmnModeler.get("modeling"),
          moddle: this.bpmnModeler.get("moddle"),
          eventBus: this.bpmnModeler.get("eventBus"),
          bpmnFactory: this.bpmnModeler.get("bpmnFactory"),
          elementFactory: this.bpmnModeler.get("elementFactory"),
          elementRegistry: this.bpmnModeler.get("elementRegistry"),
          replace: this.bpmnModeler.get("replace"),
          selection: this.bpmnModeler.get("selection")
        };
        this.$nextTick(() => {
          console.log(this.postData)
          this.createNewDiagram(this.postData.content)
        })


      },
      async createNewDiagram(xml) {
        // 将字符串转换成图显示出来
        let newId = this.processId || `Process_${new Date().getTime()}`;
        let newName = this.processName || `业务流程_${new Date().getTime()}`;
        let xmlString = xml || DefaultEmptyXML(newId, newName, this.prefix);
        try {
          let {
            warnings
          } = await this.bpmnModeler.importXML(xmlString);
          if (warnings && warnings.length) {
            warnings.forEach(warn => console.warn(warn));
          }
        } catch (e) {
          console.error(`[Process Designer Warn]: ${e?.message || e}`);
        }
      },
      selection(element, bpmn) {
        if (element) {
          window.bpmnInstances.modeler = element
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
            ascription: 'public',
            business: '',
            createBy: '',
            numberCode: '',
            name: '',
            docName: docName
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
    },
    mounted() {
      console.log(this.postData)
      this.initBpmnModeler()
      this.$once("hook:beforeDestroy", () => {
        if (this.bpmnModeler) this.bpmnModeler.destroy();
        this.$emit("destroy", this.bpmnModeler);
        this.bpmnModeler = null;
      });
    }
  }
</script>

<style scoped="scoped">
  .bpmnView-title {
    border-bottom: 1px solid #CCCCCC;
    margin-bottom: 40px;
  }

  .title-item {
    display: inline-block;
    margin-bottom: 20px;
  }

  .title-item-label {
    margin-right: 15px;
  }

  .title-item-main {
    display: inline-block;
  }
  
  .bpmnView-title-public {
    width: 400px;
    display: inline-block;
  }
  
  .bpmnView-title-button {
    display: inline-block;
    vertical-align: top;
    margin-left: 730px;
    margin-top: 10px;
  }
  
  .bpmnView-title-public-label {
    display: inline-block;
    font-weight: 700;
    margin-left: 20px;
    margin-right: 20px;
    margin-bottom: 20px;
  }
  
  
  /deep/ .el-input.is-disabled .el-input__inner {
    color: black;
    width: 180px;
    height: 43px;
    line-height: 43px;
    padding: 0px 10px;
    background-color: #f2f2f2;
  }

  /deep/ .el-input__inner {
    width: 180px;
    height: 43px;
    line-height: 43px;
    padding: 0px 10px;
    background-color: #f2f2f2;
  }

  .marginLeft40 {
    margin-left: 70px;
  }

  .bpmnView-process {
    height: 400px;
    border: 1px solid black;
    position: relative;
  }

  .bpmn-Main-title {
    position: absolute;
    font-weight: 700;
    color: black;
    font-size: 13px;
    top: 10px;
    left: 10px;
  }

  .my-process-designer__canvas {
    height: 100%;
  }

  /deep/ .djs-palette {
    display: none;
  }

  /deep/ .djs-context-pad {
    display: none;
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

  .bpmn-configure-form {
    flex: 3;
    margin-left: 20px;
  }
</style>
