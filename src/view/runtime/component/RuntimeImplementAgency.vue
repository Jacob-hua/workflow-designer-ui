<template>
  <div>
    <div class="peopleList-title">指定代办人员:</div>
    <div class="peopleList">
      <div v-for="({ assignee, candidateUsers = [], taskId }, index) in agency" :key="index">
        <span v-show="assignee"> {{ assignee }}: </span>
        <div class="peopleList-item" v-for="userName in candidateUsers" :key="userName">
          {{ userName }}
        </div>
        <span
          v-if="assignee === userInfo.account && candidateUsers.length > 0"
          class="addCirculate"
          @click="onEditAgency(taskId, candidateUsers)"
        >
          编辑
        </span>
        <div v-else-if="candidateUsers.length === 0" style="display: inline-block">
          <span>暂无代办</span>
          <span
            class="addCirculate"
            @click="onAddAgency(taskId)"
            v-if="assignee === userInfo.account && candidateUsers.length == 0"
          >
            点击添加
          </span>
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
import RuntimePeople from './RuntimePeople.vue'
import { getModifyCandidate } from '@/api/unit/api.js'
import { mapState } from 'vuex'

export default {
  name: 'RuntimeImplementAgency',
  components: {
    RuntimePeople,
  },
  props: {
    workflow: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      editTaskId: '',
      runtimePeopleVisible: false,
      runtimePeopleSelected: [],
    }
  },
  computed: {
    ...mapState('account', ['userInfo']),
    agency() {
      return this.workflow.curTrack?.candidateUsers ?? []
    },
  },
  methods: {
    onAddAgency(taskId) {
      this.editTaskId = taskId
      this.runtimePeopleVisible = true
    },
    onEditAgency(taskId, candidateUsers) {
      this.editTaskId = taskId
      this.runtimePeopleSelected = candidateUsers.map((userName) => ({
        userId: userName,
      }))
      this.runtimePeopleVisible = true
    },
    async onRuntimePeopleSubmit({ addeds, removeds }) {
      if (removeds.length) {
        let strDelete = removeds.map(({ userId }) => userId).join(',')
        await getModifyCandidate({
          dataList: strDelete,
          operateType: 'user:delete',
          taskId: this.editTaskId,
        })
      }
      if (addeds.length) {
        let strData = addeds.map(({ userId }) => userId).join(',')
        await getModifyCandidate({
          dataList: strData,
          operateType: 'user:add',
          taskId: this.editTaskId,
        })
      }
      this.$message.success('代办成功')
      this.$emit('completed')
    },
  },
}
</script>

<style scoped>
.peopleList {
  margin-top: 15px;
}

.peopleList-item {
  display: inline-block;
  width: 96px;
  height: 32px;
  line-height: 32px;
  text-align: center;
  border: 1px solid #108cee;
  border-radius: 5px;
  margin-left: 20px;
}

.addCirculate {
  margin-left: 10px;
  display: inline-block;
  color: #5b5091;
  cursor: pointer;
}
</style>
