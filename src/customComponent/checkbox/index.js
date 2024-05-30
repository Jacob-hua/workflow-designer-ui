import { connect, mapProps, mapReadPretty } from '@formily/vue'
import { Checkbox as AntdCheckbox } from 'ant-design-vue'
import { PreviewText } from '../preview-text'
const { Group } = AntdCheckbox

export const Checkbox = connect(
  Group,
  mapProps({
    dataSource: 'options',
  }),
  mapReadPretty(PreviewText.Select, {
    mode: 'tags',
  })
)

// const _CheckBox = connect(
//   AntdCheckbox,
//   mapProps({
//     value: 'checked',
//     onInput: 'onChange',
//   })
// )

// export const Checkbox = composeExport(_CheckBox, {
//   Group: CheckboxGroup,
// })

export default Checkbox
