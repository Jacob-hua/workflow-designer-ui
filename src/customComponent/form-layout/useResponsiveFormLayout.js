import { isArr, isValid } from '@formily/shared'
import { onMounted, ref } from 'vue-demi'

const calcBreakpointIndex = (breakpoints, width) => {
  for (let i = 0; i < breakpoints.length; i++) {
    if (width <= breakpoints[i]) {
      return i
    }
  }
}

const calcFactor = (value, breakpointIndex) => {
  if (Array.isArray(value)) {
    if (breakpointIndex === -1) return value[0]
    return value[breakpointIndex] ?? value[value.length - 1]
  } else {
    return value
  }
}

const factor = (value, breakpointIndex) =>
  isValid(value) ? calcFactor(value, breakpointIndex) : value

const calculateProps = (target, props) => {
  const { clientWidth } = target
  const {
    breakpoints,
    layout,
    labelAlign,
    wrapperAlign,
    labelCol,
    wrapperCol,
    ...otherProps
  } = props
  const breakpointIndex = calcBreakpointIndex(breakpoints, clientWidth)

  return {
    layout: factor(layout, breakpointIndex),
    labelAlign: factor(labelAlign, breakpointIndex),
    wrapperAlign: factor(wrapperAlign, breakpointIndex),
    labelCol: factor(labelCol, breakpointIndex),
    wrapperCol: factor(wrapperCol, breakpointIndex),
    ...otherProps,
  }
}

export const useResponsiveFormLayout = (
  props,
  refs
) => {
  const root = ref(null)
  const { breakpoints } = props
  if (!isArr(breakpoints)) {
    return { props: ref(props) }
  }
  const layoutProps = ref({})

  const updateUI = () => {
    layoutProps.value = calculateProps(root.value, props)
  }

  onMounted(() => {
    root.value = refs.root
    const observer = () => {
      updateUI()
    }
    const resizeObserver = new ResizeObserver(observer)
    if (root.value) {
      resizeObserver.observe(root.value)
    }

    updateUI()

    return () => {
      resizeObserver.disconnect()
    }
  })

  return {
    props: layoutProps,
  }
}
