<template>
  <div class="wrapper">
    <control-header v-if="headerVisible" />
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
    pelatteVisible: {
      type: Boolean,
      default: true,
    },
    headerVisible: {
      type: Boolean,
      default: true,
    },
    linterToggle: {
      type: Boolean,
      default: true,
    },
    name: {
      type: String,
    },
    xml: {
      type: String,
    },
  },
  watch: {
    pelatteVisible(value) {
      this.$iBpmn.paletteVisible(value)
    },
    xml: {
      immediate: true,
      handler(value) {
        if (!value || !String.prototype.trim.call(value)) {
          return
        }
        this.$iBpmn.loadDiagram(value)
      },
    },
    linterToggle: {
      immediate: true,
      handler(value) {
        console.log(this.$iBpmn, value);
        this.$iBpmn.linterToggle(value)
      },
    },
  },
  mounted() {
    this.initBpmn()
  },
  methods: {
    initBpmn() {
      this.$iBpmn.attachTo(this.$refs.containers)
      this.$iBpmn.paletteVisible(this.pelatteVisible)
      if (!this.xml) {
        this.$iBpmn.createEmptyDiagram(this.name)
      }
    },
  },
}
</script>

<style scoped>
.wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.containers {
  background-color: #ffffff;
  width: 100%;
  height: 100%;
}
</style>
