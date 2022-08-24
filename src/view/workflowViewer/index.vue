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

function base64ToArrayBuffer(base64) {
  var binaryStr = window.atob(base64)
  var len = binaryStr.length
  var bytes = new Uint8Array(len)
  for (var i = 0; i < len; i++) {
    bytes[i] = binaryStr.charCodeAt(i)
  }
  return bytes.buffer
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
      new Blob([base64ToArrayBuffer(xml)]).text().then((res) => {
        this.xml = res
      })
    }
  },
}
</script>

<style scoped lang="scss">
.container {
  height: 100%;
}
</style>
