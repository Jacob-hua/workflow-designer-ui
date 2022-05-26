<template>
  <div class="ProcessInformation">
    <div class="ProcessInformation-title">
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
          {{ seeType === 'runTime' ? '部署' : '流程' }}名称
        </span>
        <div class="title-item-main">
          <el-input v-model="postData.deployName" placeholder="" :disabled="true"></el-input>
        </div>
      </div>
      
      <div class="title-item">
        <span class="title-item-label marginLeft40">
          {{ seeType === 'runTime' ? '部署' : '创建' }}时间
        </span>
        <div class="title-item-main">
          <el-input v-model="postData.createTime" placeholder="" :disabled="true"></el-input>
        </div>
      </div>
      <div class="title-item">
        <span class="title-item-label marginLeft40">
          应用项目
        </span>
        <div class="title-item-main">
          <el-input v-model="postData.business" placeholder="" :disabled="true"></el-input>
        </div>
      </div>
      <div class="title-item">
        <span class="title-item-label">
          流程类型
        </span>
        <div class="title-item-main">
          <el-input v-model="postData.ascription" placeholder="" :disabled="true"></el-input>
        </div>
      </div>
      <div class="title-item" v-if="seeType === 'runTime'">
        <span class="title-item-label marginLeft40">
          {{ seeType === 'runTime' ? '部署人' : '流程版本' }}
        </span>
        <div class="title-item-main">
          <el-input v-model="postData.version" placeholder="" :disabled="true"></el-input>
        </div>
      </div>
      <div class="title-item" v-if="type !== 'details1'">
        <span class="title-item-label marginLeft40">
          能源系统
        </span>
        <div class="title-item-main">
          <el-select v-model="postData.systemType" placeholder="请选择" :disabled="true">
            <el-option v-for="item in optionSystem" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
    </div>
    <div v-if="type == 'details1'">
      <span class="bnpmTitle">流程模板</span>
    </div>
    <div v-if="type == 'details2'">
      <span class="bnpmTitle">巡视工作流</span>
      <span class="bnpmSwitch" v-if="seeType === 'delete'">
        <el-switch v-model="switchValue" active-color="#13ce66" active-text="激活">
        </el-switch>
      </span>
    </div>
    <div class="ProcessInformation-bpmn">
      <span class="bpmn-Main-title" v-if="type == 'deploy2'">BPMN流程</span>
      <div class="my-process-designer__canvas" ref="bpmn-canvas"></div>
    </div>
  </div>
</template>

