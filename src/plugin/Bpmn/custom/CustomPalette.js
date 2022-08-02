import { assign } from 'min-dash'
import PaletteProvider from 'bpmn-js/lib/features/palette/PaletteProvider'

class CustomPalette extends PaletteProvider {
  constructor(palette, create, elementFactory, spaceTool, lassoTool, handTool, globalConnect, translate) {
    super(palette, create, elementFactory, spaceTool, lassoTool, handTool, globalConnect, translate)
  }

  getPaletteEntries(element) {
    const actions = super.getPaletteEntries(element)
    const create = this._create
    const elementFactory = this._elementFactory
    const translate = this._translate
    function createAction(type, group, className, title, options) {
      function createListener(event) {
        var shape = elementFactory.createShape(assign({ type: type }, options))

        if (options) {
          var di = getDi(shape)
          di.isExpanded = options.isExpanded
        }

        create.start(event, shape)
      }

      var shortType = type.replace(/^bpmn:/, '')

      return {
        group: group,
        className: className,
        title: title || translate('Create {type}', { type: shortType }),
        action: {
          dragstart: createListener,
          click: createListener,
        },
      }
    }
    actions['create.task'] = createAction('bpmn:UserTask', 'activity', 'bpmn-icon-task', translate('Create Task'))
    return actions
  }
}

CustomPalette.$inject = [
  'palette',
  'create',
  'elementFactory',
  'spaceTool',
  'lassoTool',
  'handTool',
  'globalConnect',
  'translate',
]

export default CustomPalette
