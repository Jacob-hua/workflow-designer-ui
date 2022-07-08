<template>
  <div>
    <div class="container">
      <div class="content">
        <div class="empty" v-if="executors.length == 0">
          <span>后续任务未指定执行人，请选择执行人</span>
          <el-button @click="onConfirmation">选择执行人</el-button>
        </div>
        <div class="info" v-else>
          <div>
            <div class="user" v-for="{ userId } in executors" :key="userId">
              {{ userId }}
            </div>
          </div>
          <el-button @click="onEditExecutor"> 编辑 </el-button>
        </div>
      </div>
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

<style scoped lang="scss">
@import '../index.scss';

@include container;

@include userContent;
</style>
