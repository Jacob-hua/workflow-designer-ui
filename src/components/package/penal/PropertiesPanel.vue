<template>
  <div class="process-panel__container" :style="{ width: `${this.width}px` }">
    <el-collapse v-model="activeTab">
      <el-collapse-item name="base">
        <div slot="title" class="panel-tab__title"><i class="el-icon-info"></i>常规</div>
        <element-base-info ref="baseInfo" :id-edit-disabled="idEditDisabled" :business-object="elementBusinessObject" :type="elementType" />
      </el-collapse-item>
      <el-collapse-item name="condition" v-if="elementType === 'Process'" key="message">
        <div slot="title" class="panel-tab__title"><i class="el-icon-s-comment"></i>消息与信号</div>
        <signal-and-massage />
      </el-collapse-item>
      <el-collapse-item name="condition" v-if="conditionFormVisible" key="condition">
        <div slot="title" class="panel-tab__title"><i class="el-icon-s-promotion"></i>流转条件</div>
        <flow-condition :business-object="elementBusinessObject" :type="elementType" />
      </el-collapse-item>
      <!--      <el-collapse-item name="condition" v-if="formVisible" key="form">
              <div slot="title" class="panel-tab__title"><i class="el-icon-s-order"></i>表单</div>
              <element-form :id="elementId" :type="elementType" />
            </el-collapse-item> -->
      <el-collapse-item name="task" v-if="elementType.indexOf('Task') !== -1" key="task">
        <div slot="title" class="panel-tab__title"><i class="el-icon-s-claim"></i>任务</div>
        <element-task :id="elementId" :type="elementType" />
      </el-collapse-item>
      <el-collapse-item name="multiInstance" v-if="elementType.indexOf('Task') !== -1" key="multiInstance">
        <div slot="title" class="panel-tab__title"><i class="el-icon-s-help"></i>多实例</div>
        <element-multi-instance :business-object="elementBusinessObject" :type="elementType" />
      </el-collapse-item>
      <el-collapse-item name="multiInstance" v-if="elementTimerEventDefinition" key="TimerEventDefinition">
        <div slot="title" class="panel-tab__title"><i class="el-icon-s-help"></i>定时任务详情</div>
        <ScheduledTask :business-object="elementBusinessObject" :type="elementType" />
      </el-collapse-item>
      <el-collapse-item name="listeners" key="listeners">
        <div slot="title" class="panel-tab__title"><i class="el-icon-message-solid"></i>执行监听器</div>
        <element-listeners :id="elementId" :type="elementType" />
      </el-collapse-item>
      <el-collapse-item name="taskListeners" v-if="elementType === 'UserTask'" key="taskListeners">
        <div slot="title" class="panel-tab__title"><i class="el-icon-message-solid"></i>任务监听器</div>
        <user-task-listeners :id="elementId" :type="elementType" />
      </el-collapse-item>
      <el-collapse-item name="extensions" key="extensions">
        <div slot="title" class="panel-tab__title"><i class="el-icon-circle-plus"></i>扩展属性</div>
        <element-properties :id="elementId" :type="elementType" />
      </el-collapse-item>
      <el-collapse-item v-if="elementType.indexOf('Task') !== -1" name="btnSetting" key="btnSetting">
        <div slot="title" class="panel-tab__title"><i class="el-icon-circle-plus"></i>操作按钮配置</div>
        <div style="margin-left: 10px;">
          <el-checkbox-group @change="btnListChange" v-model="btnList">
            <el-checkbox label="待办"></el-checkbox>
            <el-checkbox label="传阅"></el-checkbox>
            <el-checkbox label="挂起"></el-checkbox>
            <el-checkbox v-if="addOrSub" label="加减签"></el-checkbox>
            <el-checkbox label="驳回"></el-checkbox>
            <el-checkbox label="终止"></el-checkbox>
          </el-checkbox-group>
        </div>
      </el-collapse-item>
      <el-collapse-item name="other" key="other">
        <div slot="title" class="panel-tab__title"><i class="el-icon-s-promotion"></i>其他</div>
        <element-other-config :id="elementId" />
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>
import ElementBaseInfo from "./base/ElementBaseInfo";
import ElementOtherConfig from "./other/ElementOtherConfig";
import ElementTask from "./task/ElementTask";
import ElementMultiInstance from "./multi-instance/ElementMultiInstance";
import FlowCondition from "./flow-condition/FlowCondition";
import SignalAndMassage from "./signal-message/SignalAndMessage";
import ElementListeners from "./listeners/ElementListeners";
import ElementProperties from "./properties/ElementProperties";
import ElementForm from "./form/ElementForm";
import UserTaskListeners from "./listeners/UserTaskListeners";
import ScheduledTask from "./scheduledTask/index.vue"
import Log from "../Log";
import X2JS from "x2js";

/**
 * 侧边栏
 * @Author MiyueFE
 * @Home https://github.com/miyuesc
 * @Date 2021年3月31日18:57:51
 */
