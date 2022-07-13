import IBpmnModeler from '../../../../IBpmnModeler'

function signalEffect({ signals }, iBpmnModeler = new IBpmnModeler()) {
  console.log(iBpmnModeler.createBpmnModdleInstance('Signal', signals))
}

export default signalEffect
