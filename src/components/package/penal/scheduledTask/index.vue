<template>
  <div class="panel-tab__content">
    <el-form size="mini" label-width="90px" @submit.native.prevent>
      <el-form-item label="任务类型">
        <el-select v-model="loopCharacteristics" @change="changeLoopCharacteristicsType">
          <!--bpmn:MultiInstanceLoopCharacteristics-->
          <el-option label="日期" value="timeDate" />
          <el-option label="持续" value="timeDuration" />
          <!--bpmn:StandardLoopCharacteristics-->
          <el-option label="循环" value="timeCycle" />
          <el-option label="无" value="Null" />
        </el-select>
      </el-form-item>
      <template v-if="loopCharacteristics === 'timeDate'">
        <el-form-item label="定时器定义" key="timeDate">
          <el-date-picker
                v-model="loopInstanceForm.loopCardinality"
                type="datetime"
                placeholder="选择日期时间"
                value-format="yyyy-MM-ddTHH-mm-ss"
                @change="updateLoopCardinality">
              </el-date-picker>
        </el-form-item>
      </template>
      <template v-if="loopCharacteristics === 'timeDuration'">
        <el-form-item label="定时器定义" key="timeDuration">
          <el-input v-model="loopInstanceForm.loopCardinality" clearable @change="updateLoopCardinality" />
        </el-form-item>
      </template>
      <template v-if="loopCharacteristics === 'timeCycle'">
        <el-form-item label="定时器定义" key="timeCycle">
          <el-input v-model="loopInstanceForm.loopCardinality" clearable @change="updateLoopCardinality" />
        </el-form-item>
      </template>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "ElementMultiInstance",
  props: {
    businessObject: Object,
    type: String
  },
  inject: {
    prefix: "prefix"
  },
  data() {
    return {
      loopCharacteristics: "",
      //默认配置，用来覆盖原始不存在的选项，避免报错
      defaultLoopInstanceForm: {
        loopCardinality: ""
      },
      loopInstanceForm: {},
      multiLoopInstance: null
    };
  },
  watch: {
    businessObject: {
      immediate: true,
      handler(val) {
        this.bpmnElement = window.bpmnInstances.bpmnElement;
        this.getElementLoop(val);
      }
    }
  },
  methods: {
    getElementLoop(businessObject) {
      console.log(businessObject, '00000')
      if (!businessObject.eventDefinitions) {
        return;
      }
      this.multiLoopInstance = window.bpmnInstances.bpmnElement.businessObject.eventDefinitions[0];
      if (businessObject.eventDefinitions[0].timeDate) {
        this.loopCharacteristics = "timeDate";
        this.loopInstanceForm = {
          loopCardinality: businessObject.eventDefinitions[0].timeDate.body
        };
        return;
      }
      if (businessObject.eventDefinitions[0].timeDuration) {
        this.loopCharacteristics = "timeDuration";
        this.loopInstanceForm = {
          loopCardinality: businessObject.eventDefinitions[0].timeDuration.body
        };
        return;
      }
      if (businessObject.eventDefinitions[0].timeCycle) {
        this.loopCharacteristics = "timeCycle";
        this.loopInstanceForm = {
          loopCardinality: businessObject.eventDefinitions[0].timeCycle.body
        };
        return;
      }
      this.loopCharacteristics = "Null";
      this.loopInstanceForm = {};
      // 保留当前元素 businessObject 上的 loopCharacteristics 实例
    },
    changeLoopCharacteristicsType(type) {
      // 取消多实例配置
      if (type === "Null") {
       window.bpmnInstances.modeling.updateModdleProperties(this.bpmnElement, this.multiLoopInstance, {
         timeDate: null,
         timeDuration: null,
         timeCycle: null
       });
       return;
      }
      // 日期
      if (type === "timeDate") {
        window.bpmnInstances.modeling.updateModdleProperties(this.bpmnElement, this.multiLoopInstance, {
          timeDate: null,
          timeDuration: null,
          timeCycle: null
        });
        let timeDate = window.bpmnInstances.moddle.create("bpmn:FormalExpression");
        window.bpmnInstances.modeling.updateModdleProperties(this.bpmnElement, this.multiLoopInstance, {
          timeDate
        });
        return;
      }
      // 配置
      if (type === "timeDuration") {
        window.bpmnInstances.modeling.updateModdleProperties(this.bpmnElement, this.multiLoopInstance, {
          timeDate: null,
          timeDuration: null,
          timeCycle: null
        });
        let timeDuration = window.bpmnInstances.moddle.create("bpmn:FormalExpression");
        window.bpmnInstances.modeling.updateModdleProperties(this.bpmnElement, this.multiLoopInstance, {
          timeDuration
        });
        return
      }
      // 循环
      if (type === "timeCycle") {
        window.bpmnInstances.modeling.updateModdleProperties(this.bpmnElement, this.multiLoopInstance, {
          timeDate: null,
          timeDuration: null,
          timeCycle: null
        });
        let timeCycle = window.bpmnInstances.moddle.create("bpmn:FormalExpression");
        window.bpmnInstances.modeling.updateModdleProperties(this.bpmnElement, this.multiLoopInstance, {
          timeCycle
        });
        return;
      }
    },
    // 定时器定义
    updateLoopCardinality(cardinality) {
      // 日期
      if (this.loopCharacteristics === "timeDate") {
        window.bpmnInstances.modeling.updateModdleProperties(this.bpmnElement, this.multiLoopInstance, {
          timeDate: null,
          timeDuration: null,
          timeCycle: null
        });
        let timeDate = window.bpmnInstances.moddle.create("bpmn:FormalExpression", { body: cardinality });
        window.bpmnInstances.modeling.updateModdleProperties(this.bpmnElement, this.multiLoopInstance, {
          timeDate
        });
        return;
      }
      // 配置
      if (this.loopCharacteristics === "timeDuration") {
        window.bpmnInstances.modeling.updateModdleProperties(this.bpmnElement, this.multiLoopInstance, {
          timeDate: null,
          timeDuration: null,
          timeCycle: null
        });
        let timeDuration = window.bpmnInstances.moddle.create("bpmn:FormalExpression", { body: cardinality });
        window.bpmnInstances.modeling.updateModdleProperties(this.bpmnElement, this.multiLoopInstance, {
          timeDuration
        });
        return
      }
      // 循环
      if (this.loopCharacteristics === "timeCycle") {
        window.bpmnInstances.modeling.updateModdleProperties(this.bpmnElement, this.multiLoopInstance, {
          timeDate: null,
          timeDuration: null,
          timeCycle: null
        });
        let timeCycle = window.bpmnInstances.moddle.create("bpmn:FormalExpression", { body: cardinality });
        window.bpmnInstances.modeling.updateModdleProperties(this.bpmnElement, this.multiLoopInstance, {
          timeCycle
        });
        return;
      }
    }
  },
  beforeDestroy() {
    this.multiLoopInstance = null;
    this.bpmnElement = null;
  }
};
</script>
