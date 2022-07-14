import BpmnViewer from './BpmnViewer'
import BpmnPropertiesPanel from './BpmnPropertiesPanel'
import BpmnEditor from './BpmnEditor'

BpmnViewer.install = (Vue) => {
  Vue.compoent(BpmnViewer.name, BpmnViewer)
}

BpmnPropertiesPanel.install = (Vue) => {
  Vue.component(BpmnPropertiesPanel.name, BpmnPropertiesPanel)
}

BpmnEditor.install = (Vue) => {
  Vue.compoent(BpmnEditor.name, BpmnEditor)
}

export default [BpmnViewer, BpmnPropertiesPanel, BpmnEditor]
