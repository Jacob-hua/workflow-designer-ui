<template>
  <div class="wrapper">
    <div class="containers" ref="containers"></div>
  </div>
</template>

<script>
import IBpmnViewer from '../../IBpmnViewer'

export default {
  name: 'BpmnViewer',
  props: {
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
      iBpmnViewer: new IBpmnViewer({ ...defaultProp, ...this.prop }),
    }
  },
  watch: {
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
        this.iBpmnViewer.loadDiagram(value).then(() => {
          loading.close()
          this.onLoaded()
        })
      },
    },
  },
  mounted() {
    this.initBpmn()
  },
  methods: {
    initBpmn() {
      this.iBpmnViewer.attachTo(this.$refs.containers)
      this.iBpmnViewer.on('selection.changed', () => {
        this.selectedChanged(this.iBpmnViewer.getSelectedShape(), this.iBpmnViewer)
      })
    },
    onLoaded() {
      this.$emit('loaded', this.iBpmnViewer)
    },
  },
}
</script>

<style lang="scss" scoped>
@import './index.scss';

.wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.containers {
  background-color: transparent;
  width: 100%;
  height: 100%;
}
</style>
