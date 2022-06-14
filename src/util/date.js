import moment from "moment";

export function formatDate(date, format) {
  return moment(date).format(format);
}

export function monthRangeFormat(date, format = "YYYY-MM-DD") {
  const start = moment(date).startOf("month");
  const end = moment(date).endOf("month");
  return { start: start.format(format), end: end.format(format) };
}

export function currentMonthRangeFormat(format = "YYYY-MM-DD") {
  return monthRangeFormat(new Date(), format);
}

export function dateRangeFormat(date, format = "YYYY-MM-DD") {
  const start = moment(date).startOf("date");
  const end = moment(date).endOf("date");
  return { start: start.format(format), end: end.format(format) };
}

export function currentDateRangeFormat(format = "YYYY-MM-DD") {
  return dateRangeFormat(new Date(), format);
}

export function monthAgo(date, format = "YYYY-MM-DD") {
  return moment(date).subtract(1, "month").format(format);
}

export function currentMonthAgo(format = "YYYY-MM-DD") {
  return { start: monthAgo(new Date(), format), end: moment(new Date()).format(format) };
}
