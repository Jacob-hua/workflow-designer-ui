import { Card, Empty } from 'ant-design-vue';
import { useField, useFieldSchema, RecursionField, h } from '@formily/vue';
import { observer } from '@formily/reactive-vue';
import { stylePrefix } from '../__builtins__/configs';
import { ArrayBase } from '../array-base';
import { composeExport } from '../__builtins__/shared';
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

const ArrayCardsInner = observer(
  defineComponent({
    name: 'ArraryCards',
    // props: [],
    setup(props, { attrs }) {
      const fieldRef = useField();
      const schemaRef = useFieldSchema();
      const prefixCls = `${stylePrefix}-array-cards`;
      const { getKey, keyMap } = ArrayBase.useKey(schemaRef.value);
      const foldedList = ref([false]);
      const setFoleded = (status, index) => {
        foldedList.value.splice(index, 1, status);
      };
      const addFoleded = () => {
        foldedList.value.push(false);
      };

      const deleteFoleded = (index) => {
        foldedList.value.splice(index, 1);
      };

      return () => {
        // const props = { ...attrs, title: props.title };
        const field = fieldRef.value;
        const schema = schemaRef.value;
        const dataSource = Array.isArray(field.value) ? field.value : [];
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
                    RecursionField,
                    {
                      props: {
                        schema: items,
                        name: index,
                        filterProperties: (schema) => {
                          if (!isIndexComponent(schema)) return false;
                          return true;
                        },
                        onlyRenderProperties: true,
                      },
                    },
                    {}
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
                    RecursionField,
                    {
                      props: {
                        schema: items,
                        name: index,
                        filterProperties: (schema) => {
                          if (!isOperationComponent(schema, props.foldable))
                            return false;
                          return true;
                        },
                        onlyRenderProperties: true,
                      },
                    },
                    {}
                  ),
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

            return h(
              ArrayBase.Item,
              {
                key: getKey(item, index),
                props: {
                  index,
                  record: item,
                  setFoleded,
                  addFoleded,
                  deleteFoleded,
                  foldedList: foldedList.value
                },
              },
              {
                default: () =>
                  h(
                    Card,
                    {
                      class: [`${prefixCls}-item`],
                      attrs,
                    },
                    {
                      default: () => (foldedList.value[index] ? '' : content),
                      title: () => title,
                      extra: () => extra,
                    }
                  ),
              }
            );
          });
        };

        const renderAddition = () => {
          return schema.reduceProperties((addition, schema, key) => {
            if (isAdditionComponent(schema) && props.addable) {
              return h(
                RecursionField,
                {
                  props: {
                    schema,
                    name: key,
                  },
                },
                {}
              );
            }
            return addition;
          }, null);
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
                  RecursionField,
                  {
                    props: {
                      schema: items,
                      name: 0,
                      filterProperties: (schema) => {
                        if (!isIndexComponent(schema)) return false;
                        return true;
                      },
                      onlyRenderProperties: true,
                    },
                  },
                  {}
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
                  RecursionField,
                  {
                    props: {
                      schema: items,
                      name: 0,
                      filterProperties: (schema) => {
                        if (!isOperationComponent(schema, props.foldable))
                          return false;
                        return true;
                      },
                      onlyRenderProperties: true,
                    },
                  },
                  {}
                ),
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

          return h(
            ArrayBase.Item,
            {
              key: getKey(items, 0),
              props: {
                index: 0,
                record: items,
                setFoleded,
                addFoleded,
                deleteFoleded,
              },
            },
            {
              default: () =>
                h(
                  Card,
                  {
                    class: [`${prefixCls}-item`],
                    attrs,
                  },
                  {
                    default: () => (foldedList.value[0] ? '' : content),
                    title: () => title,
                    extra: () => extra,
                  }
                ),
            }
          );
        };

        return h(
          ArrayBase,
          { props: { keyMap } },
          {
            default: () => [renderEmpty(), renderItems(), renderAddition()],
          }
        );
      };
    },
  })
);

export const ArrayCards = composeExport(ArrayCardsInner, {
  Index: ArrayBase.Index,
  SortHandle: ArrayBase.SortHandle,
  Addition: ArrayBase.Addition,
  Remove: ArrayBase.Remove,
  MoveDown: ArrayBase.MoveDown,
  MoveUp: ArrayBase.MoveUp,
  useArray: ArrayBase.useArray,
  useIndex: ArrayBase.useIndex,
  useRecord: ArrayBase.useRecord,
});

export default ArrayCards;
