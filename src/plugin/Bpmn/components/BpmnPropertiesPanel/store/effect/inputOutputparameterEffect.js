import IBpmnModeler from '../../../../IBpmnModeler'

function parametersState2Parameter(
  inputParameters = [],
  iBpmnModeler = new IBpmnModeler(),
  localName = 'InputParameter'
) {
  return inputParameters.reduce((parameters, parameter) => [...parameters, convertParameter(parameter)], [])

  function convertParameter(parameter) {
    let attrs = {}
    attrs.name = parameter.name

    const computeParameter = {
      'string/expression': {
        value: parameter.value,
      },
      script: { definition: convertScript(parameter) },
      list: { definition: convertList(parameter.listValues) },
      map: { definition: convertMap(parameter.mapValues) },
    }
    attrs = { ...attrs, ...computeParameter[parameter.type] }
    return iBpmnModeler.createDefaultModdleInstance(localName, attrs)
  }

  function convertScript(parameter) {
    const scriptAttrs = {
      inline: { scriptFormat: parameter.scriptFormat, value: parameter.scriptValue },
      outside: { scriptFormat: parameter.scriptFormat, resource: parameter.scriptResource },
    }

    return iBpmnModeler.createDefaultModdleInstance('Script', scriptAttrs[parameter.scriptType])
  }

  function convertList(listValues) {
    return iBpmnModeler.createDefaultModdleInstance('List', {
      items: listValues.map((value) => iBpmnModeler.createDefaultModdleInstance('Value', { value })),
    })
  }

  function convertMap(mapValues) {
    return iBpmnModeler.createDefaultModdleInstance('Map', {
      entries: mapValues.map(({ key, value }) => iBpmnModeler.createDefaultModdleInstance('Entry', { key, value })),
    })
  }
}

function inputOutputParameterEffect({ inputParameters, outputParameters }, iBpmnModeler = new IBpmnModeler()) {
  const parameters = iBpmnModeler.createDefaultModdleInstance('InputOutput', {
    inputParameters: parametersState2Parameter(inputParameters, iBpmnModeler, 'InputParameter'),
    outputParameters: parametersState2Parameter(outputParameters, iBpmnModeler, 'OutputParameter'),
  })
  iBpmnModeler.updateSelectedShapeExtensions([parameters])
}

export default inputOutputParameterEffect
