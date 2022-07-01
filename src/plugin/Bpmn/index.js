import IBpmn from './iBpmn'
import BpmnEditor from './components/BpmnEditor'
import BpmnPropertiesPanel from './components/BpmnPropertiesPanel'
import BpmnCanvas from './components/BpmnCanvas'

import bpmnVuexPlugin from './store'

import 'highlight.js/styles/atom-one-dark-reasonable.css'

const components = [BpmnEditor, BpmnPropertiesPanel, BpmnCanvas]

const highlight = require('highlight.js/lib/core')
highlight.registerLanguage('xml', require('highlight.js/lib/languages/xml'))
highlight.registerLanguage('json', require('highlight.js/lib/languages/json'))

const install = (Vue, payload = {}) => {
  if (install.installed) {
    return
  }
  if (Vue && !Vue.$iBpmn) {
    Vue.prototype.$iBpmn = new IBpmn(payload)
  }
  components.forEach((component) => Vue.component(component.name, component))
  Vue.use(highlight.vuePlugin)
}

if (window && window.Vue) {
  install(window.Vue)
}

export { bpmnVuexPlugin }

export default {
  install,
  BpmnEditor,
  BpmnPropertiesPanel,
}
