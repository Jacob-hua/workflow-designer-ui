import {
  provide,
  inject,
  defineComponent,
  ref,
  watch,
} from '@vue/composition-api'
import { h } from '@formily/vue'
import { stylePrefix } from '../__builtins__/configs'
import { useResponsiveFormLayout } from './useResponsiveFormLayout'

export const FormLayoutDeepContext = Symbol(
  'FormLayoutDeepContext'
)

export const FormLayoutShallowContext =
  Symbol('FormLayoutShallowContext')

export const useFormDeepLayout = () =>
  inject(FormLayoutDeepContext, ref({}))

export const useFormShallowLayout = () =>
  inject(FormLayoutShallowContext, ref({}))

export const useFormLayout = () => {
  const shallowLayout = useFormShallowLayout()
  const deepLayout = useFormDeepLayout()
  const formLayout = ref({
    ...deepLayout.value,
    ...shallowLayout.value,
  })

  watch(
    [shallowLayout, deepLayout],
    () => {
      formLayout.value = {
        ...deepLayout.value,
        ...shallowLayout.value,
      }
    },
    {
      deep: true,
    }
  )
  return formLayout
}

export const FormLayout = defineComponent({
  name: 'FFormLayout',
  props: {
    className: {},
    colon: { default: true },
    labelAlign: {},
    wrapperAlign: {},
    labelWrap: { default: false },
    labelWidth: {},
    wrapperWidth: {},
    wrapperWrap: { default: false },
    labelCol: {},
    wrapperCol: {},
    fullness: { default: false },
    size: { default: 'default' },
    layout: { default: 'horizontal' },
    direction: { default: 'ltr' },
    shallow: { default: true },
    feedbackLayout: {},
    tooltipLayout: {},
    bordered: { default: true },
    inset: { default: false },
    breakpoints: {},
    spaceGap: {},
    gridColumnGap: {},
    gridRowGap: {},
  },
  setup(customProps, { slots, refs }) {
    const { props } = useResponsiveFormLayout(customProps, refs)

    const deepLayout = useFormDeepLayout()
    const newDeepLayout = ref({
      ...deepLayout,
    })
    const shallowProps = ref({})

    watch(
      [props, deepLayout],
      () => {
        shallowProps.value = props.value.shallow ? props.value : undefined
        if (!props.value.shallow) {
          Object.assign(newDeepLayout.value, props.value)
        } else {
          if (props.value.size) {
            newDeepLayout.value.size = props.value.size
          }
          if (props.value.colon) {
            newDeepLayout.value.colon = props.value.colon
          }
        }
      },
      { deep: true, immediate: true }
    )

    provide(FormLayoutDeepContext, newDeepLayout)
    provide(FormLayoutShallowContext, shallowProps)

    const formPrefixCls = `${stylePrefix}-form`
    return () => {
      const classNames = {
        [`${formPrefixCls}-${props.value.layout}`]: true,
        [`${formPrefixCls}-rtl`]: props.value.direction === 'rtl',
        [`${formPrefixCls}-${props.value.size}`]:
          props.value.size !== undefined,
        [`${props.value.className}`]: props.value.className !== undefined,
      }
      return h(
        'div',
        {
          ref: 'root',
          class: classNames,
        },
        slots
      )
    }
  },
})

export default FormLayout
