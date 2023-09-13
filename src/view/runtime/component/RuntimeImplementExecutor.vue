<template>
  <div>
    <div class="container">
      <div class="content">
        <div class="empty" v-if="executors.length == 0">
          <span>后续任务未指定操作人，请选择操作人</span>
          <el-button @click="onConfirmation" :disabled="editDiasble">选择操作人</el-button>
        </div>
        <div class="info" v-else>
          <div>
            <div class="user" v-for="{ userId } in executors" :key="userId">
              {{ userId }}
            </div>
          </div>
          <el-button @click="onEditExecutor" :disabled="editDiasble"> 编辑 </el-button>
        </div>
      </div>
    </div>
    <runtime-people
      title="选择操作人"
      :visible.sync="runtimePeopleVisible"
      :selected="runtimePeopleSelected"
      @submit="onRuntimePeopleSubmit"
      :isRadio="true"
    />
  </div>
</template>

<script>
import RuntimePeople from "./RuntimePeople.vue";

export default {
  name: "RuntimeImplementExecutor",
  components: { RuntimePeople },
  props: {
    workflow: {
      type: Object,
      default: () => ({}),
    },
    operationDisable: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      runtimePeopleVisible: false,
      runtimePeopleSelected: [],
    };
  },
  computed: {
    executors() {
      return this.workflow?.executors ?? [];
    },
    editDiasble() {
      return this.operationDisable
    }
  },
  methods: {
    onConfirmation() {
      this.runtimePeopleVisible = true;
    },
    onEditExecutor() {
      this.runtimePeopleVisible = true;
      this.runtimePeopleSelected = this.executors;
    },
    onRuntimePeopleSubmit({ selections }) {
      this.$emit("selectExecutor", selections);
    },
  },
};
</script>

<style scoped lang="scss">
@import "../index.scss";

@include container;

@include userContent;
</style>
