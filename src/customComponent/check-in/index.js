import { h } from "@formily/vue";
import { observer } from '@formily/reactive-vue'
import { defineComponent } from "@vue/composition-api";
import { Card } from "ant-design-vue";

export const CheckIn = observer(defineComponent({
  name: 'CheckIn',
  setup(props){
    return () => {
      const title = '打卡组件'
      return h(
        Card,
        {
          attrs: {
            title
          }
        },
        {}
      )
    }
  }
}))

export default CheckIn