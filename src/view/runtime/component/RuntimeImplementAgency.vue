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
    <runtime-people ref="runtimePeople" @submit="onRuntimePeopleSubmit" />
  </div>
</template>

<script>
import runtimePeople from './runtimePeople.vue'
import { getModifyCandidate } from '@/api/unit/api.js'
import { mapState } from 'vuex'

export default {
  name: 'RuntimeImplementAgency',
  components: {
    runtimePeople,
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
    }
  },
  computed: {
    ...mapState('account', ['userInfo']),
    agency() {
      if (!Array.isArray(this.workflow.trackList)) {
        return []
      }
      return this.workflow.trackList.at(-1).candidateUsers
    },
  },
  methods: {
    onAddAgency(taskId) {
      this.editTaskId = taskId
      this.$refs.runtimePeople.dialogVisible = true
    },
    onEditAgency(taskId, candidateUsers) {
      this.editTaskId = taskId
      this.$refs.runtimePeople.detailSelection = candidateUsers.map((userName) => {
        return {
          userId: userName,
        }
      })
      this.$refs.runtimePeople.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.runtimePeople.toggleRowSelection()
      })
    },
    async onRuntimePeopleSubmit({ dataList, deleteList }) {
      if (deleteList.length) {
        let strDelete = deleteList.join(',')
        await getModifyCandidate({
          dataList: strDelete,
          operateType: 'user:delete',
          taskId: this.editTaskId,
        })
      }
      if (dataList.length) {
        let strData = dataList.join(',')
        await getModifyCandidate({
          dataList: strData,
          operateType: 'user:add',
          taskId: this.editTaskId,
        })
      }
      this.$message.success('代办成功')
      this.$emit('completed')
      this.$refs.runtimePeople.dialogVisible = false
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
</style>
