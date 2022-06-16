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

export function oneMonthAgo(date, format = "YYYY-MM-DD", startOfDay = true) {
  if (startOfDay) {
    return moment(date).subtract(1, "month").startOf("day").format(format);
  }
  return moment(date).subtract(1, "month").format(format);
}

export function currentOneMonthAgo(format = "YYYY-MM-DD", startOfDay = true) {
  return { start: oneMonthAgo(new Date(), format, startOfDay), end: moment(new Date()).endOf("day").format(format) };
}

// @code 项目及业务对应code

export function getMappingName(code){
	   let mapping = JSON.parse(sessionStorage.getItem('mapping'))
     let eleMapping = mapping.filter((item) => {
       return item.code === code
     })
     return eleMapping[0]?.name || '---'
 }
