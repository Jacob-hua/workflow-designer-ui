import BpmnViewer from 'bpmn-js/lib/NavigatedViewer'
import ImportModule from 'bpmn-js/lib/import'
import ElementRegistry from 'diagram-js/lib/core/ElementRegistry'
import X2JS from 'x2js'
import { filterPublicFunction } from './utils/function'
import { getShapType } from './enum/shapeType'

import config from './config'
import custom from './custom'
import zh from './i18n/zh'

function functionMapping(target, sources, modulesConfig = {}) {
  for (const module of Object.keys(modulesConfig)) {
    const methods = filterPublicFunction(sources.get(module), modulesConfig[module]?.prefix)
    target = Object.assign(target, methods)
  }
}

const defaultIBpmnViewerProps = {
  type: 'camunda',
  i18n: zh,
  id: Date.now().toString(),
}

class IBpmnViewer {
  #viewer = {}
  #id = ''

  constructor(props = {}) {
    props = { ...defaultIBpmnViewerProps, ...props }
    this.#id = props.id
    this.type = props.type
    this.i18n = props.i18n

    this.#viewer = new BpmnViewer({
      additionalModules: [custom, ImportModule, ElementRegistry],
      moddleExtensions: config.extensions[this.type],
    })

    functionMapping(this, this.#viewer, config.bpmnViewerModuleConfig)
  }

  get id() {
    return this.#id
  }

  attachTo(element) {
    this.#viewer.attachTo(element)
  }

  detach() {
    this.#viewer.detach()
  }

  getSelectedShape() {
    const shapes = this.selectionGet() ?? []
    return shapes[0] ?? null
  }

  getSelectedShapeType() {
    return this.getShapeType(this.getSelectedShape())
  }

  getShapeInfo(element) {
    return element.businessObject ?? {}
  }

  getShapeInfoByType(element, type) {
    const shapeProperties = this.getShapeInfo(element)
    if (shapeProperties.$type === type) {
      return shapeProperties
    }
    if (shapeProperties[type]) {
      return shapeProperties[type]
    }
    const extensionElements = shapeProperties.extensionElements
    if (!extensionElements) {
      return
    }
    if (extensionElements.$type === type) {
      return extensionElements
    }
    if (Array.isArray(extensionElements.values) && extensionElements.values.length > 0) {
      return extensionElements.values.filter(({ $type }) => $type === type)
    }
    return
  }

  getShapeType(element) {
    const { $type, eventDefinitions = [] } = this.getShapeInfo(element)
    return getShapType(eventDefinitions[0] ? `${$type}_${eventDefinitions[0].$type}` : `${$type}`)
  }

  async loadDiagram(xml) {
    try {
      const { warnings } = await this.#viewer.importXML(xml)
      if (warnings && warnings.length) {
        warnings.forEach(console.warn)
      }
      this.canvasZoom('fit-viewport', 'auto')
    } catch (e) {
      console.error(`[Process Designer Warn]: ${e?.message || e}`)
    }
  }

  async saveSVG(args) {
    return this.#viewer.saveSVG(args)
  }

  async saveXML(args) {
    return this.#viewer.saveXML(args)
  }

  async saveJSON(args) {
    const { xml } = await this.saveXML(args)
    const x2js = new X2JS()
    let { definitions: json } = x2js.xml2js(xml)
    if (args.format) {
      json = JSON.stringify(json, null, 2)
    }
    return { json }
  }
}

export default IBpmnViewer
