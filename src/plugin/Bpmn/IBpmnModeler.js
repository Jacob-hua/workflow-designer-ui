import BpmnModeler from 'bpmn-js/lib/Modeler'
import lintModule from 'bpmn-js-bpmnlint'
import X2JS from 'x2js'
import bpmnlintConfig from './.bpmnlintrc'
import customTranslate from './utils/customTranslate'
import { filterPublicFunction } from './utils/function'

import zh from './i18n/zh'
import defaultEmpty from './utils/defaultEmpty'

import config from './config'
import { getShapeType } from './enum/shapeType'
import custom from './custom'
import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil'

// bpmn左侧工具栏样式
import 'bpmn-js/dist/assets/diagram-js.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css'

// bpmn lint css
import 'bpmn-js-bpmnlint/dist/assets/css/bpmn-js-bpmnlint.css'

function functionMapping(target, sources, modulesConfig = {}) {
  for (const module of Object.keys(modulesConfig)) {
    const methods = filterPublicFunction(sources.get(module), modulesConfig[module]?.prefix)
    target = Object.assign(target, methods)
  }
}

const defaultIBpmnProps = {
  type: 'camunda',
  lintActive: true,
  i18n: zh,
  id: Date.now().toString(),
  bpmnRenderer: {
    defaultFillColor: 'white',
    defaultStrokeColor: 'black',
    defaultLabelColor: 'black',
  },
}

class IBpmnModeler {
  #modeler = {}
  #id = ''

