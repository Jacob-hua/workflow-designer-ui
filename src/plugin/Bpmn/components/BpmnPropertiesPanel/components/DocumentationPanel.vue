<template>
  <div>
    <el-form
      :model="documentationForm"
      label-position="right"
      label-width="130px"
    >
      <el-form-item :label="labels.documentation">
        <!-- <el-radio-group v-model="documentationForm.documentation">
          <el-radio label="">普通任务</el-radio>
          <el-radio label="approval-task">审批任务</el-radio>
        </el-radio-group> -->
        <el-select v-model="documentationForm.documentation">
          <el-option
            v-for="{ id, code, name } in documentationList"
            :key="id"
            :label="name"
            :value="code"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import zh from '../../../i18n/zh';
import { getWorkFlowNodeClassify } from '@/api/globalConfig';

export default {
  name: 'Documentation',
  props: {
    namespace: {
      type: String,
      required: true,
      default: '',
    },
  },
  data() {
    return {
      documentationForm: {
        documentation: '',
      },
      documentationList: [],
    };
  },
  computed: {
    documentation() {
      return (
        this.$store.state[this.namespace].panel.documentation || 'normal-task'
      );
    },
    shapeType() {
      return this.$store.state[this.namespace].panel.shapeType;
    },
    listeners() {
      return this.$store.state[this.namespace].panel.listeners;
    },
    labels() {
      return {
        documentation: `${zh[this.shapeType] ?? '流程'}类型`,
      };
    },
  },
  watch: {
    documentation: {
      immediate: true,
      handler(value) {
        this.documentationForm = { documentation: value };
      },
    },
    documentationForm: {
      deep: true,
      immediate: true,
      handler(value) {
        if (value.documentation === this.documentation) {
          return;
        }
        this.updateDocumentation({ documentation: value.documentation });
      },
    },
  },
  mounted() {
    this.documentationForm = {
      documentation: this.documentation,
    };
    this.getDocumentation();
  },
  methods: {
    updateDocumentation(payload) {
      this.$store.commit(
        `${this.namespace}/panel/updateParentDocumentation`,
        payload
      );
      this.$store.commit(
        `${this.namespace}/panel/updateDocumentation`,
        payload
      );
    },
    getDocumentation() {
      // getWorkFlowNodeClassify({ classify: 'processNodeType' }).then(
      //   ({ errorInfo, result }) => {
      //     if (errorInfo.errorCode) {
      //       this.$message.error(errorInfo.errorMsg);
      //       return;
      //     }
      //     this.documentationList = result;
      //   }
      // );
      this.documentationList = [
        {
          id: '61',
          code: 'normal-task',
          name: '普通任务',
        },
        {
          id: '62',
          code: 'approval-task',
          name: '审批任务',
        },
        {
          id: '59',
          code: 'jjbzx-task',
          name: '交接班执行任务',
        },
        {
          id: '60',
          code: 'cbzx-task',
          name: '抄表执行任务',
        },
        {
          id: '63',
          code: 'xjzx-task',
          name: '巡检执行任务',
        },
        {
          id: '64',
          code: 'gdfp-task',
          name: '分配任务',
        },
        {
          id: '65',
          code: 'wx-task',
          name: '维修任务',
        },
      ];
    },
  },
};
</script>

<style></style>
