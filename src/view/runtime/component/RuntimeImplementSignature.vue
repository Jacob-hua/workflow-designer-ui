<template>
  <div>
    <div class="container">
      <div class="content">
        <div>会签:</div>
        <div class="info">
          <div>
            <div
              class="user"
              v-for="({ userId }, index) in signature"
              :key="index"
            >
              <long-text contentStyle="color: white" :content="userId" />
            </div>
          </div>
        </div>
        <el-button @click="onEditSignature()">编辑</el-button>
      </div>
    </div>
    <runtime-people
      title="用户选择"
      :visible.sync="runtimePeopleVisible"
      :selected="runtimePeopleSelected"
      @submit="onRuntimePeopleSubmit"
    />
  </div>
</template>

<script>
import RuntimePeople from "./RuntimePeople.vue";
import { postModifyProcessUser } from "@/api/unit/api.js";
import LongText from "@/component/LongText";
export default {
  components: { RuntimePeople, LongText },
  name: "RuntimeImplementSignature",
  props: {
    workflow: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      runtimePeopleVisible: false,
      runtimePeopleSelected: [],
    };
  },
  computed: {
    signature() {
      const assignees = this.workflow.curTrack?.assignee.split(",") ?? [];
      return assignees.reduce(
        (signature, assignee) => [...signature, { userId: assignee }],
        []
      );
    },
  },
  methods: {
    onEditSignature() {
      this.runtimePeopleSelected = this.signature;
      this.runtimePeopleVisible = true;
    },
    async onRuntimePeopleSubmit({ selections }) {
      const userList = selections.map(({ userId }) => userId);
      await postModifyProcessUser({
        processInstanceId: this.workflow.processInstanceId,
        taskKey: this.workflow.taskKey,
        taskId: this.workflow.newTaskId,
        userList,
      });
      this.$message.success("加减签成功");
      this.$emit("completed");
    },
  },
};
</script>

<style scoped lang="scss">
@import "../index.scss";

@include container;

@include userContent;
</style>
