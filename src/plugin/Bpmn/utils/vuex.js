import { deepCopy, typeAssert } from './object'

export function moduleFactory(requireModule) {
  let initialModuleStateCache = {}

  return function (namespace) {
    const modules = loadModules(requireModule)

    initModules(modules, {
      state: () => () => ({}),
      getters: () => ({}),
      mutations: () => ({}),
      actions: () => ({}),
      namespaced: () => true,
      mutationsEffect: () => ({}),
      eventsListener: () => ({}),
    })

    initialModuleStateCache = cacheModuleState(modules)

    const commonMutations = {
      refreshState() {
        return function (state, payload = {}) {
          Object.keys(payload).forEach((key) => {
            state[key] = payload[key]
          })
        }
      },
      initState(moduleName) {
        return function () {
          this.commit(`${namespace}/${moduleName}/refreshState`, deepCopy(initialModuleStateCache[moduleName]))
        }
      },
    }

    injectCommonMutations(modules, commonMutations)

    const mutationsEffectBill = makeMutationsEffectBill(modules, namespace)
    const eventsListenerBill = makeEventsListenerBill(modules)

    return {
      modules,
      mutationsEffectBill,
      eventsListenerBill,
    }
  }

  function loadModules(requireModule) {
    const modules = requireModule.keys().reduce((modules, modulePath) => {
      const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
      if (moduleName === 'index') {
        return modules
      }
      modules[moduleName] = requireModule(modulePath).default
      return modules
    }, {})
    return modules
  }

  function initModules(modules, moduleTemplate) {
    Object.keys(modules).forEach((moduleName) => {
      patchModule(modules[moduleName], moduleTemplate)
    })
  }

  function patchModule(module, moduleTemplate) {
    Object.keys(moduleTemplate)
      .filter((property) => !Object.prototype.hasOwnProperty.call(module, property))
      .forEach((property) => {
        module[property] = moduleTemplate[property]()
      })
  }

  function cacheModuleState(modules) {
    const cache = Object.keys(modules).reduce((cache, moduleName) => {
      const module = modules[moduleName]
      cache[moduleName] = typeAssert(module.state, Function) ? deepCopy(module.state()) : deepCopy(module.state ?? {})
      return cache
    }, {})
    return cache
  }

  function injectCommonMutations(modules, commonMutations) {
    Object.keys(modules).forEach((moduleName) => {
      const module = modules[moduleName]
      Object.keys(commonMutations)
        .filter((mutationKey) => !Object.prototype.hasOwnProperty.call(module.mutations, mutationKey))
        .forEach((mutationKey) => {
          module.mutations[mutationKey] = commonMutations[mutationKey](moduleName)
        })
    })
  }
}

export function makeMutationsEffectBill(modules, namespace) {
  const result = Object.keys(modules).reduce((mutationsEffectBill, moduleName) => {
    const module = modules[moduleName]
    const bill = Object.keys(module.mutationsEffect).reduce(
      (effectBill, mutation) => ({
        ...effectBill,
        [`${namespace}/${moduleName}/${mutation}`]: {
          effect: module.mutationsEffect[mutation],
          module: moduleName,
        },
      }),
      {}
    )
    return { ...mutationsEffectBill, ...bill }
  }, {})
  return result
}

export function makeEventsListenerBill(modules) {
  const result = Object.keys(modules).reduce((eventsListener, moduleName) => {
    const module = modules[moduleName]
    Object.keys(module.eventsListener).forEach((eventName) => {
      if (!eventsListener[eventName]) {
        eventsListener[eventName] = []
      }
      eventsListener[eventName].push({
        module: moduleName,
        listener: module.eventsListener[eventName],
      })
    })
    return eventsListener
  }, {})
  return result
}
