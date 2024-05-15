import { Button, Icon } from 'ant-design-vue'
import { stylePrefix } from '../__builtins__/configs'
import { Fragment, useField, useFieldSchema, h } from '@formily/vue'
import { isValid, clone, uid } from '@formily/shared'
import {
  defineComponent,
  provide,
  inject,
  toRefs,
  ref,
  onBeforeUnmount,
} from '@vue/composition-api'
import { HandleDirective } from 'vue-slicksort'
import { composeExport } from '../__builtins__/shared'

const ArrayBaseSymbol=
  Symbol('ArrayBaseContext')
const ItemSymbol= Symbol('ItemContext')

const useArray = () => {
  return inject(ArrayBaseSymbol, null)
}

const useIndex = (index) => {
  const { index: indexRef } = toRefs(inject(ItemSymbol))
  return indexRef ?? ref(index)
}

const useRecord = (record) => {
  const { record: recordRef } = toRefs(inject(ItemSymbol))
  return recordRef ?? ref(record)
}

const isObjectValue = (schema) => {
  if (Array.isArray(schema?.items)) return isObjectValue(schema.items[0])

  if (schema?.items?.type === 'array' || schema?.items?.type === 'object') {
    return true
  }
  return false
}

const useKey = (schema) => {
  const isObject = isObjectValue(schema)
  let keyMap = null

  if (isObject) {
    keyMap = new WeakMap()
  } else {
    keyMap = []
  }

  onBeforeUnmount(() => {
    keyMap = null
  })

  return {
    keyMap,
    getKey: (record, index) => {
      if (keyMap instanceof WeakMap) {
        if (!keyMap.has(record)) {
          keyMap.set(record, uid())
        }
        return `${keyMap.get(record)}-${index}`
      }

      if (!keyMap[index]) {
        keyMap[index] = uid()
      }

      return `${keyMap[index]}-${index}`
    },
  }
}

const getSchemaDefaultValue = (schema) => {
  if (schema?.type === 'array') return []
  if (schema?.type === 'object') return {}
  if (schema?.type === 'void') {
    for (let key in schema.properties) {
      const value = getSchemaDefaultValue(schema.properties[key])
      if (isValid(value)) return value
    }
  }
}

const getDefaultValue = (defaultValue, schema) => {
  if (isValid(defaultValue)) return clone(defaultValue)
  if (Array.isArray(schema?.items))
    return getSchemaDefaultValue(schema.items[0])
  return getSchemaDefaultValue(schema.items)
}

const ArrayBaseInner = defineComponent({
  name: 'ArrayBase',
  props: ['disabled', 'keyMap'],
  setup(props, { listeners, slots }) {
    const field = useField()
    const schema = useFieldSchema()
    provide(ArrayBaseSymbol, {
      field,
      schema,
      props,
      listeners,
      keyMap: props.keyMap,
    })
    return () => {
      return h(Fragment, {}, slots)
    }
  },
})

const ArrayBaseItem = defineComponent({
  name: 'ArrayBaseItem',
  props: ['index', 'record'],
  setup(props, { slots }) {
    provide(ItemSymbol, props)
    return () => {
      return h(Fragment, {}, slots)
    }
  },
})

const ArrayBaseSortHandle = defineComponent({
  name: 'ArrayBaseSortHandle',
  props: ['index'],
  directives: {
    handle: HandleDirective,
  },
  setup(props, { attrs }) {
    const array = useArray()
    const prefixCls = `${stylePrefix}-array-base`

    return () => {
      if (!array) return null
      if (array.field.value?.pattern !== 'editable') return null

      return h(
        Icon,
        {
          directives: [{ name: 'handle' }],
          class: [`${prefixCls}-sort-handle`],
          style: attrs.style,
          props: {
            type: 'menu',
          },
          attrs: {
            ...attrs,
          },
        },
        {}
      )
    }
  },
})

const ArrayBaseIndex = defineComponent({
  name: 'ArrayBaseIndex',
  setup(props, { attrs }) {
    const index = useIndex()
    const prefixCls = `${stylePrefix}-array-base`
    return () => {
      return h(
        'span',
        {
          class: `${prefixCls}-index`,
          attrs,
        },
        {
          default: () => [`#${index.value + 1}.`],
        }
      )
    }
  },
})

