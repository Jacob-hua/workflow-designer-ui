import { Card, Icon, Space } from 'ant-design-vue';
import {
  useField,
  useFieldSchema,
  RecursionField,
  h,
  Fragment,
} from '@formily/vue';
import { isValid, clone } from '@formily/shared';
import { observer } from '@formily/reactive-vue';
import { stylePrefix } from '../__builtins__/configs';
import { defineComponent, ref } from '@vue/composition-api';

const isAdditionComponent = (schema) => {
  return schema['x-component']?.indexOf('Addition') > -1;
};

const isIndexComponent = (schema) => {
  return schema['x-component']?.indexOf('Index') > -1;
};

const isRemoveComponent = (schema) => {
  return schema['x-component']?.indexOf('Remove') > -1;
};

const isMoveUpComponent = (schema) => {
  return schema['x-component']?.indexOf('MoveUp') > -1;
};

const isMoveDownComponent = (schema, foldable) => {
  return schema['x-component']?.indexOf('MoveDown') > -1 && foldable;
};

const isOperationComponent = (schema, foldable = true) => {
  return (
    isAdditionComponent(schema) ||
    isRemoveComponent(schema) ||
    isMoveDownComponent(schema, foldable) ||
    isMoveUpComponent(schema)
  );
};

const getSchemaDefaultValue = (schema) => {
  if (schema?.type === 'array') return [];
  if (schema?.type === 'object') return {};
  if (schema?.type === 'void') {
    for (let key in schema.properties) {
      const value = getSchemaDefaultValue(schema.properties[key]);
      if (isValid(value)) return value;
    }
  }
};

const getDefaultValue = (defaultValue, schema) => {
  if (isValid(defaultValue)) return clone(defaultValue);
  if (Array.isArray(schema?.items))
    return getSchemaDefaultValue(schema.items[0]);
  return getSchemaDefaultValue(schema.items);
};

