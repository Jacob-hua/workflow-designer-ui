import BpmnViewer from 'bpmn-js/lib/NavigatedViewer';
import ImportModule from 'bpmn-js/lib/import';
import ElementRegistry from 'diagram-js/lib/core/ElementRegistry';
import Modeling from 'bpmn-js/lib/features/modeling';
// import MoveCanvasModule from 'diagram-js/lib/navigation/movecanvas';
import X2JS from 'x2js';
import { filterPublicFunction } from './utils/function';
import zoomScroll from './utils/zoomScroll';
import moveCanvas from './utils/moveCanvas';
import { getShapeType } from './enum/shapeType';

import config from './config';
import custom from './custom';
import zh from './i18n/zh';

function functionMapping(target, sources, modulesConfig = {}) {
  for (const module of Object.keys(modulesConfig)) {
    const methods = filterPublicFunction(
      sources.get(module),
      modulesConfig[module]?.prefix
    );
    target = Object.assign(target, methods);
  }
}

const defaultIBpmnViewerProps = {
  type: 'camunda',
  i18n: zh,
  id: Date.now().toString(),
  bpmnRenderer: {
    defaultFillColor: 'white',
    defaultStrokeColor: 'black',
    defaultLabelColor: 'black',
  },
};

class IBpmnViewer {
  #viewer = {};
  #id = '';

  constructor(props = {}) {
    props = { ...defaultIBpmnViewerProps, ...props };
    this.#id = props.id;
    this.type = props.type;
    this.i18n = props.i18n;

    this.#viewer = new BpmnViewer({
      bpmnRenderer: {
        ...props.bpmnRenderer,
      },
      // additionalModules: [custom, ImportModule, ElementRegistry],
      additionalModules: [
        ImportModule,
        ElementRegistry,
        Modeling,
        moveCanvas,
        zoomScroll,
      ],
      moddleExtensions: config.extensions[this.type],
    });

    functionMapping(this, this.#viewer, config.bpmnViewerModuleConfig);
  }

  get id() {
    return this.#id;
  }

  attachTo(element) {
    this.#viewer.attachTo(element);
  }

  detach() {
    this.#viewer.detach();
  }

  updateSelectedShapeId(id) {
    if (!this.getSelectedShape()) {
      const root = this.elementRegistryFind(
        (elem) => elem.type === 'bpmn:Process'
      );
      this.updateShapeId(root, id);
      return;
    }
    this.updateShapeId(this.getSelectedShape(), id);
  }

  updateRootShapeId(id) {
    const root = this.elementRegistryFind(
      (elem) => elem.type === 'bpmn:Process'
    );
    this.updateShapeId(root, id);
  }

  updateShapeId(shape, id) {
    if (!shape) {
      return;
    }
    this.elementRegistryUpdateId(shape, id);
    shape.businessObject.set('id', id);
  }

  updateSelectedShapeProperties(payload = {}) {
    if (!this.getSelectedShape()) {
      const root = this.elementRegistryFind(
        (elem) => elem.type === 'bpmn:Process'
      );
      this.updateShapeProperties(root, payload);
      return;
    }
    this.updateShapeProperties(this.getSelectedShape(), payload);
  }

  updateShapeProperties(shape, payload = {}) {
    if (!shape) {
      return;
    }
    this.modelingUpdateProperties(shape, payload);
  }

  getSelectedShape() {
    const shapes = this.selectionGet() ?? [];
    return shapes[0] ?? null;
  }

  getSelectedShapeType() {
    return this.getShapeType(this.getSelectedShape());
  }

  getRootShapeInfo() {
    const root = this.elementRegistryFind(
      (elem) => elem.type === 'bpmn:Process'
    );
    if (!root) {
      return {};
    }
    return this.getShapeInfo(root);
  }

  getShapeInfo(element) {
    return element.businessObject ?? {};
  }

  getSelectedShapeInfo() {
    return this.getSelectedShape()?.businessObject ?? {};
  }

  getShapeType(element) {
    const { $type, eventDefinitions = [] } = this.getShapeInfo(element);
    return getShapeType(
      eventDefinitions[0] ? `${$type}_${eventDefinitions[0].$type}` : `${$type}`
    );
  }

  async loadDiagram(xml) {
    try {
      const { warnings } = await this.#viewer.importXML(xml);
      if (warnings && warnings.length) {
        warnings.forEach(console.warn);
      }
      this.canvasZoom('fit-viewport', 'auto');
    } catch (e) {
      console.error(`[Process Designer Warn]: ${e?.message || e}`);
    }
  }

  async saveSVG(args) {
    return this.#viewer.saveSVG(args);
  }

  async saveXML(args) {
    return this.#viewer.saveXML(args);
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

export default IBpmnViewer;
