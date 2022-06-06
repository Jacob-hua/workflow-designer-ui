import IBpmn from "../../iBpmn";

function listenersParameter2State(iBpmn = new IBpmn()) {
  const listeners = iBpmn.getSelectedShapeInfoByDefaultLocalName("ExecutionListener") ?? [];
  return listeners.map(listener2State);

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

function baseInfoParameter2State(iBpmn = new IBpmn()) {
  const state = {};
  const shapeInfo = iBpmn.getSelectedShapeInfo();
  state.name = shapeInfo.name;
  state.id = shapeInfo.id;
  return state;
}

function inputOutputParameter2State(iBpmn = new IBpmn()) {
  const state = {};
  const inputOutputParameters = iBpmn.getSelectedShapeInfoByDefaultLocalName("InputOutput") ?? [];
  const inputOutputParameter = inputOutputParameters[0] ?? {};
  if (inputOutputParameter["outputParameters"]) {
    state.outputParameters = inputOutputParameter.outputParameters.map(parameter2State);
  }
  if (inputOutputParameter["inputParameters"]) {
    state.inputParameters = inputOutputParameter.inputParameters.map(parameter2State);
  }
  return state;

  function parameter2State(parameter) {
    let state = {};
    state.name = parameter.name;
    if (parameter["definition"]) {
      state = { ...state, ...parameterDefinition2State(parameter.definition) };
    } else {
      state.type = "string/expression";
      state.value = parameter.value;
    }
    return state;
  }

  function parameterDefinition2State(definition) {
    const state = {};
    if (definition["scriptFormat"]) {
      state.type = "script";
      state.scriptFormat = definition.scriptFormat;
      if (definition["value"]) {
        state.scriptType = "inline";
        state.scriptValue = definition.value;
      } else {
        state.scriptType = "outside";
        state.scriptResource = definition.resource;
      }
    } else if (definition["items"]) {
      state.type = "list";
      state.listValues = definition.items?.map(({ value }) => value) ?? [];
    } else if (definition["entries"]) {
      state.type = "map";
      state.mapValues = definition.entries?.map(({ key, value }) => ({ key, value })) ?? [];
    }
    return state;
  }
}

function selectionChangedListener(_, commit, iBpmn) {
  if (!iBpmn.getSelectedShape()) {
    commit("initState");
  }
  const baseInfo = baseInfoParameter2State(iBpmn);

  const listeners = listenersParameter2State(iBpmn);

  const { inputParameters, outputParameters } = inputOutputParameter2State(iBpmn);

  commit("refreshState", { baseInfo, listeners, inputParameters, outputParameters });
}

export default selectionChangedListener;
