import IBpmnModeler from '../IBpmnModeler'

const defaultBridgingModule = {
  modules: {},
  mutationsEffectBill: {},
  eventsListenerBill: {},
}

export function generateNamespace(vueComponent) {
  return `bpmn_${vueComponent._uid}`
}

export default function bridgingBpmn(store, namespace, iBpmnModeler = {}, bridgingModuleFunc = () => {}) {
  if (!store || !namespace || !(iBpmnModeler instanceof IBpmnModeler)) {
    return
  }

  const { modules, mutationsEffectBill, eventsListenerBill } = bridgingModuleFunc(namespace) ?? defaultBridgingModule
  if (!store.hasModule(namespace)) {
    store.registerModule(namespace, {
      modules,
      namespaced: true,
    })
  }

  const unregisterListener = regisetrBpmnListeners(store)

  const unsubscribeEffect = subscribeMutationEffect(store)

  return () => {
    unregisterListener()
    unsubscribeEffect()
    store.unregisterModule(namespace)
  }

  function subscribeMutationEffect(store) {
    return store.subscribe((mutation, state) => {
      if (isNotEffectMutation(mutation)) {
        return
      }
      const effect = mutationsEffectBill[mutation.type].effect ?? (() => {})
      const module = mutationsEffectBill[mutation.type].module
      effect(state[namespace][module], iBpmnModeler)
    })
  }

  function regisetrBpmnListeners(store) {
    const moduleEventFuncs = Object.keys(eventsListenerBill).reduce((moduleEventFuncs, eventName) => {
      moduleEventFuncs[eventName] = registerBpmnListener(eventName, eventsListenerBill[eventName], store)
      return moduleEventFuncs
    }, {})

    return () => {
      Object.keys(moduleEventFuncs).forEach((eventName) => {
        moduleEventFuncs[eventName].forEach((eventFunc) => {
          iBpmnModeler.off(eventName, eventFunc)
        })
      })
    }
  }

  function registerBpmnListener(eventName, listeners, store) {
    return listeners.reduce((eventFuncs, { listener, module }) => {
      const eventFunc = (event) => {
        listener(event, moduleCommit(store, module), iBpmnModeler)
      }
      iBpmnModeler.on(eventName, eventFunc)
      eventFuncs.push(eventFunc)
      return eventFuncs
    }, [])
  }

  function isNotEffectMutation(mutation) {
    return !mutationsEffectBill[mutation.type]
  }

  function moduleCommit(store, module) {
    return function (path, payload = {}) {
      store.commit(`${namespace}/${module}/${path}`, payload)
    }
  }
}
