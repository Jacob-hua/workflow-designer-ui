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
  Upload,
  FormGrid,
  FormLayout,
  FormTab,
  FormCollapse,
  ArrayTable,
  ArrayCards,
  FormButtonGroup,
} from '@formily/antdv';
import { Card, Rate, Slider, Card as Display } from 'ant-design-vue';
import 'ant-design-vue/dist/antd.less';

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
  watch: {
    schema() {
      this.form = createForm({
        disabled: this.disabled,
        values: this.initialValues,
      });
    },
  },
};
</script>
<style scoped></style>
