import IBpmn from "../../../iBpmn";

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

function inputOutputParameter2State(iBpmn = new IBpmn()) {
  const state = {};
  const inputOutputParameters = iBpmn.getSelectedShapeInfoByDefaultLocalName("InputOutput") ?? [];
  const inputOutputParameter = inputOutputParameters[0] ?? {};
  if (inputOutputParameter["outputParameters"]) {
    state.outputParameters = inputOutputParameter.outputParameters.map(parameter2State);
  } else {
    state.outputParameters = [];
  }
  if (inputOutputParameter["inputParameters"]) {
    state.inputParameters = inputOutputParameter.inputParameters.map(parameter2State);
  } else {
    state.inputParameters = [];
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
    const parameter = {};
    if (definition["scriptFormat"]) {
      parameter.type = "script";
      parameter.scriptFormat = definition.scriptFormat;
      if (definition["value"]) {
        parameter.scriptType = "inline";
        parameter.scriptValue = definition.value;
      } else {
        parameter.scriptType = "outside";
        parameter.scriptResource = definition.resource;
      }
    } else if (definition["items"]) {
      parameter.type = "list";
      parameter.listValues = definition.items?.map(({ value }) => value) ?? [];
    } else if (definition["entries"]) {
      parameter.type = "map";
      parameter.mapValues = definition.entries?.map(({ key, value }) => ({ key, value })) ?? [];
    }
    return parameter;
  }
}

function baseInfoParameter2State(iBpmn = new IBpmn()) {
  const baseInfo = {};
  const shapeInfo = iBpmn.getSelectedShapeInfo();
  baseInfo.name = shapeInfo.name;
  baseInfo.id = shapeInfo.id;
  return baseInfo;
}

function userTaskParameter2State(iBpmn = new IBpmn()) {
  const userTask = {
    assignee: "",
    candidateUsers: "",
    candidateGroups: "",
  };
  const shapeInfo = iBpmn.getSelectedShapeInfo();
  userTask.assignee = shapeInfo["assignee"];
  userTask.candidateUsers = shapeInfo["candidateUsers"];
  userTask.candidateGroups = shapeInfo["candidateGroups"];
  return userTask;
}

function actionsParameter2State(iBpmn = new IBpmn()) {
  const shapeInfo = iBpmn.getSelectedShapeInfo();
  return [...(shapeInfo["actions"] ?? [])];
}

function shapeType2State(iBpmn = new IBpmn()) {
  return { ...(iBpmn.getSelectedShapeType() ?? {}) };
}

function multiInstance2State(iBpmn = new IBpmn()) {
  const multiInstance = {
    loopCharacteristics: "",
    loopCardinality: "",
    collection: "",
    elementVariable: "",
    completionCondition: "",
  };
  const shapeInfo = iBpmn.getSelectedShapeInfo();
  if (!shapeInfo.loopCharacteristics) {
    return multiInstance;
  }
  const loopCharacteristics = shapeInfo.loopCharacteristics;
  if (loopCharacteristics.isSequential) {
    multiInstance.loopCharacteristics = "SequentialMultiInstance";
  } else {
    multiInstance.loopCharacteristics = "ParallelMultiInstance";
  }
  multiInstance.loopCardinality = loopCharacteristics.loopCardinality?.body;
  multiInstance.completionCondition = loopCharacteristics.completionCondition?.body;
  multiInstance.collection = loopCharacteristics.collection;
  multiInstance.elementVariable = loopCharacteristics.elementVariable;
  return multiInstance;
}

function selectionChangedListener(_, commit, iBpmn = new IBpmn()) {
  if (!iBpmn.getSelectedShape()) {
    commit("initState");
    commit("refreshState", {
      baseInfo: {
        name: iBpmn.getRootShapeInfo().name,
        id: iBpmn.getRootShapeInfo().id,
      },
    });
    return;
  }

  const baseInfo = baseInfoParameter2State(iBpmn);

  const listeners = listenersParameter2State(iBpmn);

  const { inputParameters, outputParameters } = inputOutputParameter2State(iBpmn);

  const userTask = userTaskParameter2State(iBpmn);

  const actions = actionsParameter2State(iBpmn);

  const shapeType = shapeType2State(iBpmn);

  const multiInstance = multiInstance2State(iBpmn);

  commit("refreshState", {
    shapeType,
    baseInfo,
    listeners,
    inputParameters,
    outputParameters,
    userTask,
    actions,
    multiInstance,
  });
}

export default selectionChangedListener;
