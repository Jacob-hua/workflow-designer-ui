import IBpmn from "../../iBpmn";

function selectedElementListeners(iBpmn = new IBpmn()) {
  const listeners = iBpmn.getSelectedShapeInfoByDefaultLocalName("ExecutionListener");
  return listeners?.map(listener2State);

  function listener2State(listener) {
    const state = {};
    state.event = listener.event;
    if (listener.class) {
      state.listenerType = "class";
      state.class = listener.class;
    } else if (listener.expression) {
      state.listenerType = "expression";
      state.expression = listener.expression;
    } else if (listener.delegateExpression) {
      state.listenerType = "delegateExpression";
      state.delegateExpression = listener.delegateExpression;
    } else if (listener.script) {
      if (listener.script.value) {
        state.scriptType = "inline";
        state.scriptValue = listener.script.value;
      } else {
        state.scriptType = "outside";
        state.scriptResource = listener.script.resource;
      }
    }
    state.fields = listener.fields?.map(listenerField2State);
    return state;
  }

  function listenerField2State(field) {
    const state = {};
    state.name = field.name;
    if (field.string) {
      state.fieldType = "string";
      state.value = field.string;
    } else if (field.expression) {
      state.fieldType = "expression";
      state.value = field.expression;
    }
    return state;
  }
}

export default {
  "selection.changed": (_, commit, iBpmn) => {
    const listeners = selectedElementListeners(iBpmn);
    if (listeners) {
      commit("refreshState", { listeners });
    } else {
      commit("initState");
    }
  },
  "shape.changed": ({ element }, commit) => {
    if (!element) {
      return;
    }
    commit("refreshState", element.businessObject);
  },
};
