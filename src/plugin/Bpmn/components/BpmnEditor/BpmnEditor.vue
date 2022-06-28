<template>
  <div class="wrapper">
    <control-header v-if="headerVisible" />
    <div class="containers" ref="containers"></div>
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
      default: () => new Date().getTime().toString(),
    },
    id: {
      type: String,
      default: () => `process_${new Date().getTime().toString()}`,
    },
    xml: {
      type: String,
    },
    selectedChanged: {
      type: Function,
      default: () => () => {},
    },
  },
  computed: {
    newBaseInfo() {
      return {
        name: this.name,
        id: this.id,
      }
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
        const loading = this.$loading({
          lock: true,
          text: '加载中...',
          spinner: 'el-icon-loading',
        })
        this.$iBpmn.loadDiagram(value, this.newBaseInfo).then(() => {
          loading.close()
          this.$emit('loaded')
        })
      },
    },
    linterToggle: {
      immediate: true,
      handler(value) {
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
        this.$iBpmn.createEmptyDiagram(this.name, this.newBaseInfo)
      }
      this.$iBpmn.on('selection.changed', () => {
        this.selectedChanged(this.$iBpmn.getSelectedShape())
      })
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
