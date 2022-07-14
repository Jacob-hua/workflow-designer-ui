<template>
  <div>
    <element-user-task-form v-bind="$attrs" />
  </div>
</template>

<script>
import ElementUserTaskForm from './ElementUserTaskForm.vue'

export default {
  name: 'ElementTaskPanel',
  components: { ElementUserTaskForm },
}
</script>

<style></style>
