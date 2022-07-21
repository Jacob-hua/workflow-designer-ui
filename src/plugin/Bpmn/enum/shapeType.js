const shapeType = {
  START_EVENT: Symbol('bpmn:StartEvent'),
  MESSAGE_START_EVENT: Symbol('bpmn:StartEvent_bpmn:MessageEventDefinition'),
  TIMER_START_EVENT: Symbol('bpmn:StartEvent_bpmn:TimerEventDefinition'),
  CONDITIONAL_START_EVENT: Symbol('bpmn:StartEvent_bpmn:ConditionalEventDefinition'),
  SIGNAL_START_EVENT: Symbol('bpmn:StartEvent_bpmn:SignalEventDefinition'),

  END_EVENT: Symbol('bpmn:EndEvent'),
  MESSAGE_END_EVENT: Symbol('bpmn:EndEvent_bpmn:MessageEventDefinition'),
  ESCALATION_END_EVENT: Symbol('bpmn:EndEvent_bpmn:EscalationEventDefinition'),
  ERROR_END_EVENT: Symbol('bpmn:EndEvent_bpmn:ErrorEventDefinition'),
  COMPENSATE_END_EVENT: Symbol('bpmn:EndEvent_bpmn:CompensateEventDefinition'),
  SIGNAL_END_EVENT: Symbol('bpmn:EndEvent_bpmn:SignalEventDefinition'),
  TERMINATE_END_EVENT: Symbol('bpmn:EndEvent_bpmn:TerminateEventDefinition'),

  TASK: Symbol('bpmn:Task'),
  SEND_TASK: Symbol('bpmn:SendTask'),
  RECEIVE_TASK: Symbol('bpmn:ReceiveTask'),
  USER_TASK: Symbol('bpmn:UserTask'),
  MANUAL_TASK: Symbol('bpmn:ManualTask'),
  BUSINESS_RULE_TASK: Symbol('bpmn:BusinessRuleTask'),
  SERVICE_TASK: Symbol('bpmn:ServiceTask'),
  SCRIPT_TASK: Symbol('bpmn:ScriptTask'),
  CALL_ACTIVITY: Symbol('bpmn:CallActivity'),

  EXCLUSIVE_GATEWAY: Symbol('bpmn:ExclusiveGateway'),
  PARALLEL_GATEWAY: Symbol('bpmn:ParallelGateway'),
  INCLUSIVE_GATEWAY: Symbol('bpmn:InclusiveGateway'),
  EVENT_BASE_GATEWAY: Symbol('bpmn:EventBasedGateway'),
  COMPLEX_GATEWAY: Symbol('bpmn:ComplexGateway'),

  SEQUENCE_FLOW: Symbol('bpmn:SequenceFlow'),
}

export function getShapeType(tag) {
  const shapTypes = {
    'bpmn:StartEvent': shapeType.START_EVENT,
    'bpmn:StartEvent_bpmn:MessageEventDefinition': shapeType.MESSAGE_START_EVENT,
    'bpmn:StartEvent_bpmn:TimerEventDefinition': shapeType.TIMER_START_EVENT,
    'bpmn:StartEvent_bpmn:ConditionalEventDefinition': shapeType.CONDITIONAL_START_EVENT,
    'bpmn:StartEvent_bpmn:SignalEventDefinition': shapeType.SIGNAL_START_EVENT,
    'bpmn:EndEvent': shapeType.END_EVENT,
    'bpmn:EndEvent_bpmn:MessageEventDefinition': shapeType.MESSAGE_END_EVENT,
    'bpmn:EndEvent_bpmn:EscalationEventDefinition': shapeType.ESCALATION_END_EVENT,
    'bpmn:EndEvent_bpmn:ErrorEventDefinition': shapeType.ERROR_END_EVENT,
    'bpmn:EndEvent_bpmn:CompensateEventDefinition': shapeType.COMPENSATE_END_EVENT,
    'bpmn:EndEvent_bpmn:SignalEventDefinition': shapeType.SIGNAL_END_EVENT,
    'bpmn:EndEvent_bpmn:TerminateEventDefinition': shapeType.TERMINATE_END_EVENT,
    'bpmn:Task': shapeType.TASK,
    'bpmn:SendTask': shapeType.SEND_TASK,
    'bpmn:ReceiveTask': shapeType.RECEIVE_TASK,
    'bpmn:UserTask': shapeType.USER_TASK,
    'bpmn:ManualTask': shapeType.MANUAL_TASK,
    'bpmn:BusinessRuleTask': shapeType.BUSINESS_RULE_TASK,
    'bpmn:ServiceTask': shapeType.SERVICE_TASK,
    'bpmn:ScriptTask': shapeType.SCRIPT_TASK,
    'bpmn:CallActivity': shapeType.CALL_ACTIVITY,
    'bpmn:ExclusiveGateway': shapeType.EXCLUSIVE_GATEWAY,
    'bpmn:ParallelGateway': shapeType.PARALLEL_GATEWAY,
    'bpmn:InclusiveGateway': shapeType.INCLUSIVE_GATEWAY,
    'bpmn:EventBasedGateway': shapeType.EVENT_BASE_GATEWAY,
    'bpmn:ComplexGateway': shapeType.COMPLEX_GATEWAY,
    'bpmn:SequenceFlow': shapeType.SEQUENCE_FLOW,
  }
  return shapTypes[tag]
}

export default shapeType
