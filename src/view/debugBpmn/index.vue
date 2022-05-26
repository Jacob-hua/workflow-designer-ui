<template>
  <div class="wrapper">
    <bpmn-editor />
    <bpmn-properties-panel />
    <button @click="onSubmit">提交</button>
  </div>
</template>

<script>
export default {
  name: 'debugBpmn',
}
</script>

<style>
.wrapper {
  width: 100%;
  height: 90%;
  overflow: hidden;
  display: flex;
  flex-direction: row;
}
</style>