<template>
  <div class="wrapper">
    <control-header />
    <div class="containers"
         ref="containers"></div>
  </div>
</template>

<script>
import ControlHeader from './components/ControlHeader.vue'

export default {
  name: 'BpmnEditor',
  components: { ControlHeader },
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
.wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
}
.containers {
  background-color: #ffffff;
  width: 100%;
  height: 100%;
}
</style>
