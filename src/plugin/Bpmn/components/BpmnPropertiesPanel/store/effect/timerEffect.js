import IBpmnModeler from '../../../../IBpmnModeler'
import uuid from '../../../../utils/uid'

function timerEffect({ timer: { timer, timerType } }, iBpmnModeler = new IBpmnModeler()) {
  const timerDefinitionAttr = {
    date: {
      timeDate: iBpmnModeler.createBpmnModdleInstance('FormalExpression', { body: timer }),
    },
    duration: {
      timeDuration: iBpmnModeler.createBpmnModdleInstance('FormalExpression', { body: timer }),
    },
    cycle: {
      timeCycle: iBpmnModeler.createBpmnModdleInstance('FormalExpression', { body: timer }),
    },
    [null]: {},
  }
  iBpmnModeler.updateSelectedShapeProperties({
    eventDefinitions: [
      iBpmnModeler.createBpmnModdleInstance('TimerEventDefinition', {
        id: `TimerEventDefinition_${uuid(7)}`,
        ...timerDefinitionAttr[timerType],
      }),
    ],
  })
}

export default timerEffect
