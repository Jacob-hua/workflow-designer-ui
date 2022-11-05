<template>
  <div>
    <div class="container">
      <div
        class="content"
        v-for="({ assignee, circulations, taskId }, index) in circulate"
        :key="index"
      >
        <div v-show="assignee">{{ assignee }}:</div>
        <div
          class="info"
          v-if="
            assignee === userInfo.account && circulations[0].unitList.length > 0
          "
        >
          <div>
            <div
              class="user"
              v-for="userName in circulations[0].unitList"
              :key="userName"
            >
              <long-text contentStyle="width: 80px" :content="userName" />
            </div>
          </div>
          <el-button @click="onEditCirculate(taskId, circulations)">
            编辑
          </el-button>
        </div>
        <div
          class="empty"
          v-else-if="circulations && circulations[0].unitList.length == 0"
        >
          <div>暂无传阅</div>
          <el-button
            @click="onAddCirculate(taskId)"
            v-if="assignee === userInfo.account"
          >
            添加
          </el-button>
        </div>
      </div>
    </div>
    <runtime-people
      title="选择传阅人"
      :visible.sync="runtimePeopleVisible"
      :selected="runtimePeopleSelected"
      @submit="onRuntimePeopleSubmit"
    />
  </div>
</template>

<script>
import { mapState } from "vuex";
import RuntimePeople from "./RuntimePeople.vue";
import { getCirculation } from "@/api/unit/api.js";
import LongText from "@/component/LongText";
export default {
  name: "RuntimeImplementCirculate",
  components: { RuntimePeople, LongText },
  props: {
    workflow: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      editTaskId: "",
      runtimePeopleVisible: false,
      runtimePeopleSelected: [],
    };
  },
  computed: {
    ...mapState("account", ["userInfo"]),
    circulate() {
      return this.workflow.curTrack?.circulationList ?? [];
    },
  },
  methods: {
    onAddCirculate(taskId) {
      this.editTaskId = taskId;
      this.runtimePeopleVisible = true;
    },
    onEditCirculate(taskId, circulations) {
      this.editTaskId = taskId;
      this.runtimePeopleSelected = circulations[0].unitList.map((userName) => ({
        userId: userName,
      }));
      this.runtimePeopleVisible = true;
    },
    async onRuntimePeopleSubmit({ addeds, removeds, selections }) {
      if (removeds.length) {
        let strDelete = removeds.map(({ userId }) => userId).join(",");
        await getCirculation({
          unitList: strDelete,
          operateType: "delete",
          taskId: this.editTaskId,
          type: "user",
          operator: this.userInfo.account,
          processInstanceId: this.workflow.processInstanceId,
        });
      }
      if (addeds.length) {
        let strData = addeds.map(({ userId }) => userId).join(",");
        await getCirculation({
          unitList: strData,
          operateType: "add",
          taskId: this.editTaskId,
          type: "user",
          operator: this.userInfo.account,
          processInstanceId: this.workflow.processInstanceId,
        });
      }
      this.runtimePeopleSelected = [...selections]
      this.$message.success("传阅成功");
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
