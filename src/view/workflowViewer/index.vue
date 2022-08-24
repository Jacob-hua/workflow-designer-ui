<template>
  <div class="container">
    <bpmn-viewer
      v-if="xml"
      :xml="xml"
      :prop="{
        bpmnRenderer: {
          defaultFillColor: 'none',
          defaultStrokeColor: '#666666',
          defaultLabelColor: '#666666',
        },
      }"
    />
  </div>
</template>

<script>
function isBase64(str) {
  if (str === '' || str.trim() === '') {
    return false
  }
  try {
    return window.btoa(window.atob(str)) === str
  } catch (error) {
    return false
  }
}

export default {
  name: 'WorkflowViewer',
  data() {
    return {
      xml: '',
    }
  },
  mounted() {
    window.refreshCanvas = (xml) => {
      if (!isBase64(xml)) {
        return
      }
      this.xml = window.atob(xml)
    }
  },
}
</script>

<style scoped lang="scss">
.container {
  height: 100%;
}
</style>
