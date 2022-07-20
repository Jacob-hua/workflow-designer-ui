<template>
  <div class="container">
    <h1 style="color: red">{{ xml }}</h1>
    <!-- <bpmn-viewer
      :xml="xml"
      :prop="{
        bpmnRenderer: {
          defaultFillColor: 'none',
          defaultStrokeColor: '#666666',
          defaultLabelColor: '#666666',
        },
      }"
    /> -->
  </div>
</template>

<script>
export default {
  name: 'WorkflowViewer',
  data() {
    return {
      xml: 'xml',
    }
  },
  mounted() {
    window.refreshCanvas = (xml) => {
      this.xml = xml
    }
  },
}
</script>

<style scoped lang="scss">
.container {
  height: 100%;
}
</style>