export const ArrayCards = observer(
  defineComponent({
    name: 'ArrayCards',
    props: ['title', 'addable', 'foldable', 'disabled'],
    setup(props, { attrs }) {
      const fieldRef = useField();
      const schemaRef = useFieldSchema();
      const prefixCls = `${stylePrefix}-array-cards`;
      const foldedList = ref([false]);
      return () => {
        // const props = { ...attrs };
        const field = fieldRef.value;
        const schema = schemaRef.value;
        const dataSource = Array.isArray(field.value)
          ? field.value
          : getDefaultValue(props.defaultValue, schema);
        dataSource?.forEach((item, index) => {
          foldedList.value.splice(index, 1, false);
        });
        if (!schema) throw new Error('can not found schema object');
        const renderItems = () => {
          return dataSource?.map((item, index) => {
            const items = Array.isArray(schema.items)
              ? schema.items[index] || schema.items[0]
              : schema.items;

            const title = h(
              'span',
              {},
              {
                default: () => [
                  h(
                    'span',
                    {
                      class: `${prefixCls}-index`,
                    },
                    {
                      default: () => [`#${index.value + 1}.`],
                    }
                  ),
                  props.title || field.title,
                ],
              }
            );
            const extra = h(
              'span',
              {},
              {
                default: () => [
                  h(
                    Icon,
                    {
                      class: `${prefixCls}-remove`,
                      props: {
                        type: 'delete',
                      },
                      on: {
                        click: (e) => {
                          if (props.disabled) return;
                          e.stopPropagation();
                          field?.remove?.(index);
                          props?.onRemove?.(index);
                          if (props.click) {
                            props.click(e);
                          }
                        },
                      },
                    },
                    {}
                  ),
                  props.foldable && !foldedList.value[index]
                    ? h(
                        Icon,
                        {
                          class: `${prefixCls}-fold`,
                          props: { type: 'down' },
                          on: {
                            click: (e) => {
                              if (props.disabled) return;
                              e.stopPropagation();
                              foldedList.value[index] = true;
                              if (props.click) {
                                props.click(e);
                              }
                            },
                          },
                        },
                        {}
                      )
                    : null,
                  props.foldable && foldedList.value[index]
                    ? h(
                        Icon,
                        {
                          class: `${prefixCls}-fold`,
                          props: { type: 'right' },
                          on: {
                            click: (e) => {
                              if (props.disabled) return;
                              e.stopPropagation();
                              foldedList.value[index] = false;
                              if (props.click) {
                                props.click(e);
                              }
                            },
                          },
                        },
                        {}
                      )
                    : null,
                  props.title || field.title,
                ],
              }
            );

            const content = h(
              RecursionField,
              {
                props: {
                  schema: items,
                  name: index,
                  filterProperties: (schema) => {
                    if (isIndexComponent(schema)) return false;
                    if (isOperationComponent(schema)) return false;
                    return true;
                  },
                },
              },
              {}
            );

            const propKeys = Object.keys(props);
            let properties = JSON.parse(JSON.stringify(props));
            propKeys.forEach((item) => {
              if (item === 'addable' || item === 'foldable') {
                delete properties[item];
              }
            });

            return h(
              Card,
              {
                class: `${prefixCls}-item`,
                attrs: {
                  key: index,
                },
              },
              {
                title: () => title,
                extra: () => extra,
                default: () =>
                  foldedList.value[index] ? h('div', {}, {}) : content,
              }
            );
          });
        };

        const renderAddition = () => {
          if (props.addable) {
            return h(
              Button,
              {
                class: `${prefixCls}-fold`,
                attrs: {
                  type: 'dashed',
                  block: true,
                  disabled: props.disabled,
                },
                on: {
                  click: (e) => {
                    if (props.disabled) return;
                    const defaultValue = getDefaultValue(
                      props.defaultValue,
                      schema
                    );
                    field?.push(defaultValue);
                    props?.onAdd?.(field?.value?.length - 1);
                    if (props.click) {
                      props.click(e);
                    }
                  },
                },
              },
              {
                default: () => [h(Icon, { props: { type: 'plus' } }, {}), 复制],
              }
            );
          }
          return null;
        };

        const renderEmpty = () => {
          if (dataSource?.length) return;
          const items = Array.isArray(schema.items)
            ? schema.items[0]
            : schema.items;

          const title = h(
            'span',
            {},
            {
              default: () => [
                h(
                  'span',
                  {
                    class: `${prefixCls}-index`,
                  },
                  {
                    default: () => [`#1.`],
                  }
                ),
                props.title || field.title,
              ],
            }
          );
          const extra = h(
            'span',
            {},
            {
              default: () => [
                h(
                  Icon,
                  {
                    class: `${prefixCls}-remove`,
                    props: {
                      type: 'delete',
                    },
                    on: {
                      click: (e) => {
                        if (props.disabled) return;
                        e.stopPropagation();
                        field?.remove?.(0);
                        props?.onRemove?.(0);
                        if (props.click) {
                          props.click(e);
                        }
                      },
                    },
                  },
                  {}
                ),
                props.foldable && !foldedList.value[0]
                  ? h(
                      Icon,
                      {
                        class: `${prefixCls}-fold`,
                        props: { type: 'down' },
                        on: {
                          click: (e) => {
                            if (props.disabled) return;
                            e.stopPropagation();
                            foldedList.value[0] = true;
                            if (props.click) {
                              props.click(e);
                            }
                          },
                        },
                      },
                      {}
                    )
                  : null,
                props.foldable && foldedList.value[0]
                  ? h(
                      Icon,
                      {
                        class: `${prefixCls}-fold`,
                        props: { type: 'right' },
                        on: {
                          click: (e) => {
                            if (props.disabled) return;
                            e.stopPropagation();
                            foldedList.value[0] = false;
                            if (props.click) {
                              props.click(e);
                            }
                          },
                        },
                      },
                      {}
                    )
                  : null,
                props.title || field.title,
              ],
            }
          );

          const content = h(
            RecursionField,
            {
              props: {
                schema: items,
                name: 0,
                filterProperties: (schema) => {
                  if (isIndexComponent(schema)) return false;
                  if (isOperationComponent(schema)) return false;
                  return true;
                },
              },
            },
            {}
          );

          const propKeys = Object.keys(props);
          let properties = JSON.parse(JSON.stringify(props));
          propKeys.forEach((item) => {
            if (item === 'addable' || item === 'foldable') {
              delete properties[item];
            }
          });

          return h(
            Card,
            {
              class: `${prefixCls}-item`,
              attrs: {
                key: 0,
              },
            },
            {
              title: () => title,
              extra: () => extra,
              default: () => (foldedList.value[0] ? h('div', {}, {}) : content),
            }
          );
        };

        return h(
          Fragment,
          {},
          {
            default: () => [renderEmpty(), renderItems(), renderAddition()],
          }
        );
      };
    },
  })
);

export default ArrayCards;
