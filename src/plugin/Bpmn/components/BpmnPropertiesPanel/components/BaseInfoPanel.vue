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
import shapeType from '../../../enum/shapeType';
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
          { required: true, message: '请输入流程名称', trigger: 'blur' },
          {
            min: 2,
            max: 100,
            message: '流程名称长度在 2 到 100 个字符',
            trigger: 'blur',
          },
          {
            trigger: 'blur',
            validator: (_, value, callback) => {
              let flag = /[a-zA-Z0-9\u4e00-\u9fa5\-_]+$/.test(value);
              if (flag) {
                callback();
              } else {
                callback(
                  new Error('流程名称只能是中文、数字、字母、下划线和中划线!')
                );
              }
            },
          },
        ],
        processDesc: [
          {
            min: 0,
            max: 200,
            message: '流程描述长度在 0 到 200 个字符',
            trigger: 'blur',
          },
        ],
      },
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
  },
  watch: {
    shapeType(value) {
      if (!value) {
        this.baseInfoForm = this.rootBaseInfo;
      }
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
      if ([shapeType.TIMER_START_EVENT].includes(value)) {
        this.clearListener();
        listener.class = 'com.siact.product.jwp.listener.ScheduleStartListener';
      } else if (
        [shapeType.TIMER_NON_INTERRUPTING_BOUNDARY_EVENT].includes(value)
      ) {
        this.clearListener();
        listener.class = 'com.siact.product.jwp.listener.TimeOutListener';
      } else if (
        [
          shapeType.START_EVENT, // 开始事件
          shapeType.MESSAGE_START_EVENT, // 消息开始事件
          shapeType.CONDITIONAL_START_EVENT, // 条件开始事件
          shapeType.SIGNAL_START_EVENT, // 信号开始事件
          shapeType.END_EVENT, // 结束事件
          shapeType.INTERMEDIATE_THROW_EVENT, // 中间抛出事件
          shapeType.INTERMEDIATE_CATCH_EVENT, // 中间捕获事件
          shapeType.BOUNDARY_EVENT, // 边界事件
          shapeType.MESSAGE_BOUNDARY_EVENT, // 消息边界事件
          shapeType.MESSAGE_NON_INTERRUPTING_BOUNDARY_EVENT, // 消息边界事件（非中断）
          shapeType.TIMER_BOUNDARY_EVENT, // 定时边界事件
          shapeType.ESCALATION_BOUNDARY_EVENT, // 升级边界事件
          shapeType.ESCALATION_NON_INTERRUPTING_BOUNDARY_EVENT, // 升级边界事件（非中断）
          shapeType.CONDITIONAL_BOUNDARY_EVENT, // 条件边界事件
          shapeType.CONDITIONAL_NON_INTERRUPTING_BOUNDARY_EVENT, // 条件边界事件（非中断）
          shapeType.ERROR_BOUNDARY_EVENT, // 错误边界事件
          shapeType.SIGNAL_BOUNDARY_EVENT, // 信号边界事件
          shapeType.SIGNAL_NON_INTERRUPTING_BOUNDARY_EVENT, // 信号边界事件（非中断）
          shapeType.COMPENSATE_BOUNDARY_EVENT, // 补偿边界事件
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
      }
    },
    rootBaseInfo(value) {
      if (!this.shapeType) {
        this.baseInfoForm = { ...value };
      }
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
          if (this.count) {
            this.$nextTick(() => {
              this.$refs['baseInfoFormRef'].validate((valid) => {
                if (valid) {
                  this.updateBaseInfo({
                    newBaseInfo: {
                      id: this.baseInfo.id,
                      name: value.processName,
                    },
                  });
                }
              });
            });
          } else {
            this.updateBaseInfo({
              newBaseInfo: {
                id: this.baseInfo.id,
                name: value.processName,
              },
            });
            this.count++;
          }
        } else {
          if (this.count) {
            this.$nextTick(() => {
              this.$refs['baseInfoFormRef'].validate((valid) => {
                if (valid) {
                  this.updateRootBaseInfo({ rootBaseInfo: value });
                }
              });
            });
          }else{
            this.updateRootBaseInfo({ rootBaseInfo: value });
            this.count++
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
  beforeDestroy(){
    this.count = 0
  }
};
</script>

<style></style>
