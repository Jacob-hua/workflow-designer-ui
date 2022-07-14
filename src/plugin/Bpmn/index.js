import components from './components'

import 'highlight.js/styles/atom-one-dark-reasonable.css'

const highlight = require('highlight.js/lib/core')
highlight.registerLanguage('xml', require('highlight.js/lib/languages/xml'))
highlight.registerLanguage('json', require('highlight.js/lib/languages/json'))

const install = (Vue) => {
  if (install.installed) {
    return
  }
  components.forEach((component) => Vue.component(component.name, component))
  Vue.use(highlight.vuePlugin)
}

if (window && window.Vue) {
  install(window.Vue)
}

export default {
  install,
}
