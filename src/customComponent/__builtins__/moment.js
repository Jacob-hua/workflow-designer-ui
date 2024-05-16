import { isArr, isFn } from '@formily/shared'
import moment from 'moment'

export const momentable = (value, format) => {
  return Array.isArray(value)
    ? value.map((val) => moment(val, format))
    : value
    ? moment(value, format)
    : value
}

export const formatMomentValue = (
  value,
  format,
  placeholder
) => {
  const formatDate = (date, format, i = 0) => {
    if (!date) return placeholder
    if (isArr(format)) {
      const _format = format[i]
      if (isFn(_format)) {
        return _format(date)
      }
      return date?.format ? date.format(_format) : date
    } else {
      if (isFn(format)) {
        return format(date)
      }
      return date?.format ? date.format(format) : date
    }
  }
  if (isArr(value)) {
    return value.map((val, index) => {
      return formatDate(val, format, index)
    })
  } else {
    return value ? formatDate(value, format) : value || placeholder
  }
}
