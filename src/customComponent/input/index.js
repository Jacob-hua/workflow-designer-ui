import { composeExport, transformComponent } from '../__builtins__/shared'
import { connect, mapProps, mapReadPretty } from '@formily/vue'
import { PreviewText } from '../preview-text'
import { Input as AntInput } from 'ant-design-vue'

// const TransformElInput = transformComponent(AntInput, {
//   change: 'input',
// })

const Input = connect(
  AntInput,
  mapProps((props) => {
    return {
      ...props,
      type: 'text',
      readOnly: 'read-only' 
    }
  }),
  mapReadPretty(PreviewText.Input)
)

// const TextArea = connect(
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

export default Input
