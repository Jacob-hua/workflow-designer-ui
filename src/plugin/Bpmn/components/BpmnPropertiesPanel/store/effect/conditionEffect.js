import IBpmnModeler from '../../../../IBpmnModeler'
import BpmnShapeType from '../../../../enum/shapeType'
import { deepCopy } from '../../../../utils/object'

function conditionEffect({ condition }, iBpmnModeler = new IBpmnModeler()) {
  if (iBpmnModeler.getSelectedShapeType() !== BpmnShapeType.SEQUENCE_FLOW) {
    return
  }
  // const computeProperties = {
  //   script: {
  //     language: condition.scriptFormat,
  //     ...handlerScript(condition),
  //   },
  //   expression: {
  //     body: condition.expression,
  //   },
  // }

  if (condition.type) {
    if(!condition.judgment || condition.conditionTarget === '') return;
    iBpmnModeler.updateSelectedShapeProperties({
      conditionExpression: iBpmnModeler.createBpmnModdleInstance('FormalExpression', {
        body: '${'+condition.sourceRef+condition.judgment+condition.conditionTarget+'}',
      }),
      'camunda:judgment': condition.judgment,
      'camunda:conditionTarget': condition.conditionTarget
    })
  } else {
    delete iBpmnModeler.getSelectedShapeInfo().conditionExpression
    delete iBpmnModeler.getSelectedShapeInfo()['camunda:judgment']
    delete iBpmnModeler.getSelectedShapeInfo()['camunda:conditionTarget']
  }

  // function handlerScript(condition) {
  //   const scriptAttrs = {
  //     inline: {
  //       body: condition.script,
  //       language: condition.scriptFormat,
  //     },
  //     external: {
  //       resource: condition.scriptResource,
  //       language: condition.scriptFormat,
  //     },
  //   }
  //   return scriptAttrs[condition.scriptType]
  // }
}

export default conditionEffect
