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
    // if (props['picker'] === 'month') {
    //   return 'YYYY-MM'
    // } else if (props['picker'] === 'quarter') {
    //   return 'YYYY-\\QQ'
    // } else if (props['picker'] === 'year') {
    //   return 'YYYY'
    // } else if (props['picker'] === 'week') {
    //   return 'gggg-wo'
    // }
    // return props['showTime'] ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD'
  };

  const getPlaceholder = (props) => {
    const picker = props?.picker;
    if (picker === 'date_time') {
      return '请选择日期时间';
    }
    if (picker === 'time') {
      return '请选择时间';
    }
    return '请选择日期';
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
    const format = getDefaultFormat(props);
    const onChange = props.onChange;
    const mode = props.picker === 'time' ? 'time' : undefined;
    const placeholder = getPlaceholder(props);
    const showTime = getShowTime(props);
    const defaultValue = moment(props?.value) || null
    return mode ? {
      ...props,
      value: defaultValue,
      mode: mode,
      placeholder,
      showTime,
      format: format,
      valueFormat: format,
      on: {
        change: (value) => {
          if (onChange) {
            onChange(formatMomentValue(value, format));
          }
        },
      },
      getCalendarContainer: (trigger) => trigger.parentNode,
    }: {
      ...props,
      value: defaultValue,
      placeholder,
      showTime,
      format: format,
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

export const DatePicker = connect(
  AntdDatePicker,
  mapProps(mapDateFormat()),
  mapReadPretty(PreviewText.DatePicker)
);

export default DatePicker;
