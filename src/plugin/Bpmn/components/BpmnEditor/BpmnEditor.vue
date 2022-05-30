<template>
  <div class="containers"
       ref="containers">
  </div>
</template>

<script>
export default {
  name: 'bpmnEditor',
  props: {
    pelatteVisiable: {
      type: Boolean,
      default: true,
    },
  },
  data: () => {
    return {
      canvas: null,
    }
  },
  mounted() {
    this.initBpmn()
  },
  methods: {
    initBpmn() {
      this.$iBpmn.attachTo(this.$refs.containers)
      this.$iBpmn.createEmptyDiagram()
      this.$iBpmn.paletteVisible(this.pelatteVisiable)
    },
  },
}
</script>

<style scoped>
.containers {
  background-color: #ffffff;
  width: 100%;
  height: 100%;
}
.panel {
  position: absolute;
  right: 0;
  top: 0;
  width: 300px;
}
</style>
