import { defineComponent, computed } from '@vue/composition-api'
import { h, useField } from '@formily/vue'
import { isArr, isValid } from '@formily/shared'
import {
  createContext,
  resolveComponent,
  useContext,
  composeExport,
} from '../__builtins__/shared'
import { stylePrefix } from '../__builtins__/configs'

import { Tag } from 'ant-design-vue'

import { Space } from '../space'
import { observer } from '@formily/reactive-vue'
import { formatMomentValue } from '../__builtins__'

const prefixCls = `${stylePrefix}-preview-text`
const PlaceholderContext = createContext('N/A')

export const usePlaceholder = (value) => {
  const placeholderCtx = useContext(PlaceholderContext)
  const placeholder = computed(() => {
    return isValid(value) && value !== ''
      ? value
      : resolveComponent(placeholderCtx.value) || 'N/A'
  })

  return placeholder
}

const Select = observer(
  // eslint-disable-next-line vue/one-component-per-file
  defineComponent({
    name: 'PreviewTextSelect',
    props: [],
    setup(_props, { attrs }) {
      const fieldRef = useField()
      const field = fieldRef.value
      const props = attrs
      const placeholder = usePlaceholder()
      const getSelected = () => {
        const value = props.value
        if (props.mode === 'multiple' || props.mode === 'tags') {
          if (props.labelInValue) {
            return isArr(value) ? value : []
          }
          return isArr(value)
            ? value.map((val) => ({ label: val, value: val }))
            : []
        } else {
          if (props.labelInValue) {
            return isValid(value) ? [value] : []
          }
          return isValid(value) ? [{ label: value, value }] : []
        }
      }

      const getLabels = () => {
        const selected = getSelected()
        const dataSource = field?.dataSource?.length
          ? field.dataSource
          : props?.options?.length
          ? props.options
          : []
        if (!selected.length) {
          return h(
            Tag,
            {},
            {
              default: () => placeholder.value,
            }
          )
        }
        return selected.map((target, key) => {
          const text =
            dataSource?.find((item) => item.value == target?.value)?.label ||
            target?.label
          return h(
            Tag,
            {
              key,
            },
            {
              default: () => text || placeholder.value,
            }
          )
        })
      }

      return () => {
        return h(
          Space,
          {
            class: [prefixCls],
            style: attrs.style,
          },
          {
            default: () => getLabels(),
          }
        )
      }
    },
  })
)

// eslint-disable-next-line vue/one-component-per-file
const Input = observer(
  defineComponent({
    name: 'PreviewTextInput',
    setup(_props, { attrs, slots }) {
      return () => {
        const placeholder = usePlaceholder(attrs.value)
        return h(
          Space,
          {
            class: [prefixCls],
            style: attrs.style,
          },
          {
            default: () => [
              slots?.prepend?.(),
              slots?.prefix?.(),
              placeholder.value,
              slots?.suffix?.(),
              slots?.append?.(),
            ],
          }
        )
      }
    },
  })
)

// eslint-disable-next-line vue/one-component-per-file
const Text = defineComponent({
  name: 'PreviewText',
  setup(_props, { attrs }) {
    const placeholder = usePlaceholder()

    return () => {
      return h(
        'div',
        {
          class: [prefixCls],
          style: attrs.style,
        },
        {
          default: () => placeholder.value,
        }
      )
    }
  },
})

const Cascader = observer(
  // eslint-disable-next-line vue/one-component-per-file
  defineComponent({
    name: 'PreviewTextCascader',
    props: [],
    setup(_props, { attrs }) {
      const fieldRef = useField()
      const field = fieldRef.value
      const props = attrs
      const dataSource = field?.dataSource?.length
        ? field.dataSource
        : props?.options?.length
        ? props.options
        : []
      const placeholder = usePlaceholder()
      const getSelected = () => {
        return isArr(props.value) ? props.value : []
      }

      const findLabel = (value, dataSource) => {
        for (let i = 0; i < dataSource?.length; i++) {
          const item = dataSource[i]
          if (item?.value === value) {
            return item?.label
          } else {
            const childLabel = findLabel(value, item?.children)
            if (childLabel) return childLabel
          }
        }
      }

      const getLabels = () => {
        const selected = getSelected()
        if (!selected?.length) {
          return h(
            Tag,
            {},
            {
              default: () => placeholder.value,
            }
          )
        }
        return selected.map((value, key) => {
          const text = findLabel(value, dataSource)
          return h(
            Tag,
            {
              key,
            },
            {
              default: () => text || placeholder.value,
            }
          )
        })
      }

      return () => {
        return h(
          Space,
          {
            class: [prefixCls],
            style: attrs.style,
          },
          {
            default: () => getLabels(),
          }
        )
      }
    },
  })
)

// eslint-disable-next-line vue/one-component-per-file
const TimePicker = defineComponent({
  name: 'PreviewTextTimePicker',
  setup(_props, { attrs }) {
    const props = attrs
    const placeholder = usePlaceholder()
    const getLabels = () => {
      const labels = formatMomentValue(
        props.value,
        props.format,
        placeholder.value
      )
      return isArr(labels) ? labels.join('~') : labels
    }
    return () => {
      return h(
        'div',
        {
          class: [prefixCls],
          style: attrs.style,
        },
        {
          default: () => getLabels(),
        }
      )
    }
  },
})

// eslint-disable-next-line vue/one-component-per-file
const DatePicker = defineComponent({
  name: 'PreviewTextDatePicker',
  setup(_props, { attrs }) {
    const props = attrs
    const placeholder = usePlaceholder()
    const getLabels = () => {
      const labels = formatMomentValue(
        props.value,
        props.format,
        placeholder.value
      )
      return isArr(labels) ? labels.join('~') : labels
    }
    return () => {
      return h(
        'div',
        {
          class: [prefixCls],
          style: attrs.style,
        },
        {
          default: () => getLabels()
        }
      )
    }
  },
})

// eslint-disable-next-line vue/one-component-per-file
const DateRangePicker = defineComponent({
  name: 'PreviewTextDatePicker',
  setup(_props, { attrs }) {
    const props = attrs
    const placeholder = usePlaceholder()
    const getLabels = () => {
      const labels = formatMomentValue(
        props.value,
        props.format,
        placeholder.value
      )
      return isArr(labels) ? labels.join('~') : labels
    }
    return () => {
      return h(
        'div',
        {
          class: [prefixCls],
          style: attrs.style,
        },
        {
          default: () => getLabels(),
        }
      )
    }
  },
})

export const PreviewText = composeExport(Text, {
  Input,
  Select,
  Cascader,
  DatePicker,
  DateRangePicker,
  TimePicker,
  Placeholder: PlaceholderContext.Provider,
  usePlaceholder,
})

export default PreviewText