export default {
  name: "MyPropertiesPanel",
  components: {
    UserTaskListeners,
    ElementForm,
    ElementProperties,
    ElementListeners,
    SignalAndMassage,
    FlowCondition,
    ElementMultiInstance,
    ElementTask,
    ElementOtherConfig,
    ElementBaseInfo,
    ScheduledTask
  },
  componentName: "MyPropertiesPanel",
  props: {
    bpmnModeler: Object,
    prefix: {
      type: String,
      default: "camunda"
    },
    width: {
      type: Number,
      default: 480
    },
    idEditDisabled: {
      type: Boolean,
      default: false
    }
  },
  provide() {
    return {
      prefix: this.prefix,
      width: this.width
    };
  },
  data() {
    return {
      currentId: '',
      addOrSub: false,
      btnList: [],
      activeTab: "base",
      elementId: "",
      elementType: "",
      elementTimerEventDefinition: "", // 是否为定时开始事件组件
      elementBusinessObject: {}, // 元素 businessObject 镜像，提供给需要做判断的组件使用
      conditionFormVisible: false, // 流转条件设置
      formVisible: false // 表单配置
    };
  },
  watch: {
    elementId: {
      handler() {
        this.activeTab = "btnSetting";
      }
    }
  },
  created() {
    this.initModels();
  },
  methods: {
    btnListChange() {
      let _this = this
      const newConvert = new X2JS();
      this.bpmnModeler.saveXML({ format: true }).then((obj) => {
        const { definitions } = newConvert.xml2js(obj.xml);
        console.log(window.bpmnInstances.bpmnElement.id)
        let domParse = new DOMParser()
        let doc = domParse.parseFromString(obj.xml, 'text/xml')
        this.currentId = window.bpmnInstances.bpmnElement.id
        let element = doc.getElementById(window.bpmnInstances.bpmnElement.id)
        element.setAttribute('camunda:btnList', JSON.stringify(_this.btnList) )
        let serializer = new XMLSerializer();
        _this.bpmnModeler.importXML( serializer.serializeToString(doc), (error)=> {
          if (error) {
          } else {
          }
          console.log('xml重新加载了')
          let shape = window.bpmnInstances.elementRegistry.get(_this.currentId)
          window.bpmnInstances.selection.select(shape)
        })

      });

      console.log(window.bpmnInstances)
    },
    initModels() {
      // 初始化 modeler 以及其他 moddle
      if (!this.bpmnModeler) {
        // 避免加载时 流程图 并未加载完成
        this.timer = setTimeout(() => this.initModels(), 10);
        return;
      }
      if (this.timer) clearTimeout(this.timer);
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
      this.getActiveElement();
    },
    getActiveElement() {
      let _this = this
      let flag = true
      let firstElement, currentLine
      // 初始第一个选中元素 bpmn:Process
      this.initFormOnChanged(null);
      this.bpmnModeler.on("import.done", e => {
        this.initFormOnChanged(null);
      });
      // 监听选择事件，修改当前激活的元素以及表单
      this.bpmnModeler.on("selection.changed", ({ newSelection }) => {
        this.initFormOnChanged(newSelection[0] || null);

      });
      this.bpmnModeler.on("element.changed", ({ element }) => {
        if (_this.bpmnElement.id.includes('Process')) {
          firstElement =  _this.bpmnElement.children[0].id
        } else {
          flag = _this.bpmnElement.id !== firstElement;
          console.log('后来元素改变')
          if (flag) {
            if (_this.bpmnElement.incoming.length > 0) {

              if (_this.bpmnElement.incoming[0].id !== currentLine) {
                _this.btnList = []
                currentLine = _this.bpmnElement.incoming[0].id
              }
            } else {

            }
          }
        }

        // 保证 修改 "默认流转路径" 类似需要修改多个元素的事件发生的时候，更新表单的元素与原选中元素不一致。
        this.addOrSub = false
        if (element && element.id === this.elementId) {
          this.initFormOnChanged(element);
        }
      });
    },
    // 初始化数据
    initFormOnChanged(element) {
      let activatedElement = element;
      if (!activatedElement) {
        activatedElement =
            window.bpmnInstances.elementRegistry.find(el => el.type === "bpmn:Process") ??
            window.bpmnInstances.elementRegistry.find(el => el.type === "bpmn:Collaboration");
        console.log(activatedElement)
      }
      if (!activatedElement) return;
      Log.printBack(`select element changed: id: ${activatedElement.id} , type: ${activatedElement.businessObject.$type}`);
      Log.prettyInfo("businessObject", activatedElement.businessObject);
      window.bpmnInstances.bpmnElement = activatedElement;
      if (Object.keys(activatedElement.businessObject).includes('loopCharacteristics')) {
        this.addOrSub = true
      }
      this.bpmnElement = activatedElement;
      this.elementId = activatedElement.id;
      this.elementType = activatedElement.type.split(":")[1] || "";
      this.elementTimerEventDefinition = activatedElement.businessObject.eventDefinitions && activatedElement.businessObject.eventDefinitions[0].$type
      this.elementBusinessObject = JSON.parse(JSON.stringify(activatedElement.businessObject));
      this.conditionFormVisible = !!(
          this.elementType === "SequenceFlow" &&
          activatedElement.source &&
          activatedElement.source.type.indexOf("StartEvent") === -1
      );
      this.formVisible = this.elementType === "UserTask" || this.elementType === "StartEvent";
    },
    beforeDestroy() {
      window.bpmnInstances = null;
    }
  }
};
</script>
<style scoped>
/deep/ .el-checkbox {
  margin-bottom: 10px;
}
</style>
