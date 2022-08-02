import { assign } from 'min-dash'
import ContextPadProvider from 'bpmn-js/lib/features/context-pad/ContextPadProvider'

class CustomContextPad extends ContextPadProvider {
  constructor(
    config,
    injector,
    eventBus,
    contextPad,
    modeling,
    elementFactory,
    connect,
    create,
    popupMenu,
    canvas,
    rules,
    translate
  ) {
    super(
      config,
      injector,
      eventBus,
      contextPad,
      modeling,
      elementFactory,
      connect,
      create,
      popupMenu,
      canvas,
      rules,
      translate
    )
  }

  getContextPadEntries(element) {
    const actions = super.getContextPadEntries(element)
    var elementFactory = this._elementFactory,
      create = this._create,
      autoPlace = this._autoPlace,
      translate = this._translate
    function appendAction(type, className, title, options) {
      if (typeof title !== 'string') {
        options = title
        title = translate('Append {type}', { type: type.replace(/^bpmn:/, '') })
      }

      function appendStart(event, element) {
        var shape = elementFactory.createShape(assign({ type: type }, options))
        create.start(event, shape, {
          source: element,
        })
      }

      var append = autoPlace
        ? function (event, element) {
            var shape = elementFactory.createShape(assign({ type: type }, options))

            autoPlace.append(element, shape)
          }
        : appendStart

      return {
        group: 'model',
        className: className,
        title: title,
        action: {
          dragstart: appendStart,
          click: append,
        },
      }
    }
    actions['append.append-task'] = appendAction('bpmn:UserTask', 'bpmn-icon-task', translate('Append Task'))
    return actions
  }
}

CustomContextPad.$inject = [
  'config.contextPad',
  'injector',
  'eventBus',
  'contextPad',
  'modeling',
  'elementFactory',
  'connect',
  'create',
  'popupMenu',
  'canvas',
  'rules',
  'translate',
]

export default CustomContextPad
