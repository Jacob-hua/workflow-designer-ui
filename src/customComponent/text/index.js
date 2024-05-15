import { h } from "@formily/vue";
import { observer } from '@formily/reactive-vue'
import { defineComponent } from "@vue/composition-api";

export const Text = observer(defineComponent({
  name: 'Text',
  props: ['value', 'content', 'mode'],
  setup(props) {
    return() => {
      const tagName = props.mode === 'normal' || !props.mode ? 'div' : props.mode
      return h(
        tagName,
        {},
        {
          default: () => props.value || props.content
        }
      )
    }
  }
}))

export default Text