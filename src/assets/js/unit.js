// 格式化日期
export function format(time, value) {
	value = value || 'yyyy-MM-dd'
  var d;
  if (time) {
    d = time
  } else {
    return ''
  }
  var year = d.getFullYear()
  var month = change(d.getMonth() + 1)
  var day = change(d.getDate())
  var hour = change(d.getHours())
  var minute = change(d.getMinutes())
  var second = change(d.getSeconds())
  function change(t) {
    if (t < 10) {
      return '0' + t
    } else {
      return t
    }
  }
	
	function previousMonth(time) {
				let a = time.split('-')
				if (a[1] == '01') {
					a[0] = a[0] - 1
					a[1] = '12'
				} else {
					a[1] = (a[1] - 1 + '').padStart(2, '0')
				}
				return a.join('-')
			}
	let obj = {
		'yyyy': year,
		'yyyy-MM': year + '-' + month,
		'yyyy-MM-1': previousMonth(year + '-' + month) + '-' + day,
		'yyyy-1-MM-1': previousMonth((year - 1) + '-' + month),
		'yyyy-MM-dd': year + '-' + month + '-' + day,
	}
  // var time_str = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
  // var time_str = year + '-' + month + '-' + day
  return obj[value]
}


export function getFirstDay(){ //当前月第一天
		var y = new Date().getFullYear(); //获取年份
		var m = new Date().getMonth() + 1; //获取月份
		var d = '01';
		m = m < 10 ? '0' + m : m; //月份补 0
		
		return [y,m,d].join("-")
	}
  
export function getLastDay(){ //当前月最后一天
	    var y = new Date().getFullYear(); //获取年份
	    var m = new Date().getMonth() + 1; //获取月份
	    var d = new Date(y, m, 0).getDate(); //获取当月最后一日
	    m = m < 10 ? '0' + m : m; //月份补 0
	    d = d < 10 ? '0' + d : d; //日数补 0
	 
	    return [y,m,d].join("-")
 }