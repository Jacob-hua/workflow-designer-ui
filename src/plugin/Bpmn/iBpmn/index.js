import BpmnModeler from "bpmn-js/lib/Modeler";
import lintModule from "bpmn-js-bpmnlint";
import bpmnlintConfig from "./.bpmnlintrc";
import customTranslate from "./utils/customTranslate";
import { filterPublicFunction } from "./utils/function";

import zh from "./i18n/zh";
import defaultEmpty from "./utils/defaultEmpty";

import { moduleConfigs } from "./config";

// bpmn左侧工具栏样式
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";

// bpmn lint css
import "bpmn-js-bpmnlint/dist/assets/css/bpmn-js-bpmnlint.css";

function functionMapping(target, sources = {}) {
  let newPrototype = Object.getPrototypeOf(target);
  for (const module of Object.keys(sources)) {
    const methods = filterPublicFunction(target.modeler.get(module), sources[module]?.prefix);
    newPrototype = Object.assign(newPrototype, methods)
  }
  Object.setPrototypeOf(target, newPrototype)
}

const defaultIBpmnProps = {
  name: "iBpmn",
  key: "iBpmn",
  type: "camunda",
  lintActive: true,
  i18n: zh,
};

class IBpmn {
  constructor(props = {}) {
    props = { ...defaultIBpmnProps, ...props };
    this.name = props.name;
    this.key = props.key;
    this.type = props.type;
    this.lintActive = props.lintActive;
    this.i18n = props.i18n;

    this.modeler = new BpmnModeler({
      additionalModules: [
        lintModule,
        {
          translate: ["value", customTranslate(this.i18n)],
        },
      ],
      linting: {
        bpmnlint: bpmnlintConfig,
      },
    });

    functionMapping(this, moduleConfigs);

    this.linterToggle(this.lintActive);
    this.#getModule("linting")._button.style = "pointer-events: none";
  }

  attachTo(element) {
    this.modeler.attachTo(element);
  }

  detach() {
    this.modeler.detach();
  }

  clear() {
    this.modeler.clear();
  }

  #getModule(module) {
    return this.modeler.get(module);
  }

  paletteVisible(visable) {
    this.#getModule("palette")._container.style = visable ? "" : "display: none";
  }

  async createEmptyDiagram() {
    this.loadDiagram(defaultEmpty(this.key, this.name, this.props));
  }

  async loadDiagram(xml) {
    try {
      const { warnings } = await this.modeler.importXML(xml);
      if (warnings && warnings.length) {
        warnings.forEach(console.warn);
      }
    } catch (e) {
      console.error(`[Process Designer Warn]: ${e?.message || e}`);
    }
  }
}

export default IBpmn;
