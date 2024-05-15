<template>
  <div>
    <FormProvider :form="form">
      <SchemaField :schema="JsonSchema"></SchemaField>
    </FormProvider>
  </div>
</template>

<script>
import { createForm } from '@formily/core';
import { FormProvider, createSchemaField } from '@formily/vue';
import {
  Form,
  FormItem,
  DatePicker,
  Checkbox,
  Cascader,
  Editable,
  Input,
  InputNumber as NumberPicker,
  Switch,
  Password,
  PreviewText,
  Radio,
  Reset,
  Select,
  Space,
  Submit,
  TimePicker,
  Transfer,
  TreeSelect,
  FormGrid,
  FormLayout,
  FormTab,
  FormCollapse,
  ArrayTable,
  // ArrayCards,
  FormButtonGroup,
} from '@formily/antdv';
import { ArrayCards, Text } from '../customComponent';
import { Card, Rate, Slider, Card as Display, Upload } from 'ant-design-vue';
// import 'ant-design-vue/dist/antd.less';
import _ from 'lodash';

const { SchemaField } = createSchemaField({
  components: {
    Form,
    FormItem,
    DatePicker,
    Checkbox,
    Cascader,
    Editable,
    Input,
    NumberPicker,
    Switch,
    Password,
    PreviewText,
    Radio,
    Reset,
    Select,
    Space,
    Submit,
    TimePicker,
    Transfer,
    TreeSelect,
    Upload,
    FormGrid,
    FormLayout,
    FormTab,
    FormCollapse,
    ArrayTable,
    ArrayCards,
    FormButtonGroup,
    Card,
    Rate,
    Slider,
    Display,
    Text,
  },
});
export default {
  name: 'FormPreview',
  components: {
    FormProvider,
    SchemaField,
  },
  props: {
    formTree: {
      type: Object,
      default: () => ({}),
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    initialValues: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      form: createForm(),
      JsonSchema: {},
    };
  },
  computed: {
    formProps() {
      return this.formTree.form;
    },
    schema() {
      return this.formTree.schema;
    },
  },
  methods: {
    handleSchema(schema) {
      this.JsonSchema = handleDisplayComp(schema);

      function handleDisplayComp(obj) {
        let childObj = obj;
        if (!obj.hasOwnProperty('properties')) {
          if (obj['x-component'] === 'Display') {
            childObj = {
              ...obj,
              type: 'void',
              'x-component': 'Card',
              'x-component-props': {
                title: '知识库组件',
                style: {
                  margin: '0px 0px 10px 0px',
                  backgroundColor: 'rgba(0,0,0,1)',
                  borderColor: 'rgba(0,0,0,1)',
                },
              },
            };
          }
        } else {
          for (let [key, value] of Object.entries(obj.properties)) {
            childObj.properties[key] = handleDisplayComp(value);
          }
        }
        return childObj;
      }
    },
  },
  watch: {
    schema: {
      handler(val) {
        if (!val) return;
        this.JsonSchema = val;
        this.form = createForm({
          disabled: this.disabled,
          values: this.initialValues,
        });
        this.handleSchema(val);
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>
<style scoped></style>
