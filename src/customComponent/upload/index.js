import { connect, mapProps, h } from '@formily/vue';
import { Upload as AntdUpload, Button, Icon } from 'ant-design-vue';
import { composeExport } from '../__builtins__';
import { defineComponent } from '@vue/composition-api';

const UploadWrapper = defineComponent({
  name: 'UploadWrapper',
  setup(props, { slots, attrs, listeners, emit }) {
    // const UploadFile = (e) => {
    //   e.onSuccess('success', e);
    // };
    return () => {
      // const children = {
      //   ...slots,
      // }
      const children = h(
        Button,
        {
          attrs: {
            disabled: attrs.disabled,
          },
        },
        {
          default: () => [
            h(Icon, { props: { type: 'upload' } }, {}),
            attrs.textContent || '上传',
          ],
        }
      );
      return h(
        AntdUpload,
        {
          attrs: {
            ...attrs,
            action: '#',
            accept: Array.isArray(attrs.accept)
              ? attrs.accept.join()
              : attrs.accept,
            // customRequest: UploadFile,
          },
          on: {
            ...listeners,
            change: ({ fileList }) => {
              attrs.onChange?.(fileList);
              emit('change', fileList);
            },
          },
        },
        { default: () => children }
      );
    };
  },
});

export const Upload = connect(
  UploadWrapper,
  mapProps({
    value: 'fileList',
    onInput: 'onChange',
  })
);

export default Upload;
