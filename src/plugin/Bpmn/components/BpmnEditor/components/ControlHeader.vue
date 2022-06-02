<template>
  <div>
    <el-button-group>
      <el-button icon="el-icon-folder-opened"
                 type="primary"
                 :size="buttonSize"
                 @click="openFile">打开文件</el-button>
      <el-tooltip effect="light">
        <el-button type="primary"
                   icon="el-icon-download"
                   :size="buttonSize">下载文件</el-button>
        <div slot="content"
             class="tooltip-content">
          <el-button :size="buttonSize"
                     type="text"
                     @click="downloadAs('xml')">下载为XML文件</el-button>
          <el-button :size="buttonSize"
                     type="text"
                     @click="downloadAs('svg')">下载为SVG文件</el-button>
          <el-button :size="buttonSize"
                     type="text"
                     @click="downloadAs('bpmn')">下载为BPMN文件</el-button>
        </div>
      </el-tooltip>
      <el-tooltip effect="light">
        <el-button type="primary"
                   icon="el-icon-view"
                   :size="buttonSize">预览</el-button>
        <div slot="content"
             class="tooltip-content">
          <el-button :size="buttonSize"
                     type="text"
                     @click="previewAs('xml')">预览XML</el-button>
          <br />
          <el-button :size="buttonSize"
                     type="text"
                     @click="previewAs('json')">预览JSON</el-button>
        </div>
      </el-tooltip>
    </el-button-group>
    <el-button-group>
      <el-button :size="buttonSize"
                 :disabled="defaultZoom < 0.2"
                 icon="el-icon-zoom-out"
                 @click="canvasZoomOut" />
      <el-button :size="buttonSize">{{ zoomRatio }}</el-button>
      <el-button :size="buttonSize"
                 :disabled="defaultZoom > 4"
                 icon="el-icon-zoom-in"
                 @click="canvasZoomIn" />
      <el-button :size="buttonSize"
                 icon="el-icon-c-scale-to-original"
                 @click="canvasResetZoom" />
    </el-button-group>
    <el-button-group>
      <el-tooltip effect="light"
                  content="撤销">
        <el-button :size="buttonSize"
                   :disabled="!undoable"
                   icon="el-icon-refresh-left"
                   @click="operationUndo" />
      </el-tooltip>
      <el-tooltip effect="light"
                  content="恢复">
        <el-button :size="buttonSize"
                   :disabled="!redoable"
                   icon="el-icon-refresh-right"
                   @click="operationRedo" />
      </el-tooltip>
      <el-tooltip effect="light"
                  content="重新绘制">
        <el-button :size="buttonSize"
                   icon="el-icon-refresh"
                   @click="repaint" />
      </el-tooltip>
    </el-button-group>
    <el-dialog title="预览"
               width="60%"
               :visible.sync="previewModal.visible"
               append-to-body
               destroy-on-close>
      <highlightjs :language="previewModal.type"
                   :code="previewModal.code" />
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { readFile, selectFile, downloadFile } from '../../../utils/file'
import { curryFunction } from '../../../utils/function'

export default {
  name: 'controlHeader',
  data() {
    return {
      buttonSize: 'small',
      defaultZoom: 1,
      zoomStep: 0.1,
      maxZoom: 4,
      minZoom: 0.4,
      previewModal: {
        visible: false,
        language: '',
        code: '',
      },
    }
  },
  computed: {
    zoomRatio() {
      return Math.floor(this.defaultZoom * 10 * 10) + '%'
    },
    ...mapState('bpmn/editor', ['undoable', 'redoable']),
  },
  methods: {
    async openFile() {
      try {
        const files = await selectFile(['.xml', '.bpmn'])
        const content = await readFile((reader) => reader.readAsText(files[0]))
        this.$iBpmn.loadDiagram(content)
      } catch (error) {
        this.$message.error('文件打开失败')
      }
    },
    async downloadAs(fileType) {
      try {
        const fileName = 'test'
        const download = curryFunction(downloadFile)(fileName, fileType)
        if (['xml', 'bpmn'].includes(fileType)) {
          const { xml } = await this.$iBpmn.saveXML()
          download(xml)
        } else if ('svg' === fileType) {
          const { svg } = await this.$iBpmn.saveSVG()
          download(svg)
        }
      } catch (error) {
        this.$message.error('下载失败')
      }
    },
    async previewAs(type) {
      try {
        if ('xml' === type) {
          const { xml } = await this.$iBpmn.saveXML({ format: true })
          this.previewModal.code = xml
        } else if ('json' === type) {
          const { json } = await this.$iBpmn.saveJSON({ format: true })
          this.previewModal.code = json
        }
        this.previewModal.language = type
        this.previewModal.visible = true
      } catch (error) {
        this.$message.error('文档解析失败')
      }
    },
    canvasZoomOut() {
      const newZoom =
        Math.floor(this.defaultZoom * 100 - this.zoomStep * 100) / 100
      if (newZoom <= this.minZoom) {
        this.$message.warning('已经到最小比例')
        return
      }
      this.defaultZoom = newZoom
      this.$iBpmn.canvasZoom(this.defaultZoom)
    },
    canvasZoomIn() {
      const newZoom =
        Math.floor(this.defaultZoom * 100 + this.zoomStep * 100) / 100
      if (newZoom >= this.maxZoom) {
        this.$message.warning('已经到最大比例')
        return
      }
      this.defaultZoom = newZoom
      this.$iBpmn.canvasZoom(this.defaultZoom)
    },
    canvasResetZoom() {
      this.defaultZoom = 1
      this.$iBpmn.canvasZoom('fit-viewport', 'auto')
    },
    operationUndo() {
      this.$iBpmn.commandUndo()
    },
    operationRedo() {
      this.$iBpmn.commandRedo()
    },
    repaint() {
      this.$iBpmn.repaint()
    },
  },
}
</script>

<style scoped>
.tooltip-content {
  display: flex;
  flex-direction: column;
}
</style>