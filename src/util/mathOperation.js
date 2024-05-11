  /*
* 判断obj是否为一个整数
*/
export function isInteger(obj) {
      return Math.floor(obj) === obj
  }

  /*
* 将一个浮点数转成整数，返回小数点后面的长度。如 3.14 >> 314，2
* @param num {number} 小数
*/

  function getLen(num){
      let numStr=num.toString();
      return numStr.indexOf('.')===-1?0:numStr.split('.')[1].length
  }


/*
* 核心方法，实现加减乘除运算，确保不丢失精度
* 思路：把小数放大为整数（乘），进行算术运算，再缩小为小数（除）
* @param a {number} 运算数1
* @param b {number} 运算数2
* @param digits {number} 精度，保留的小数点数，比如 2, 即保留为两位小数
* @param op {string} 运算类型，有加减乘除（add/subtract/multiply/divide）
*/

  function operation(a, b, digits, op) {
      var result = null
      const maxLen= Math.max(getLen(a),getLen(b));
      const base=Math.pow(10,maxLen);
      const bigA = Math.round(base * a);
      const bigB = Math.round(base * b);
      switch (op) {
          case 'add':
              result = bigA + bigB
              break
          case 'subtract':
              result =  bigA - bigB
              break
          case 'multiply':
              result = bigA * bigB
              break
          case 'divide':
              result = bigA / bigB
              break
      }
      return result / base
  }

  // 加减乘除的四个接口

 export function add(a, b, digits) {
      return operation(a, b, digits, 'add')
  }

  export function subtract(a, b, digits) {
      return operation(a, b, digits, 'subtract')
  }

  export function multiply(a, b, digits) {
      return operation(a, b, digits, 'multiply')
  }

  export function divide(a, b, digits) {
      return operation(a, b, digits, 'divide')
  }


