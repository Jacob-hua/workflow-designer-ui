import formDesigner from '@/plugin/FormDesign/component/formDesigner'
import fancyEditor from '@/plugin/FormDesign/extend/fancyEditor'
import fancyHtml from '@/plugin/FormDesign/extend/fancyHtml'
import fancyText from '@/plugin/FormDesign/extend/fancyText'
import fancyNFC from '@/plugin/FormDesign/extend/fancyNFC'
import fancyBarCode from 'vue-barcode'
import fancyDialogList from '@/plugin/FormDesign/extend/fancyDialogList'
import iconDialog from '@/plugin/FormDesign/component/iconDialog'
const plugins = {
  install: function (Vue) {
    Vue.component('form-designer', formDesigner)
    Vue.component('fancy-editor', fancyEditor)
    Vue.component('fancy-html', fancyHtml)
    Vue.component('fancy-text', fancyText)
    Vue.component('fancy-nfc', fancyNFC)
    Vue.component('fancy-bar-code', fancyBarCode)
    Vue.component('fancy-dialog-list', fancyDialogList)
    Vue.component('icon-dialog', iconDialog)
  },
}
// 这一步判断window.Vue是否存在，因为直接引用vue.min.js， 它会把Vue绑到Window上，我们直接引用打包好的js才能正常跑起来。
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(plugins)
}
export default plugins
