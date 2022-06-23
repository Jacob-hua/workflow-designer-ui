<template>
  <div style="margin-top: 15px">
    <div class="peopleList-title">加签:</div>
    <div class="peopleList">
      <div class="peopleList-item" v-for="({ userId }, index) in signature" :key="index">
        {{ userId }}
      </div>
    </div>
    <span class="editButton" @click="editDataList('Signature')">编辑</span>
  </div>
</template>

<script>
export default {
  name: 'RuntimeImplementSignature',
  props: {
    workflow: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    signature() {
      return this.workflow.signature ?? []
    },
  },
  methods: {
    editDataList(value) {
      this.$refs.runtimePeople.multipleSelection = JSON.parse(JSON.stringify(this.dataList[value]))
      this.$refs.runtimePeople.detailSelection = JSON.parse(JSON.stringify(this.dataList[value]))
      this.$refs.runtimePeople.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.runtimePeople.toggleRowSelection()
      })
    },
  },
}
</script>

<style></style>
