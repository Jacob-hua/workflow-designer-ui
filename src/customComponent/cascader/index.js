import { connect, mapProps, mapReadPretty, h } from '@formily/vue';
import { Cascader as AntdCascader, Icon } from 'ant-design-vue';
import { PreviewText } from '../preview-text';

export const Cascader = connect(
  AntdCascader,
  mapProps(
    {
      dataSource: 'options',
    },
    (props, field) => {
      return {
        ...props,
				changeOnSelect: true,
        suffixIcon:
          field?.['loading'] || field?.['validating']
            ? h(Icon, { props: { type: 'loading' } }, {})
            : props.suffixIcon,
        getPopupContainer: (trigger) => trigger.parentNode,
      };
    }
  ),
  mapReadPretty(PreviewText.Cascader)
);

export default Cascader;
