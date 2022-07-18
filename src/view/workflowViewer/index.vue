<template>
  <div class="container">
    <bpmn-viewer
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
import { postProcessResource } from '../../api/unit/api'

export default {
  name: 'WorkflowViewer',
  data() {
    return {
      xml: '',
    }
  },
  mounted() {
    const req = new XMLHttpRequest()
    req.open('GET', document.location, false)
    req.send(null)
    this.fetchProcessResource(req.getAllResponseHeaders())
  },
  methods: {
    async fetchProcessResource(header) {
      try {
        const { errorInfo, result } = await postProcessResource({
          processInstanceId: this.$route.params.processInstanceId,
        })
        if (errorInfo.errorCode) {
          this.$message.error(errorInfo.errorMsg)
          return
        }
        this.xml = result
      } catch (error) {}
    },
  },
}
</script>

<style scoped lang="scss">
.container {
  height: 100%;
}
</style>
