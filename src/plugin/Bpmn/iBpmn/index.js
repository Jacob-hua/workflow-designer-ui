import BpmnModeler from "bpmn-js/lib/Modeler";
import lintModule from "bpmn-js-bpmnlint";
import X2JS from "x2js";
import bpmnlintConfig from "./.bpmnlintrc";
import customTranslate from "./utils/customTranslate";
import { filterPublicFunction } from "./utils/function";

import zh from "./i18n/zh";
import defaultEmpty from "./utils/defaultEmpty";

import config from "./config";

// bpmn左侧工具栏样式
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";

// bpmn lint css
import "bpmn-js-bpmnlint/dist/assets/css/bpmn-js-bpmnlint.css";

function functionMapping(target, sources, modulesConfig = {}) {
  let newPrototype = Object.getPrototypeOf(target);
  for (const module of Object.keys(modulesConfig)) {
    const methods = filterPublicFunction(sources.get(module), modulesConfig[module]?.prefix);
    newPrototype = Object.assign(newPrototype, methods);
  }
  Object.setPrototypeOf(target, newPrototype);
}

const defaultIBpmnProps = {
  type: "camunda",
  lintActive: true,
  i18n: zh,
};

class IBpmn {
  #modeler = {};

  constructor(props = {}) {
    props = { ...defaultIBpmnProps, ...props };
    this.type = props.type;
    this.lintActive = props.lintActive;
    this.i18n = props.i18n;

    this.#modeler = new BpmnModeler({
      additionalModules: [
        lintModule,
        {
          translate: ["value", customTranslate(this.i18n)],
        },
      ],
      moddleExtensions: config.extensions[this.type],
      linting: {
        bpmnlint: bpmnlintConfig,
      },
    });

    functionMapping(this, this.#modeler, config.moduleConfig);

    this.linterToggle(this.lintActive);
    this.#getModule("linting")._button.style = "pointer-events: none";
  }

  #getModule(module) {
    return this.#modeler.get(module);
  }

  attachTo(element) {
    /**
     * TODO: 这里存在一个大的BUG，由于在vue中$iBpmn实例始终只有一个，那么attachTo之前被挂载到一个DOM之后，
     * 再次调用attachTo会从原来挂载的DOM上摘掉svg元素，挂载到新的DOM节点上
     * 对于vue中同时存在多个画布组件的场景这是一个致命的问题，即一个组件销毁时，另一个组件虽然没有被注销
     * 但是组件上挂载的svg却被移除了
     */
    this.#modeler.attachTo(element);
  }

  detach() {
    this.#modeler.detach();
  }

  repaint() {
    this.createEmptyDiagram();
    this.commandClear();
  }

  clear() {
    this.#modeler.clear();
  }

  getSelectedShape() {
    const shapes = this.selectionGet() ?? [];
    if (shapes[0]) {
      return shapes[0];
    }
    return null;
  }

  getSelectedShapeInfo() {
    return this.getSelectedShape()?.businessObject ?? {};
  }

  getSelectedShapeType() {
    if (this.getSelectedShapeInfo().$type) {
      const [namespace, type] = this.getSelectedShapeInfo().$type.split(":");
      return {
        namespace,
        type,
      };
    }
    return {
      namespace: null,
      type: null,
    };
  }

  getSelectedShapeInfoByDefaultLocalName(localName) {
    return this.getSelectedShapeInfoByType(`${this.type}:${localName}`);
  }

  getSelectedShapeInfoByLocalName(localName) {
    return this.getSelectedShapeInfoByType(`bpmn:${localName}`);
  }

  getSelectedShapeInfoByType(type) {
    return this.getShapeInfoByType(this.getSelectedShape(), type);
  }

  getRootShapeInfo() {
    const root = this.elementRegistryFind((elem) => elem.type === "bpmn:Process");
    if (!root) {
      return {};
    }
    return this.getShapeInfo(root);
  }

  getShapeInfoByDefaultLocalName(element, localName) {
    return this.getShapeInfoByType(element, `${this.type}:${localName}`);
  }

  getShapeInfoByLocalName(element, localName) {
    this.getShapeInfoByType(element, `bpmn:${localName}`);
  }

  getShapeInfoByType(element, type) {
    const shapeProperties = this.getShapeInfo(element);
    if (shapeProperties.$type === type) {
      return shapeProperties;
    }
    if (shapeProperties[type]) {
      return shapeProperties[type];
    }
    const extensionElements = shapeProperties.extensionElements;
    if (!extensionElements) {
      return;
    }
    if (extensionElements.$type === type) {
      return extensionElements;
    }
    if (Array.isArray(extensionElements.values) && extensionElements.values.length > 0) {
      return extensionElements.values.filter(({ $type }) => $type === type);
    }
    return;
  }

  getShapeInfo(element) {
    return element.businessObject ?? {};
  }

  getShapeType(element) {
    if (this.getShapeInfo(element).$type) {
      const [namespace, type] = this.getShapeInfo(element).$type.split(":");
      return {
        namespace,
        type,
      };
    }
    return {
      namespace: null,
      type: null,
    };
  }

  updateSelectedShapeExtensions(extensions = {}) {
    if (!this.getSelectedShape()) {
      return;
    }
    this.updateShapeExtensions(this.getSelectedShape(), extensions);
  }

  updateShapeExtensions(shape, extensions) {
    const extensionElements = this.#getModule("moddle").create("bpmn:ExtensionElements", {
      values: extensions,
    });
    this.updateShapeProperties(shape, { extensionElements });
  }

  updateSelectedShapeProperties(payload = {}) {
    if (!this.getSelectedShape()) {
      const root = this.elementRegistryFind((elem) => elem.type === "bpmn:Process");
      this.updateShapeProperties(root, payload);
      return;
    }
    this.updateShapeProperties(this.getSelectedShape(), payload);
  }

  updateRootShapeProperties(payload = {}) {
    const root = this.elementRegistryFind((elem) => elem.type === "bpmn:Process");
    this.updateShapeProperties(root, payload);
    this.fire('rootShape.changed', { element: root });
  }

  updateShapeProperties(shape, payload = {}) {
    this.modelingUpdateProperties(shape, payload);
  }

  updateSelectedShapeModdleProperties(moddleElement, payload = {}) {
    if (!this.getSelectedShape() || !moddleElement) {
      return;
    }
    this.updateShapeModdleProperties(this.getSelectedShape(), moddleElement, payload);
  }

  updateShapeModdleProperties(shape, moddleElement, payload = {}) {
    this.modelingUpdateModdleProperties(shape, moddleElement, payload);
  }

  paletteVisible(visable) {
    this.#getModule("palette")._container.style = visable ? "" : "display: none";
  }

  createBpmnModdleInstance(localName, attrs) {
    return this.createModdleInstance(`bpmn:${localName}`, attrs);
  }

  createDefaultModdleInstance(localName, attrs) {
    return this.createModdleInstance(`${this.type}:${localName}`, attrs);
  }

  createModdleInstance(descriptor, attrs) {
    return this.#getModule("moddle").create(descriptor, attrs);
  }

  async validate() {
    const valid = await this.linterLint();
    if (Object.keys(valid).length === 0) {
      return true;
    }

    throw new Error(`This canvas has ${Object.keys(valid).length} errors`);
  }

  async createEmptyDiagram(name = new Date().getTime(), properties) {
    this.loadDiagram(defaultEmpty(`process_${new Date().getTime()}`, name, this.type), properties);
  }

  async loadDiagram(xml, properties) {
    try {
      const { warnings } = await this.#modeler.importXML(xml);
      if (warnings && warnings.length) {
        warnings.forEach(console.warn);
      }
      if (properties) {
        this.updateRootShapeProperties(properties);
      }
      this.canvasZoom('fit-viewport', 'auto')
    } catch (e) {
      console.error(`[Process Designer Warn]: ${e?.message || e}`);
    }
  }

  async saveSVG(args) {
    return this.#modeler.saveSVG(args);
  }

  async saveXML(args) {
    return this.#modeler.saveXML(args);
  }

  async saveJSON(args) {
    const { xml } = await this.saveXML(args);
    const x2js = new X2JS();
    let { definitions: json } = x2js.xml2js(xml);
    if (args.format) {
      json = JSON.stringify(json, null, 2);
    }
    return { json };
  }
}

export default IBpmn;