  constructor(props = {}) {
    props = { ...defaultIBpmnProps, ...props }
    this.#id = props.id
    this.type = props.type
    this.lintActive = props.lintActive
    this.i18n = props.i18n

    this.#modeler = new BpmnModeler({
      bpmnRenderer: {
        ...props.bpmnRenderer,
      },
      additionalModules: [
        custom,
        lintModule,
        {
          translate: ['value', customTranslate(this.i18n)],
        },
      ],
      moddleExtensions: config.extensions[this.type],
      linting: {
        bpmnlint: bpmnlintConfig,
      },
    })

    functionMapping(this, this.#modeler, config.bpmnModuleConfig)

    this.linterToggle(this.lintActive)
    this.#getModule('linting')._button.style = 'pointer-events: none'
  }

  get id() {
    return this.#id
  }

  #getModule(module) {
    return this.#modeler.get(module)
  }

  attachTo(element) {
    this.#modeler.attachTo(element)
  }

  detach() {
    this.#modeler.detach()
  }

  repaint() {
    this.createEmptyDiagram()
    this.commandClear()
  }

  clear() {
    this.#modeler.clear()
  }

  getSelectedShape() {
    const shapes = this.selectionGet() ?? []
    if (shapes[0]) {
      return shapes[0]
    }
    return null
  }

  getSelectedShapeInfo() {
    return this.getSelectedShape()?.businessObject ?? {}
  }

  getSelectedShapeType() {
    return this.getShapeType(this.getSelectedShape())
  }

  getSelectedShapeInfoByDefaultLocalName(localName) {
    return this.getSelectedShapeInfoByType(`${this.type}:${localName}`)
  }

  getSelectedShapeInfoByLocalName(localName) {
    return this.getSelectedShapeInfoByType(`bpmn:${localName}`)
  }

  getSelectedShapeInfoByType(type) {
    return this.getShapeInfoByType(this.getSelectedShape(), type)
  }

  getRootShapeInfo() {
    const root = this.elementRegistryFind((elem) => elem.type === 'bpmn:Process')
    if (!root) {
      return {}
    }
    return this.getShapeInfo(root)
  }

  getShapeInfoByDefaultLocalName(element, localName) {
    return this.getShapeInfoByType(element, `${this.type}:${localName}`)
  }

  getShapeInfoByLocalName(element, localName) {
    this.getShapeInfoByType(element, `bpmn:${localName}`)
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

  getShapeInfo(element) {
    return element.businessObject ?? {}
  }

  getShapeType(element) {
    const shapeInfo = this.getShapeInfo(element)
    let tag = shapeInfo.$type
    if (Array.isArray(shapeInfo.eventDefinitions) && shapeInfo.eventDefinitions.length > 0) {
      tag = `${tag}_${shapeInfo.eventDefinitions[0].$type}`
      if (Object.keys(shapeInfo).includes('cancelActivity') && !shapeInfo.cancelActivity) {
        tag = `${tag}_false`
      }
    }
    return getShapeType(tag)
  }

  getSelectedShapeExtensions() {
    return this.getShapeExtensions(this.getSelectedShape())
  }

  getShapeExtensions(shape) {
    if (!shape) {
      return []
    }
    return this.getShapeInfoByType(shape, 'bpmn:ExtensionElements')?.values ?? [] 
  }

  updateSelectedShapeExtensions(extensions = []) {
    if (!this.getSelectedShape()) {
      return
    }
    this.updateShapeExtensions(this.getSelectedShape(), extensions)
  }

  updateShapeExtensions(shape, extensions) {
    const extensionElements = this.#getModule('moddle').create('bpmn:ExtensionElements', {
      values: extensions,
    })
    this.updateShapeProperties(shape, {
      extensionElements,
    })
  }

  updateSelectedShapeProperties(payload = {}) {
    if (!this.getSelectedShape()) {
      const root = this.elementRegistryFind((elem) => elem.type === 'bpmn:Process')
      this.updateShapeProperties(root, payload)
      return
    }
    this.updateShapeProperties(this.getSelectedShape(), payload)
  }

  updateRootShapeProperties(payload = {}) {
    const root = this.elementRegistryFind((elem) => elem.type === 'bpmn:Process')
    this.updateShapeProperties(root, payload)
    this.fire('rootShape.changed', { element: root })
  }

  updateShapeProperties(shape, payload = {}) {
    if (!shape) {
      return
    }
    this.modelingUpdateProperties(shape, payload)
  }

  updateSelectedShapeModdleProperties(moddleElement, payload = {}) {
    if (!this.getSelectedShape() || !moddleElement) {
      return
    }
    this.updateShapeModdleProperties(this.getSelectedShape(), moddleElement, payload)
  }

  updateShapeModdleProperties(shape, moddleElement, payload = {}) {
    this.modelingUpdateModdleProperties(shape, moddleElement, payload)
  }

  paletteVisible(visable) {
    this.#getModule('palette')._container.style = visable ? '' : 'display: none'
  }

  createBpmnModdleInstance(localName, attrs) {
    return this.createModdleInstance(`bpmn:${localName}`, attrs)
  }

  createDefaultModdleInstance(localName, attrs) {
    return this.createModdleInstance(`${this.type}:${localName}`, attrs)
  }

  createModdleInstance(descriptor, attrs) {
    return this.#getModule('moddle').create(descriptor, attrs)
  }

  async validate() {
    const valid = await this.linterLint()

    const validInfo = Object.keys(valid).reduce(reduceValidInfo, { error: [], warn: [] })

    return validInfo

    function reduceValidInfo(validInfo, key) {
      if (!Array.isArray(valid[key])) {
        validInfo.error.push(valid[key])
        return validInfo
      }

      const categoryHandle = {
        error: validInfo.error,
        warning: validInfo.warn,
        warn: validInfo.warn,
      }

      valid[key].forEach(({ category, id, message }) => {
        categoryHandle[category] &&
          categoryHandle[category].push({
            key,
            id,
            message,
            category,
          })
      })
      return validInfo
    }
  }

  async createEmptyDiagram(name = new Date().getTime(), properties) {
    this.loadDiagram(defaultEmpty(`process_${new Date().getTime()}`, name, this.type), properties)
  }

  async loadDiagram(xml, properties) {
    try {
      const { warnings } = await this.#modeler.importXML(xml)
      if (warnings && warnings.length) {
        warnings.forEach(console.warn)
      }
      if (properties) {
        this.updateRootShapeProperties(properties)
      }
      this.canvasZoom('fit-viewport', 'auto')
    } catch (e) {
      console.error(`[Process Designer Warn]: ${e?.message || e}`)
    }
  }

  async saveSVG(args) {
    return this.#modeler.saveSVG(args)
  }

  async saveXML(args) {
    return this.#modeler.saveXML(args)
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

export default IBpmnModeler
