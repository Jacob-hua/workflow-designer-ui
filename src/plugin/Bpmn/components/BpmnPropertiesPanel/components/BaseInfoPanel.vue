<template>
  <div>
    <el-form
      ref="baseInfoFormRef"
      :model="baseInfoForm"
      label-position="right"
      label-width="130px"
      :rules="formRules"
    >
      <!-- <el-form-item :label="labels.id">
        <el-input v-model="baseInfoForm.id" disabled></el-input>
      </el-form-item> -->
      <el-form-item :label="labels.processName" prop="processName">
        <el-input v-model="baseInfoForm.processName" clearable></el-input>
      </el-form-item>
      <el-form-item
        v-if="!this.shapeType"
        :label="labels.processDesc"
        prop="processDesc"
      >
        <el-input
          type="textarea"
          v-model="baseInfoForm.processDesc"
          clearable
        ></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import BpmnShapeType from '../../../enum/shapeType';
import zh from '../../../i18n/zh';
import { deepCopy, deepEqual } from '../../../utils/object';

export default {
  name: 'BaseInfo',
  props: {
    namespace: {
      type: String,
      required: true,
      default: '',
    },
  },
  data() {
    return {
      baseInfoForm: {
        processName: '',
        processDesc: '',
      },
      formRules: {
        processName: [
          // { required: true, message: `请输入${this.labels.processName}`, trigger: 'change' },
          {
            max: 100,
            message: '流程名称长度不超过 100 个字符',
            trigger: 'change',
          },
          {
            trigger: 'change',
            validator: (_, value, callback) => {
              if (this.isSequenceFlow) {
                callback();
              }
              if (!value) {
                callback(new Error(`请输入${this.labels.processName}`));
              } else {
                let flag = /^[a-zA-Z0-9\u4e00-\u9fa5\-_]+$/.test(value);
                if (flag) {
                  callback();
                } else {
                  callback(
                    new Error(
                      `${this.labels.processName}只能是中文、数字、字母、下划线和中划线!`
                    )
                  );
                }
              }
            },
          },
        ],
        processDesc: [
          {
            max: 200,
            message: '流程描述长度不超过 200 个字符',
            trigger: 'change',
          },
        ],
      },
      errorList: [],
      count: 0,
    };
  },
  computed: {
    baseInfo() {
      return this.$store.state[this.namespace].panel.baseInfo;
    },
    rootBaseInfo() {
      return this.$store.state[this.namespace].panel.rootBaseInfo;
    },
    shapeType() {
      return this.$store.state[this.namespace].panel.shapeType;
    },
    listeners() {
      return this.$store.state[this.namespace].panel.listeners;
    },
    labels() {
      return {
        // id: `${zh[this.shapeType] ?? '流程'}ID`,
        processName: `${zh[this.shapeType] ?? '流程'}名称`,
        processDesc: `${zh[this.shapeType] ?? '流程'}描述`,
      };
    },
    isSequenceFlow() {
      // const selectedShapeInfo = this.iBpmnModeler.getSelectedShape();
      // console.log(selectedShapeInfo)
      // return true
      return this.shapeType === BpmnShapeType.SEQUENCE_FLOW;
    },
  },
  watch: {
    shapeType(value) {
      if (!value) {
        this.baseInfoForm = this.rootBaseInfo;
      }
      // this.$refs['baseInfoFormRef'].validate(() => {});
      const existedListener = (listener) =>
        this.listeners.find(
          (item) =>
            item.event === listener.event &&
            item.listenerType === listener.listenerType &&
            item.class === listener.class
        );
      const listener = {
        event: 'start',
        listenerType: 'class',
        class: '',
      };
      if ([BpmnShapeType.TIMER_START_EVENT].includes(value)) {
        this.clearListener();
        listener.class = 'com.siact.product.jwp.listener.ScheduleStartListener';
      } else if (
        [BpmnShapeType.TIMER_NON_INTERRUPTING_BOUNDARY_EVENT].includes(value)
      ) {
        this.clearListener();
        listener.class = 'com.siact.product.jwp.listener.TimeOutListener';
      } else if (
        [
          BpmnShapeType.START_EVENT, // 开始事件
          BpmnShapeType.MESSAGE_START_EVENT, // 消息开始事件
          BpmnShapeType.CONDITIONAL_START_EVENT, // 条件开始事件
          BpmnShapeType.SIGNAL_START_EVENT, // 信号开始事件
          BpmnShapeType.END_EVENT, // 结束事件
          BpmnShapeType.INTERMEDIATE_THROW_EVENT, // 中间抛出事件
          BpmnShapeType.INTERMEDIATE_CATCH_EVENT, // 中间捕获事件
          BpmnShapeType.BOUNDARY_EVENT, // 边界事件
          BpmnShapeType.MESSAGE_BOUNDARY_EVENT, // 消息边界事件
          BpmnShapeType.MESSAGE_NON_INTERRUPTING_BOUNDARY_EVENT, // 消息边界事件（非中断）
          BpmnShapeType.TIMER_BOUNDARY_EVENT, // 定时边界事件
          BpmnShapeType.ESCALATION_BOUNDARY_EVENT, // 升级边界事件
          BpmnShapeType.ESCALATION_NON_INTERRUPTING_BOUNDARY_EVENT, // 升级边界事件（非中断）
          BpmnShapeType.CONDITIONAL_BOUNDARY_EVENT, // 条件边界事件
          BpmnShapeType.CONDITIONAL_NON_INTERRUPTING_BOUNDARY_EVENT, // 条件边界事件（非中断）
          BpmnShapeType.ERROR_BOUNDARY_EVENT, // 错误边界事件
          BpmnShapeType.SIGNAL_BOUNDARY_EVENT, // 信号边界事件
          BpmnShapeType.SIGNAL_NON_INTERRUPTING_BOUNDARY_EVENT, // 信号边界事件（非中断）
          BpmnShapeType.COMPENSATE_BOUNDARY_EVENT, // 补偿边界事件
        ].includes(value)
      ) {
        this.clearListener();
        return;
      }
      if (listener.class === '' || existedListener(listener)) {
        return;
      }
      this.addListener({ listener });
    },
    baseInfo(value) {
      if (this.shapeType) {
        this.baseInfoForm = { processName: value.name };
        // this.$refs['baseInfoFormRef'].clearValidate();
      }
    },
    rootBaseInfo: {
      deep: true,
      handler(value) {
        if (!this.shapeType) {
          this.baseInfoForm = { ...value };
        }
      },
    },
    baseInfoForm: {
      deep: true,
      immediate: true,
      handler(value) {
        if (this.shapeType && value.processName === this.baseInfo.name) {
          return;
        }
        if (!this.shapeType && deepEqual(value, this.rootBaseInfo)) {
          return;
        }
        if (this.shapeType) {
          // const tempType = JSON.parse(JSON.stringify(this.shapeType))
          // this.updateBaseInfo({
          //   newBaseInfo: {
          //     id: this.baseInfo.id,
          //     name: value.processName,
          //   },
          // });
          // if (this.shapeType !== BpmnShapeType.SEQUENCE_FLOW) {
          //   this.$refs['baseInfoFormRef'].validate((valid) => {
          //     const index = this.errorList.findIndex(
          //       (item) => item === this.baseInfo.id
          //     );
          //     if (valid) {
          //       if (index !== -1) this.errorList.splice(index, 1);
          //       this.$EventBus.$emit('workflowCheck', this.errorList);
          //     } else {
          //       this.errorList.push(this.baseInfo.id);
          //       this.$EventBus.$emit('workflowCheck', this.errorList);
          //     }
          //   });
          // }
          this.$nextTick(() => {
            if (!this.isSequenceFlow) {
              this.$refs['baseInfoFormRef'].validate((valid) => {
                const index = this.errorList.findIndex(
                  (item) => item === this.baseInfo.id
                );
                if (valid) {
                  if (index !== -1) this.errorList.splice(index, 1);
                  this.$EventBus.$emit('workflowCheck', this.errorList);
                } else {
                  this.errorList.push(this.baseInfo.id);
                  // this.$EventBus.$emit('workflowCheck', this.errorList);
                  const set = new Set([...this.errorList]);
                  this.$EventBus.$emit('workflowCheck', Array.from(set));
                }
              });
            }
            this.updateBaseInfo({
              newBaseInfo: {
                id: this.baseInfo.id,
                name: value.processName,
              },
            });
          });
        } else {
          if (this.count) {
            this.$refs['baseInfoFormRef'].validate((valid) => {
              const index = this.errorList.findIndex((item) => item === 'root');
              this.updateRootBaseInfo({ rootBaseInfo: value });
              if (valid) {
                if (index !== -1) this.errorList.splice(index, 1);
                this.$EventBus.$emit('workflowCheck', this.errorList);
              } else {
                this.errorList.push('root');
                const set = new Set([...this.errorList]);
                this.$EventBus.$emit('workflowCheck', Array.from(set));
              }
            });
            // this.$nextTick(() => {
            //   this.$refs['baseInfoFormRef'].validate((valid) => {
            //     const index = this.errorList.findIndex(
            //       (item) => item === 'root'
            //     );
            //     this.updateRootBaseInfo({ rootBaseInfo: value });
            //     if (valid) {
            //       if (index !== -1) this.errorList.splice(index, 1);
            //       this.$EventBus.$emit('workflowCheck', this.errorList);
            //     } else {
            //       this.errorList.push('root');
            //       this.$EventBus.$emit('workflowCheck', this.errorList);
            //     }
            //   });
            // });
          } else {
            this.updateRootBaseInfo({ rootBaseInfo: value });
            this.count++;
          }
        }
      },
    },
  },
  mounted() {
    this.baseInfoForm = deepCopy({ processName: this.baseInfo.name });
  },
  methods: {
    updateBaseInfo(payload) {
      this.$store.commit(`${this.namespace}/panel/updateBaseInfo`, payload);
    },
    updateRootBaseInfo(payload) {
      this.$store.commit(`${this.namespace}/panel/updateRootBaseInfo`, payload);
    },
    addListener(payload) {
      this.$store.commit({
        type: `${this.namespace}/panel/addListener`,
        ...payload,
      });
    },
    clearListener() {
      this.$store.commit({
        type: `${this.namespace}/panel/clearListener`,
      });
    },
  },
  beforeDestroy() {
    this.count = 0;
    console.log('destory');
  },
};
</script>

<style></style>
