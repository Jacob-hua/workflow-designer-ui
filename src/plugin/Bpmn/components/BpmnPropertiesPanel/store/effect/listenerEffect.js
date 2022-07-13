import IBpmnModeler from '../../../../IBpmnModeler'

function listenersState2Parameter(listeners, iBpmnModeler = new IBpmnModeler()) {
  return listeners.reduce((listeners, listener) => [...listeners, convertListener(listener)], [])

  function convertListener(listener) {
    let attrs = {}
    attrs.id = listener.id
    attrs.event = listener.event

    const computeProperties = {
      script: () => ({ script: convertScript(listener) }),
      expression: () => ({ expression: listener.expression }),
      delegateExpression: () => ({ delegateExpression: listener.delegateExpression }),
      class: () => ({ class: listener.class }),
    }

    attrs = { ...attrs, ...computeProperties[listener.listenerType]() }
    attrs.fields = convertFields(listener)
    return iBpmnModeler.createDefaultModdleInstance('ExecutionListener', attrs)
  }

  function convertScript(listener) {
    const scriptAttrs = {
      inline: { scriptFormat: listener.scriptFormat, value: listener.scriptValue },
      outside: { scriptFormat: listener.scriptFormat, resource: listener.scriptResource },
    }
    return iBpmnModeler.createDefaultModdleInstance('Script', scriptAttrs[listener.scriptType])
  }

  function convertFields(listener) {
    if (!listener.fields) {
      return []
    }
    return listener.fields.reduce((fields, field) => [...fields, convertField(field)], [])
  }

  function convertField(field) {
    const fieldAttrs = {
      string: { name: field.name, string: field.value },
      expression: { name: field.name, expression: field.value },
    }
    return iBpmnModeler.createDefaultModdleInstance('Field', fieldAttrs[field.fieldType])
  }
}

function listenerEffect({ listeners }, iBpmnModeler = new IBpmnModeler()) {
  const parameters = listenersState2Parameter(listeners, iBpmnModeler)
  iBpmnModeler.updateSelectedShapeExtensions(parameters)
}

export default listenerEffect
