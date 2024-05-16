import { composeExport, transformComponent } from '../__builtins__/shared'
import { connect, mapProps, mapReadPretty } from '@formily/vue'
import { PreviewText } from '../preview-text'
import { Input as AntInput } from 'ant-design-vue'

const AntTextArea = AntInput.TextArea
const TransformElInput = transformComponent(AntTextArea, {
  change: 'input',
})

export const TextArea = connect(
  TransformElInput,
  mapProps((props) => {
    return {
      ...props
    }
  }),
  mapReadPretty(PreviewText.Input)
)

// export const TextArea = connect(
//   InnerInput,
//   mapProps((props) => {
//     return {
//       ...props,
//       type: 'textarea',
//     }
//   }),
//   mapReadPretty(PreviewText.Input)
// )

// export const Input = composeExport(InnerInput, {
//   TextArea,
// })

export default TextArea
