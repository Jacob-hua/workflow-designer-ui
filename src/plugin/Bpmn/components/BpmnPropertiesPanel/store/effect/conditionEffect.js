import IBpmnModeler from '../../../../IBpmnModeler'

function conditionEffect({ condition }, iBpmnModeler = new IBpmnModeler()) {
  const computeProperties = {
    script: {
      language: condition.scriptFormat,
      ...handlerScript(condition),
    },
    expression: {
      body: condition.expression,
    },
  }

  computeProperties[condition.type] &&
    iBpmnModeler.updateSelectedShapeProperties({
      conditionExpression: iBpmnModeler.createBpmnModdleInstance('FormalExpression', {
        ...computeProperties[condition.type],
      }),
    })

  function handlerScript(condition) {
    const scriptAttrs = {
      inline: {
        body: condition.script,
        language: condition.scriptFormat,
      },
      external: {
        resource: condition.scriptResource,
        language: condition.scriptFormat,
      },
    }
    return scriptAttrs[condition.scriptType]
  }
}

export default conditionEffect
