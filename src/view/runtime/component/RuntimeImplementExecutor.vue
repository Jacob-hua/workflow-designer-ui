<template>
  <div>
    <div v-if="executors.length == 0">
      <span style="color: #0066cc">后续任务未指定执行人，请选择执行人</span>
      <div class="confirm" @click="onConfirmation">选择执行人</div>
    </div>
    <div v-else>
      <div class="peopleList-item" v-for="{ userId } in executors" :key="userId">
        {{ userId }}
      </div>
      <span class="addCirculate" @click="onEditExecutor"> 编辑 </span>
    </div>
    <runtime-people ref="runtimePeople" @submit="onRuntimePeopleSubmit" />
  </div>
</template>

<script>
import runtimePeople from './runtimePeople.vue'

export default {
  name: 'RuntimeImplementExecutor',
  components: { runtimePeople },
  props: {
    workflow: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    executors() {
      return this.workflow?.executors ?? []
    }
  },
  methods: {
    onConfirmation() {
      this.$refs.runtimePeople.dialogVisible = true
    },
    onEditExecutor() {
      this.$refs.runtimePeople.dialogVisible = true
      this.$refs.runtimePeople.detailSelection = this.executors
      this.$nextTick(() => {
        this.$refs.runtimePeople.toggleRowSelection()
      })
    },
    onRuntimePeopleSubmit({ multipleSelection }) {
      this.$emit('selectExecutor', multipleSelection)
      this.$refs.runtimePeople.dialogVisible = false
    },
  },
}
</script>

<style></style>
