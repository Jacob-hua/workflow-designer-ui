function emptyAction() {
  console.warn("Current execute action is empty!")
}

class Actions {
	actions = {
		onGlobalStateChange: emptyAction,
		setGlobalState: emptyAction
	}
	constructor() {}
	setActions(actions) {
		this.actions = actions
	}
	onGlobalStateChange(...args) {
    // 接收主应用传递来的参数
    console.log('子应用接收主应用的参数', args)
		return this.actions.onGlobalStateChange(...args)
	}
	setGlobalState(...args) {
		return this.actions.setGlobalState(...args)
	}
}
const actions = new Actions()
export default actions
