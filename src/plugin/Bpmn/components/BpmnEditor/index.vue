<template>
  <div class="wrapper">
    <control-header
      v-if="headerVisible"
      :iBpmnModeler="iBpmnModeler"
      :namespace="namespace"
      :generateIdFunc="generateIdFunc"
    />
    <div class="containers" ref="containers"></div>
  </div>
</template>

<script>
import ControlHeader from './components/ControlHeader.vue'
import bridgingBpmn, { generateNamespace } from '../../utils/bridging-bpmn'
import bridgingModuleFunc from './store'
import IBpmnModeler from '../../IBpmnModeler'

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
      default: () => {},
    },
    generateIdFunc: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    const defaultProp = {
      id: this._uid,
      type: 'camunda',
      lintActive: true,
    }
    const iBpmnModeler = new IBpmnModeler({ ...defaultProp, ...this.prop })
    const namespace = generateNamespace(this)
    const unBridgingFunc = bridgingBpmn(this.$store, namespace, iBpmnModeler, bridgingModuleFunc)
    return {
      namespace,
      iBpmnModeler,
      unBridgingFunc,
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
      this.iBpmnModeler.paletteVisible(value)
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
        this.iBpmnModeler.loadDiagram(value, this.newBaseInfo).then(() => {
          loading.close()
          this.onLoaded()
        })
      },
    },
    linterToggle: {
      immediate: true,
      handler(value) {
        this.iBpmnModeler.linterToggle(value)
      },
    },
  },
  mounted() {
    this.initBpmn()
  },
  beforeUpdate() {
    this.namespace = generateNamespace(this)
  },
  beforeDestroy() {
    this.unBridgingFunc()
  },
  methods: {
    initBpmn() {
      this.iBpmnModeler.attachTo(this.$refs.containers)
      this.iBpmnModeler.paletteVisible(this.pelatteVisible)
      if (!this.xml) {
        this.iBpmnModeler.createEmptyDiagram(this.name, this.newBaseInfo).then(() => {
          this.onLoaded()
        })
      }
      this.iBpmnModeler.on('selection.changed', () => {
        this.selectedChanged(this.iBpmnModeler.getSelectedShape())
      })
    },
    onLoaded() {
      this.$emit('loaded', this.iBpmnModeler)
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
  background-color: #ffffff;
  width: 100%;
  height: 100%;
}
</style>
