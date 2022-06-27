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
    <runtime-people
      :visible.sync="runtimePeopleVisible"
      :selected="runtimePeopleSelected"
      @submit="onRuntimePeopleSubmit"
      :isRadio="true"
    />
  </div>
</template>

<script>
import RuntimePeople from './RuntimePeople.vue'

export default {
  name: 'RuntimeImplementExecutor',
  components: { RuntimePeople },
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
    }
  },
  computed: {
    executors() {
      return this.workflow?.executors ?? []
    },
  },
  methods: {
    onConfirmation() {
      this.runtimePeopleVisible = true
    },
    onEditExecutor() {
      this.runtimePeopleVisible = true
      this.runtimePeopleSelected = this.executors
    },
    onRuntimePeopleSubmit({ selections }) {
      this.$emit('selectExecutor', selections)
    },
  },
}
</script>

<style></style>
