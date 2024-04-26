<template>
  <div class="wrapper">
    <div class="toCenter" @click="handleToCenter">居中</div>
    <div class="containers" ref="containers" v-if="visible"></div>
  </div>
</template>

<script>
import IBpmnViewer from '../../IBpmnViewer';

export default {
  name: 'BpmnViewer',
  props: {
    visible: {
      type: Boolean,
      default: true,
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
    };
    return {
      iBpmnViewer: new IBpmnViewer({ ...defaultProp, ...this.prop }),
    };
  },
  watch: {
    xml: {
      immediate: true,
      handler(value) {
        if (!value || !String.prototype.trim.call(value)) {
          return;
        }
        const loading = this.$loading({
          lock: true,
          text: '加载中...',
          spinner: 'el-icon-loading',
        });
        this.iBpmnViewer.loadDiagram(value).then(() => {
          loading.close();
          this.onLoaded();
        });
      },
    },
    visible: {
      immediate: true,
      handler(val) {
        if (val) this.onLoaded();
        this.$nextTick(() => {
          if (this.$refs.containers) {
            this.iBpmnViewer.detach();
            this.iBpmnViewer.attachTo(this.$refs.containers);
            setTimeout(() => {
              this.iBpmnViewer.canvasZoom('fit-viewport', 'auto');
            });
          }
        });
      },
    },
  },
  mounted() {
    this.initBpmn();
  },
  methods: {
    initBpmn() {
      this.iBpmnViewer.on('selection.changed', () => {
        this.selectedChanged(
          this.iBpmnViewer.getSelectedShape(),
          this.iBpmnViewer
        );
      });
    },
    onLoaded() {
      this.$emit('loaded', this.iBpmnViewer);
    },
    handleToCenter() {
      this.$nextTick(() => {
        this.iBpmnViewer.canvasZoom('fit-viewport', 'auto');
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import './index.scss';

.wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}
.containers {
  background-color: rgb(27, 30, 45);
  width: 100%;
  height: 100%;
}

.toCenter {
  position: absolute;
  top: 10px;
  right: 20px;
  cursor: pointer;
  border: 1px solid #009efb;
  border-radius: 4px;
  width: 80px;
  text-align: center;
  padding: 5px 10px;
  z-index: 2999;
  color: #009efb;

  &:hover {
    background: #009efb90;
    border-color: #009efb90;
    color: #fff;
  }
}
</style>
