import IBpmn from "../../iBpmn";

function parametersState2Parameter(inputParameters = [], iBpmn = new IBpmn(), localName = "InputParameter") {
  return inputParameters.reduce((parameters, parameter) => [...parameters, convertParameter(parameter)], []);

  function convertParameter(parameter) {
    let attrs = {};
    attrs.name = parameter.name;

    const computeParameter = {
      "string/expression": {
        value: parameter.value,
      },
      script: { definition: convertScript(parameter) },
      list: { definition: convertList(parameter.listValues) },
      map: { definition: convertMap(parameter.mapValues) },
    };
    attrs = { ...attrs, ...computeParameter[parameter.type] };
    return iBpmn.createDefaultModdleInstance(localName, attrs);
  }

  function convertScript(parameter) {
    const scriptAttrs = {
      inline: { scriptFormat: parameter.scriptFormat, value: parameter.scriptValue },
      outside: { scriptFormat: parameter.scriptFormat, resource: parameter.scriptResource },
    };

    return iBpmn.createDefaultModdleInstance("Script", scriptAttrs[parameter.scriptType]);
  }

  function convertList(listValues) {
    return iBpmn.createDefaultModdleInstance("List", {
      items: listValues.map((value) => iBpmn.createDefaultModdleInstance("Value", { value })),
    });
  }

  function convertMap(mapValues) {
    return iBpmn.createDefaultModdleInstance("Map", {
      entries: mapValues.map(({ key, value }) => iBpmn.createDefaultModdleInstance("Entry", { key, value })),
    });
  }
}

function inputOutputParameterEffect({ inputParameters, outputParameters }, iBpmn = new IBpmn()) {
  const parameters = iBpmn.createDefaultModdleInstance("InputOutput", {
    inputParameters: parametersState2Parameter(inputParameters, iBpmn, "InputParameter"),
    outputParameters: parametersState2Parameter(outputParameters, iBpmn, "OutputParameter"),
  });
  iBpmn.updateSelectedShapeExtensions([parameters]);
}

export default inputOutputParameterEffect;