const ArrayBaseAddition = defineComponent({
  name: 'ArrayBaseAddition',
  props: ['title', 'method', 'defaultValue'],
  setup(props, { listeners }) {
    const self = useField()
    const array = useArray()
    const prefixCls = `${stylePrefix}-array-base`
    return () => {
      if (!array) return null
      if (
        array?.field.value.pattern !== 'editable' &&
        array?.field.value.pattern !== 'disabled'
      )
        return null
      return h(
        Button,
        {
          class: `${prefixCls}-addition`,
          attrs: {
            ...props,
            type: 'dashed',
            block: true,
            disabled: array.field.value?.disabled,
          },
          on: {
            ...listeners,
            click: (e) => {
              if (array.props?.disabled) return
              const defaultValue = getDefaultValue(
                props.defaultValue,
                array?.schema.value
              )
              if (props.method === 'unshift') {
                array?.field?.value.unshift(defaultValue)
                array.listeners?.add?.(0)
              } else {
                array?.field?.value.push(defaultValue)
                array.listeners?.add?.(array?.field?.value?.value?.length - 1)
              }
              if (listeners.click) {
                listeners.click(e)
              }
            },
          },
        },
        {
          default: () => [
            h(Icon, { props: { type: 'plus' } }, {}),
            self.value.title || props.title,
          ],
        }
      )
    }
  },
})

const ArrayBaseRemove = defineComponent({
  name: 'ArrayBaseRemove',
  props: ['title', 'index'],
  setup(props, { attrs, listeners }) {
    const indexRef = useIndex(props.index)
    const base = useArray()
    const prefixCls = `${stylePrefix}-array-base`
    return () => {
      if (base?.field.value.pattern !== 'editable') return null
      return h(
        Icon,
        {
          class: `${prefixCls}-remove`,
          attrs,
          props: {
            type: 'delete',
          },
          on: {
            ...listeners,
            click: (e) => {
              e.stopPropagation()
              if (Array.isArray(base?.keyMap)) {
                base?.keyMap?.splice(indexRef.value, 1)
              }

              base?.field.value.remove(indexRef.value)
              base?.listeners?.remove?.(indexRef.value)

              if (listeners.click) {
                listeners.click(e)
              }
            },
          },
        },
        {}
      )
    }
  },
})

const ArrayBaseMoveDown = defineComponent({
  name: 'ArrayBaseMoveDown',
  props: ['title', 'index'],
  setup(props, { attrs, listeners }) {
    const indexRef = useIndex(props.index)
    const base = useArray()
    const prefixCls = `${stylePrefix}-array-base`
    return () => {
      if (base?.field.value.pattern !== 'editable') return null
      return h(
        Icon,
        {
          class: `${prefixCls}-move-down`,
          attrs,
          props: {
            type: 'down',
          },
          on: {
            ...listeners,
            click: (e) => {
              e.stopPropagation()
              // if (Array.isArray(base?.keyMap)) {
              //   base.keyMap.splice(
              //     indexRef.value + 1,
              //     0,
              //     base.keyMap.splice(indexRef.value, 1)[0]
              //   )
              // }

              // base?.field.value.moveDown(indexRef.value)
              // base?.listeners?.moveDown?.(indexRef.value)

              if (listeners.click) {
                listeners.click(e)
              }
            },
          },
        },
        {}
      )
    }
  },
})

const ArrayBaseMoveUp = defineComponent({
  name: 'ArrayBaseMoveUp',
  props: ['title', 'index'],
  setup(props, { attrs, listeners }) {
    const indexRef = useIndex(props.index)
    const base = useArray()
    const prefixCls = `${stylePrefix}-array-base`
    return () => {
      if (base?.field.value.pattern !== 'editable') return null
      return h(
        Icon,
        {
          class: `${prefixCls}-move-up`,
          attrs,
          props: {
            type: 'up',
          },
          on: {
            ...listeners,
            click: (e) => {
              e.stopPropagation()
              if (Array.isArray(base?.keyMap)) {
                base.keyMap.splice(
                  indexRef.value - 1,
                  0,
                  base.keyMap.splice(indexRef.value, 1)[0]
                )
              }

              base?.field.value.moveUp(indexRef.value)
              base?.listeners?.moveUp?.(indexRef.value)

              if (listeners.click) {
                listeners.click(e)
              }
            },
          },
        },
        {}
      )
    }
  },
})

export const ArrayBase = composeExport(ArrayBaseInner, {
  Index: ArrayBaseIndex,
  Item: ArrayBaseItem,
  SortHandle: ArrayBaseSortHandle,
  Addition: ArrayBaseAddition,
  Remove: ArrayBaseRemove,
  MoveDown: ArrayBaseMoveDown,
  MoveUp: ArrayBaseMoveUp,
  useArray: useArray,
  useIndex: useIndex,
  useKey: useKey,
  useRecord: useRecord,
})

export default ArrayBase
