function convertListener(listener) {
  console.log(listener);
}

export default {
  "selection.changed": ({ newSelection }, commit) => {
    if (Array.isArray(newSelection) && newSelection[0]) {
      convertListener(newSelection[0]?.businessObject)
      commit("refreshState", newSelection[0]?.businessObject);
    } else {
      commit("initState");
    }
  },
  "shape.changed": ({ element }, commit) => {
    if (!element) {
      return;
    }
    commit("refreshState", element.businessObject);
  },
};
