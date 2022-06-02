import IBpmn from "../../iBpmn";

function convertor(listeners, iBpmn = new IBpmn()) {
  return listeners.reduce((listeners, listener) => [...listeners, convertListener(listener)], []);

  function convertListener(listener) {
    let result = {};
    result.id = listener.id;
    result.event = listener.eventType;

    const computeProperties = {
      script: () => ({ script: convertScript(listener) }),
      expression: () => ({ expression: listener.expression }),
      delegateExpression: () => ({ delegateExpression: listener.delegateExpression }),
      class: () => ({ class: listener.class }),
    };

    result = { ...result, ...computeProperties[listener.listenerType]() };
    result.fields = convertFields(listener);
    return iBpmn.createDefaultModdleInstance("ExecutionListener", result);
  }

  function convertScript(listener) {
    return iBpmn.createDefaultModdleInstance("Script", generateScriptAttrs(listener));

    function generateScriptAttrs(listener) {
      const scriptAttrs = {
        inline: { scriptFormat: listener.scriptFormat, value: listener.scriptValue },
        outside: { scriptFormat: listener.scriptFormat, resource: listener.resource },
      };
      return scriptAttrs[listener.scriptType];
    }
  }

  function convertFields(listener) {
    if (!listener.fields) {
      return [];
    }
    return listener.fields.reduce((fields, field) => [...fields, convertField(field)], []);
  }

  function convertField(field) {
    return iBpmn.createDefaultModdleInstance("Field", generateFieldAttrs(field));

    function generateFieldAttrs(field) {
      const fieldAttrs = {
        string: { name: field.name, string: field.value },
        expression: { name: field.name, expression: field.value },
      };
      return fieldAttrs[field.fieldType];
    }
  }
}

function listenerEffect({ listeners }, iBpmn = new IBpmn()) {
  const parameters = convertor(listeners, iBpmn);
  iBpmn.updateSelectedShapeExtensions(parameters);
}

export default listenerEffect;
