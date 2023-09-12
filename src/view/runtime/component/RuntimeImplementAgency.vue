<template>
  <div>
    <div class="container">
      <div
        class="content"
        v-for="(
          { assignee, candidateUsers = [], taskId, assigneeInfoDTOList }, index
        ) in agency"
        :key="index"
      >
        <!-- <div v-show="assignee">{{ assignee }}:</div> -->
        <div class="info" v-if="candidateUsers.length > 0">
          <div>
            <div
              class="user"
              v-for="{ account, username } in assigneeInfoDTOList"
              :key="account"
            >
              <span class="assigner-card" :title="account">{{ username }}</span>
              <!-- <long-text contentStyle="width: 80px" :content="username" /> -->
            </div>
          </div>
          <!-- <el-button
            v-if="assignee === userInfo.account"
            @click="onEditAgency(taskId, candidateUsers)"
            >编辑</el-button
          > -->
          <el-button @click="onEditAgency(taskId, candidateUsers)"
            >编辑</el-button
          >
        </div>
        <div class="empty" v-else-if="candidateUsers.length === 0">
          <div>暂无代办</div>
          <el-button
            @click="onAddAgency(taskId)"
            v-if="assignee === userInfo.account && candidateUsers.length == 0"
          >
            添加
          </el-button>
        </div>
      </div>
    </div>
    <runtime-people
      title="选择代办人"
      :visible.sync="runtimePeopleVisible"
      :selected="runtimePeopleSelected"
      @submit="onRuntimePeopleSubmit"
    />
  </div>
</template>

<script>
import RuntimePeople from "./RuntimePeople.vue";
import { getModifyCandidate } from "@/api/unit/api.js";
import { mapState } from "vuex";
import LongText from "@/component/LongText";
export default {
  name: "RuntimeImplementAgency",
  components: {
    RuntimePeople,
    LongText,
  },
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
    agency() {
      return this.workflow.curTrack?.candidateUsers ?? [];
    },
  },
  methods: {
    onAddAgency(taskId) {
      this.editTaskId = taskId;
      this.runtimePeopleVisible = true;
    },
    onEditAgency(taskId, candidateUsers) {
      this.editTaskId = taskId;
      this.runtimePeopleSelected = candidateUsers.map((userName) => ({
        userId: userName,
      }));
      this.runtimePeopleVisible = true;
    },
    async onRuntimePeopleSubmit({ addeds, removeds, selections }) {
      if (removeds.length) {
        let strDelete = removeds.map(({ userId }) => userId).join(",");
        await getModifyCandidate({
          dataList: strDelete,
          operateType: "user:delete",
          taskId: this.editTaskId,
        });
      }
      if (addeds.length) {
        let strData = addeds.map(({ userId }) => userId).join(",");
        await getModifyCandidate({
          dataList: strData,
          operateType: "user:add",
          taskId: this.editTaskId,
        });
      }
      this.runtimePeopleSelected = [...selections];
      this.$message.success("代办成功");
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
