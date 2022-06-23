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
          @click="changePeopleList(taskId, 'edit', 'Circulate', circulations[0].unitList)"
          v-if="assignee === userInfo.account && circulations[0].unitList.length > 0"
        >
          编辑
        </span>
        <div v-else-if="circulations[0].unitList.length == 0" style="display: inline-block">
          <span>暂无传阅</span>
          <span class="addCirculate" @click="changePeopleList(taskId)" v-if="assignee === userInfo.account">
            点击添加
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'RuntimeImplementCirculate',
  props: {
    workflow: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    ...mapState('account', ['userInfo']),
    circulate() {
      return this.workflow.circulate ?? []
    },
  },
  methods: {
    changePeopleList(taskId, type, value, item) {
      if (type === 'edit') {
        let a = []
        item.forEach((item1) => {
          a.push({
            userId: item1,
          })
        })
        switch (value) {
          case 'Agency':
            this.$refs.runtimePeople.detailSelection = JSON.parse(JSON.stringify(a))
            break
          case 'Circulate':
            this.$refs.runtimePeople.detailSelection = JSON.parse(JSON.stringify(a))
            break
          default:
            break
        }
      }
      this.$refs.runtimePeople.dialogVisible = true
    },
  },
}
</script>

<style></style>