<script>
  import BpmnModeler from "bpmn-js/lib/Modeler";
  import tokenSimulation from "bpmn-js-token-simulation";
  import DefaultEmptyXML from "@/components/package/designer/plugins/defaultEmpty";
  import customTranslate from "@/components/package/designer/plugins/translate/customTranslate";
  import translationsCN from "@/components/package/designer/plugins/translate/zh";
  import camundaModdleExtension from "@/components/package/designer/plugins/extension-moddle/camunda";
  import activitiModdleExtension from "@/components/package/designer/plugins/extension-moddle/activiti";
  import flowableModdleExtension from "@/components/package/designer/plugins/extension-moddle/flowable";
  import camundaModdleDescriptor from "@/components/package/designer/plugins/descriptor/camundaDescriptor.json";
  import activitiModdleDescriptor from "@/components/package/designer/plugins/descriptor/activitiDescriptor.json";
  import flowableModdleDescriptor from "@/components/package/designer/plugins/descriptor/flowableDescriptor.json";
  import {
    processInstanceData
  } from '@/unit/api.js'
  export default {
    props: {
      type: String,
      seeType: {
        type: String,
        default: 'delete'
      },
      processTaskList: {
        type: Array
      },
      value: String, // xml 字符串
      processId: String,
      processName: String,
      translations: Object, // 自定义的翻译文件
      options: {
        type: Object,
        default: () => ({})
      }, // 自定义的翻译文件
      additionalModel: [Object, Array], // 自定义model
      moddleExtension: Object, // 自定义moddle
      onlyCustomizeAddi: {
        type: Boolean,
        default: false
      },
      onlyCustomizeModdle: {
        type: Boolean,
        default: false
      },
      simulation: {
        type: Boolean,
        default: true
      },
      keyboard: {
        type: Boolean,
        default: true
      },
      prefix: {
        type: String,
        default: "camunda"
      },
      events: {
        type: Array,
        default: () => ["element.click"]
      },
      headerButtonSize: {
        type: String,
        default: "small",
        validator: value => ["default", "medium", "small", "mini"].indexOf(value) !== -1
      },
      headerButtonType: {
        type: String,
        default: "primary",
        validator: value => ["default", "primary", "success", "warning", "danger", "info"].indexOf(value) !== -1
      }
    },
    computed: {
      additionalModules() {
        const Modules = [];
        // 仅保留用户自定义扩展模块
        if (this.onlyCustomizeAddi) {
          if (Object.prototype.toString.call(this.additionalModel) === "[object Array]") {
            return this.additionalModel || [];
          }
          return [this.additionalModel];
        }

        // 插入用户自定义扩展模块
        if (Object.prototype.toString.call(this.additionalModel) === "[object Array]") {
          Modules.push(...this.additionalModel);
        } else {
          this.additionalModel && Modules.push(this.additionalModel);
        }

        // 翻译模块
        const TranslateModule = {
          translate: ["value", customTranslate(this.translations || translationsCN)]
        };
        Modules.push(TranslateModule);

        // 模拟流转模块
        if (this.simulation) {
          Modules.push(tokenSimulation);
        }

        // 根据需要的流程类型设置扩展元素构建模块
        // if (this.prefix === "bpmn") {
        //   Modules.push(bpmnModdleExtension);
        // }
        if (this.prefix === "camunda") {
          Modules.push(camundaModdleExtension);
        }
        if (this.prefix === "flowable") {
          Modules.push(flowableModdleExtension);
        }
        if (this.prefix === "activiti") {
          Modules.push(activitiModdleExtension);
        }

        return Modules;
      },
      moddleExtensions() {
        const Extensions = {};
        // 仅使用用户自定义模块
        if (this.onlyCustomizeModdle) {
          return this.moddleExtension || null;
        }

        // 插入用户自定义模块
        if (this.moddleExtension) {
          for (let key in this.moddleExtension) {
            Extensions[key] = this.moddleExtension[key];
          }
        }

        // 根据需要的 "流程类型" 设置 对应的解析文件
        if (this.prefix === "activiti") {
          Extensions.activiti = activitiModdleDescriptor;
        }
        if (this.prefix === "flowable") {
          Extensions.flowable = flowableModdleDescriptor;
        }
        if (this.prefix === "camunda") {
          Extensions.camunda = camundaModdleDescriptor;
        }

        return Extensions;
      }
    },
    data() {
      return {
        postData: {
          numberCode: '',
          name: '',
          version: '',
          createTime: '',
          business: '',
          ascription: '',
          systemType: ''
        },
        optionSystem: [{
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
        switchValue: ''
      }
    },
    methods: {
      initBpmnModeler() {
        if (this.bpmnModeler) return;
        this.bpmnModeler = new BpmnModeler({
          container: this.$refs["bpmn-canvas"],
          additionalModules: [
            {
              labelEditingProvider: ["value", ""]
            }
          ],
          moddleExtensions: [],
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
          selection: this.bpmnModeler.get("selection"),
          canvas: this.bpmnModeler.get('canvas')
        };
        this.bpmnModeler.on("selection.changed", ({
          newSelection
        }) => {
          this.$emit('selection', newSelection[0] || null, this.bpmnModeler)
        });
      },
      creatDemo() {
        processInstanceData({
          key: 'listenerTest'
        }).then((res) => {
          let xmlStr = res.result.xmlStr
          this.createNewDiagram(xmlStr)
        })
      },
      async createNewDiagram(xml, id) {
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
          this.$nextTick(() => {
            if(id) {
              let userTask = []
              this.processTaskList.forEach((item) => {
                 userTask.push(item.taskKey)
              })
              
              let userTaskComplateArr = window.bpmnInstances.elementRegistry.filter((element) => {
                return userTask.indexOf(element.id) !== -1
              })
              
              let userTaskArr = window.bpmnInstances.elementRegistry.filter((element) => {
                return element.type === 'bpmn:UserTask'
              })
              let oneSet = window.bpmnInstances.elementRegistry.filter((element) => {
                return element.id === id
              })
              console.log(oneSet, '000')
              this.$emit('selectOneSet', oneSet[0])
              
              userTaskArr.forEach((item) => {
                window.bpmnInstances.canvas.addMarker(item, 'svgIncomplete')
              })
              
              userTaskComplateArr.forEach((item) => {
                window.bpmnInstances.canvas.removeMarker(item, 'svgIncomplete')
                window.bpmnInstances.canvas.addMarker(item, 'svgComplete')
              })
              window.bpmnInstances.canvas.removeMarker(oneSet[0], 'svgComplete')
              window.bpmnInstances.canvas.addMarker(oneSet[0], 'svgOncomplete')
              // window.bpmnInstances.modeling.setColor(oneSet[0], {
              //   'fill': '#cccccc',
              //   'stroke': '#1890ff',
              //   'stroke-dasharray': '3 2'
              // })
            }
          })
        } catch (e) {
          console.error(`[Process Designer Warn]: ${e?.message || e}`);
        }
      },
      async lightSharp(id) {
        this.$nextTick(() => {
          let oneSet = window.bpmnInstances.elementRegistry.filter((element) => {
            return element.id === id
          })
          
        })
      }
    },
    mounted() {
      this.initBpmnModeler();
      this.$once("hook:beforeDestroy", () => {
        if (this.bpmnModeler) this.bpmnModeler.destroy();
        this.$emit("destroy", this.bpmnModeler);
        this.bpmnModeler = null;
      });
    },
    beforeDestroy() {
      window.bpmnInstances = null;
    }
  }
</script>

<style scoped="scoped">
  .ProcessInformation {}

  .ProcessInformation-title {
    border-bottom: 1px solid #CCCCCC;
    margin-bottom: 40px;
  }

  .title-item {
    display: inline-block;
    margin-bottom: 20px;
  }

  .title-item-label {
    margin-right: 15px;
    width: 60px;
    display: inline-block;
  }

  .title-item-main {
    display: inline-block;
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

  .ProcessInformation-bpmn {
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

  .bnpmTitle {
    font-weight: 700;
    color: black;
    position: relative;
    top: -15px;
    left: 10px;
  }

  .bnpmSwitch {
    position: relative;
    top: -15px;
    left: 1140px;
  }
</style>
