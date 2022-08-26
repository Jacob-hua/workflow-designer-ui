import CustomPalette from './CustomPalette'
import CustomContextPad from './CustomContextPad'
// import CustomRenderer from './CustomRenderer'

export default {
  __init__: ['customPalette', 'customContextPad'],
  customPalette: ['type', CustomPalette],
  customContextPad: ['type', CustomContextPad],
}
// export default {
//   __init__: ['customPalette', 'customRenderer', 'customContextPad'],
//   customPalette: ['type', CustomPalette],
//   customRenderer: ['type', CustomRenderer],
//   customContextPad: ['type', CustomContextPad],
// }
