import { connect, mapProps, mapReadPretty } from '@formily/vue';
import { DatePicker as AntdDatePicker } from 'ant-design-vue';
import { formatMomentValue } from '../__builtins__';
import { PreviewText } from '../preview-text';
import moment from 'moment'

const mapDateFormat = function () {
  const getDefaultFormat = (props) => {
    const picker = props?.picker;
    const precision = props?.precision;
    if (picker === 'date_time') {
      return 'YYYY-MM-DD HH:mm';
    }
    if (picker === 'time') {
      return precision;
    }
    return 'YYYY-MM-DD';
    // if (props['mode'] === 'month') {
    //   return 'YYYY-MM'
    // } else if (props['mode'] === 'quarter') {
    //   return 'YYYY-\\QQ'
    // } else if (props['mode'] === 'year') {
    //   return 'YYYY'
    // } else if (props['mode'] === 'week') {
    //   return 'gggg-wo'
    // }
    // return props['showTime'] ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD'
  };

  const getPlaceholder = (props) => {
    const picker = props?.picker;
    if (picker === 'date_time') {
      return ['请选择开始日期时间', '请选择结束日期时间'];
    }
    if (picker === 'time') {
      return ['请选择开始时间', '请选择结束时间'];
    }
    return ['请选择开始日期', '请选择结束日期'];
  };

  const getShowTime = (props) => {
    const picker = props?.picker;
    const precision = props?.precision;
    if (picker === 'time') {
      return { format: precision };
    }
    if (picker === 'date_time') {
      return { format: 'HH:mm' };
    }
    return false;
  };

  return (props) => {
    const format = props['format'] || getDefaultFormat(props);
    const onChange = props.onChange;
    const mode = props.picker === 'time' ? ['time', 'time'] : ['date', 'date'];
    const placeholder = getPlaceholder(props);
    const showTime = getShowTime(props);
    const defaultValue = props.value ? props.value.map((val) => moment(val)) : null;
    return {
      ...props,
      value: defaultValue,
      mode: mode,
      format: format,
      placeholder,
      showTime,
      valueFormat: format,
      on: {
        change: (value) => {
          if (onChange) {
            onChange(formatMomentValue(value, format));
          }
        },
      },
      getCalendarContainer: (trigger) => trigger.parentNode,
    };
  };
};

export const RangePicker = connect(
  AntdDatePicker.RangePicker,
  mapProps(mapDateFormat()),
  mapReadPretty(PreviewText.DateRangePicker)
);

export default RangePicker;
