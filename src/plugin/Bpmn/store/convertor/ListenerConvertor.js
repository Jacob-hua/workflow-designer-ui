import BaseConvertor from "./BaseConvertor";

class ListenerConvertor extends BaseConvertor {
  constructor(props) {
    super(props);
    this.listeners = this.state["listeners"] ?? [];
  }

  convert() {
    return this.listeners.reduce((listeners, listener) => [...listeners, this.convertListener(listener)], []);
  }

  convertListener(listener) {
    let result = {};
    result.id = listener.id;
    result.event = listener.eventType;

    const computeProperties = {
      script: () => ({ script: this.convertScript(listener) }),
      expression: () => ({ expression: listener.expression }),
      delegateExpression: () => ({ delegateExpression: listener.delegateExpression }),
      class: () => ({ class: listener.class }),
    };

    result = { ...result, ...computeProperties[listener.listenerType]() };
    result.fields = this.convertFields(listener);
    return this.iBpmn.createDefaultModdleInstance("ExecutionListener", result);
  }

  convertScript(listener) {
    return this.iBpmn.createDefaultModdleInstance("Script", generateScriptAttrs(listener));

    function generateScriptAttrs(listener) {
      const scriptAttrs = {
        inline: { scriptFormat: listener.scriptFormat, value: listener.scriptValue },
        outside: { scriptFormat: listener.scriptFormat, resource: listener.resource },
      };
      return scriptAttrs[listener.scriptType];
    }
  }

  convertFields(listener) {
    if (!listener.fields) {
      return [];
    }
    return listener.fields.reduce((fields, field) => [...fields, this.convertField(field)], []);
  }

  convertField(field) {
    return this.iBpmn.createDefaultModdleInstance("Field", generateFieldAttrs(field));

    function generateFieldAttrs(field) {
      const fieldAttrs = {
        string: { name: field.name, string: field.value },
        expression: { name: field.name, expression: field.value },
      };
      return fieldAttrs[field.type];
    }
  }
}

export default ListenerConvertor;
