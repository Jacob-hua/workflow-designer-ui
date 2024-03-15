<template>
  <div>
    <FormProvider :form="form">
      <SchemaField :schema="schema"></SchemaField>
    </FormProvider>
  </div>
</template>

<script>
import { createForm } from '@formily/core';
import { FormProvider, createSchemaField } from '@formily/vue';
import {
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
  Upload,
  FormGrid,
  FormLayout,
  FormTab,
  FormCollapse,
  ArrayTable,
  ArrayCards,
  FormButtonGroup,
} from '@formily/antdv';
import { Card, Rate, Slider } from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

const { SchemaField } = createSchemaField({
  components: {
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
  },
  data() {
    return {
      form: createForm(),
      // schema: {"type":"object","properties":{"7v0aueuumhj":{"type":"string","title":"姓名","x-decorator":"FormItem","x-component":"Input","x-validator":[],"x-component-props":{},"x-decorator-props":{},"x-designable-id":"7v0aueuumhj","x-index":0},"tkadvzx2qql":{"type":"string","title":"年龄","x-decorator":"FormItem","x-component":"Input","x-validator":[],"x-component-props":{},"x-decorator-props":{},"x-designable-id":"tkadvzx2qql","x-index":1},"3nfulsiev4o":{"type":"string","title":"人员","x-decorator":"FormItem","x-component":"Input","x-validator":[],"x-component-props":{},"x-decorator-props":{},"x-designable-id":"3nfulsiev4o","x-index":2},"1bwhldi172u":{"title":"人员列表","x-decorator":"FormItem","x-component":"Select","x-validator":[],"x-component-props":{"mode":"multiple"},"x-decorator-props":{},"enum":[{"children":[],"label":"张三","value":"2455"},{"children":[],"label":"李四","value":"2458"},{"children":[],"label":"王五","value":"2456"}],"x-designable-id":"1bwhldi172u","x-index":3}},"x-designable-id":"35uv0s6fiti"}
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
};
</script>
<style scoped></style>
