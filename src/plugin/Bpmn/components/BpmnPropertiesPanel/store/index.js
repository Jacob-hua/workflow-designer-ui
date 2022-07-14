import { moduleFactory } from '../../../utils/vuex'

const requireModule = require.context('./module', false, /\.js$/)

export default moduleFactory(requireModule)
