import { connect, mapProps, mapReadPretty, h } from '@formily/vue'
import {
  composeExport,
  transformComponent,
  resolveComponent,
} from '../__builtins__/shared'
import { PreviewText } from '../preview-text'
import { Radio as AntdRadio } from 'ant-design-vue'
import { defineComponent } from '@vue/composition-api'
import './style.less'

const { Button, Group } = AntdRadio

const TransformRadioGroup = transformComponent(Group, {
  change: 'input',
})

const RadioGroupOption = defineComponent({
  name: 'Radio',
  props: {
    options: {
      type: Array,
      default: () => [],
    },
    optionType: {
      type: String,
      default: 'default',
    },
  },
  setup(customProps, { attrs, slots, listeners }) {
    return () => {
      const options = customProps.options || []
      const OptionType =
        customProps.optionType === 'button' ? Button : AntdRadio
      const children =
        options.length !== 0
          ? {
              default: () =>
                options.map((option) => {
                  if (typeof option === 'string') {
                    return h(
                      OptionType,
                      { props: { value: option } },
                      {
                        default: () => [
                          resolveComponent(slots?.option ?? option, { option }),
                        ],
                      }
                    )
                  } else {
                    return h(
                      OptionType,
                      {
                        props: {
                          ...option,
                          value: option.value,
                          label: option.label,
                        },
                      },
                      {
                        default: () => [
                          resolveComponent(slots?.option ?? option.label, {
                            option,
                          }),
                        ],
                      }
                    )
                  }
                }),
            }
          : slots
      return h(
        TransformRadioGroup,
        {
          attrs: {
            ...attrs,
          },
          on: listeners,
        },
        children
      )
    }
  },
})

export const Radio = connect(
  RadioGroupOption,
  mapProps({ dataSource: 'options' }),
  mapReadPretty(PreviewText.Select)
)

// export const Radio = composeExport(AntdRadio, {
//   Group: RadioGroup,
// })

export default Radio
