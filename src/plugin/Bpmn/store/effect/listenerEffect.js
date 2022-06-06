import IBpmn from "../../iBpmn";

function listenersState2Parameter(listeners, iBpmn = new IBpmn()) {
  return listeners.reduce((listeners, listener) => [...listeners, convertListener(listener)], []);

  function convertListener(listener) {
    let attrs = {};
    attrs.id = listener.id;
    attrs.event = listener.event;

    const computeProperties = {
      script: () => ({ script: convertScript(listener) }),
      expression: () => ({ expression: listener.expression }),
      delegateExpression: () => ({ delegateExpression: listener.delegateExpression }),
      class: () => ({ class: listener.class }),
    };

    attrs = { ...attrs, ...computeProperties[listener.listenerType]() };
    attrs.fields = convertFields(listener);
    return iBpmn.createDefaultModdleInstance("ExecutionListener", attrs);
  }

  function convertScript(listener) {
    const scriptAttrs = {
      inline: { scriptFormat: listener.scriptFormat, value: listener.scriptValue },
      outside: { scriptFormat: listener.scriptFormat, resource: listener.scriptResource },
    };
    return iBpmn.createDefaultModdleInstance("Script", scriptAttrs[listener.scriptType]);
  }

  function convertFields(listener) {
    if (!listener.fields) {
      return [];
    }
    return listener.fields.reduce((fields, field) => [...fields, convertField(field)], []);
  }

  function convertField(field) {
    const fieldAttrs = {
      string: { name: field.name, string: field.value },
      expression: { name: field.name, expression: field.value },
    };
    return iBpmn.createDefaultModdleInstance("Field", fieldAttrs[field.fieldType]);
  }
}

function listenerEffect({ listeners }, iBpmn = new IBpmn()) {
  const parameters = listenersState2Parameter(listeners, iBpmn);
  iBpmn.updateSelectedShapeExtensions(parameters);
}

export default listenerEffect;
