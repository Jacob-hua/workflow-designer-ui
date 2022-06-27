<template>
  <div>
    <div class="peopleList-title">指定传阅人员:</div>
    <div class="peopleList">
      <div v-for="({ assignee, circulations, taskId }, index) in circulate" :key="index">
        <span v-show="assignee"> {{ assignee }}: </span>
        <div class="peopleList-item" v-for="userName in circulations[0].unitList" :key="userName">
          {{ userName }}
        </div>
        <span
          class="addCirculate"
          @click="onEditCirculate(taskId, circulations)"
          v-if="assignee === userInfo.account && circulations[0].unitList.length > 0"
        >
          编辑
        </span>
        <div v-else-if="circulations[0].unitList.length == 0" style="display: inline-block">
          <span>暂无传阅</span>
          <span class="addCirculate" @click="onAddCirculate(taskId)" v-if="assignee === userInfo.account">
            点击添加
          </span>
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
import { mapState } from 'vuex'
import RuntimePeople from './RuntimePeople.vue'
import { getCirculation } from '@/api/unit/api.js'

export default {
  name: 'RuntimeImplementCirculate',
  components: { RuntimePeople },
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
    circulate() {
      return this.workflow.curTrack?.circulationList ?? []
    },
  },
  methods: {
    onAddCirculate(taskId) {
      this.editTaskId = taskId
      this.runtimePeopleVisible = true
    },
    onEditCirculate(taskId, circulations) {
      this.editTaskId = taskId
      this.runtimePeopleSelected = circulations[0].unitList.map((userName) => ({
        userId: userName,
      }))
      this.runtimePeopleVisible = true
    },
    async onRuntimePeopleSubmit({ addeds, removeds }) {
      if (removeds.length) {
        let strDelete = removeds.map(({ userId }) => userId).join(',')
        await getCirculation({
          unitList: strDelete,
          operateType: 'delete',
          taskId: this.editTaskId,
          type: 'user',
          operator: this.userInfo.account,
          processInstanceId: this.workflow.processInstanceId,
        })
      }
      if (addeds.length) {
        let strData = addeds.map(({ userId }) => userId).join(',')
        await getCirculation({
          unitList: strData,
          operateType: 'add',
          taskId: this.editTaskId,
          type: 'user',
          operator: this.userInfo.account,
          processInstanceId: this.workflow.processInstanceId,
        })
      }
      this.$message.success('传阅成功')
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
