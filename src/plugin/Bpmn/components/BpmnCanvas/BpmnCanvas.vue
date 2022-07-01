<template>
  <div class="wrapper">
    <div class="containers" ref="containers"></div>
  </div>
</template>

<script>
import IBpmn from '../../iBpmn'

export default {
  name: 'BpmnCanvas',
  props: {
    pelatteVisible: {
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
    prop: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    const defaultProp = {
      type: 'camunda',
      lintActive: true,
    }
    return {
      iBpmn: new IBpmn({ ...defaultProp, ...this.prop }),
    }
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
      this.iBpmn.paletteVisible(value)
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
        this.iBpmn.loadDiagram(value, this.newBaseInfo).then(() => {
          loading.close()
          this.onLoaded()
        })
      },
    },
    linterToggle: {
      immediate: true,
      handler(value) {
        this.iBpmn.linterToggle(value)
      },
    },
  },
  mounted() {
    this.initBpmn()
  },
  methods: {
    initBpmn() {
      this.iBpmn.attachTo(this.$refs.containers)
      if (!this.xml) {
        this.iBpmn.createEmptyDiagram(this.name, this.newBaseInfo).then(() => {
          this.onLoaded()
        })
      }
      this.iBpmn.on('selection.changed', () => {
        this.selectedChanged(this.iBpmn.getSelectedShape())
      })
    },
    onLoaded() {
      this.$emit('loaded', this.iBpmn)
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
