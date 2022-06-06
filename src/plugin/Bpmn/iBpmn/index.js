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
  name: "iBpmn",
  key: "iBpmn",
  type: "camunda",
  lintActive: true,
  i18n: zh,
};

class IBpmn {
  #modeler = {};

  constructor(props = {}) {
    props = { ...defaultIBpmnProps, ...props };
    this.name = props.name;
    this.key = props.key;
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
      return;
    }
    this.updateShapeProperties(this.getSelectedShape(), payload);
  }

  updateShapeProperties(shape, payload = {}) {
    this.modelingUpdateProperties(shape, payload);
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

  getSelectedShapeInfoByDefaultLocalName(localName) {
    return this.getSelectedShapeInfoByType(`${this.type}:${localName}`);
  }

  getSelectedShapeInfoByLocalName(localName) {
    return this.getSelectedShapeInfoByType(`bpmn:${localName}`);
  }

  getSelectedShapeInfoByType(type) {
    const selectedShapeProperties = this.getSelectedShape()?.businessObject;
    if (!selectedShapeProperties) {
      return;
    }
    if (selectedShapeProperties.$type === type) {
      return selectedShapeProperties;
    }
    const extensionElements = selectedShapeProperties.extensionElements;
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

  async createEmptyDiagram() {
    this.loadDiagram(defaultEmpty(this.key, this.name, this.type));
  }

  async loadDiagram(xml) {
    try {
      const { warnings } = await this.#modeler.importXML(xml);
      if (warnings && warnings.length) {
        warnings.forEach(console.warn);
      }
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
