/**
 * 通过unitChange来将数字转化为带亿或万单位的
 */

//保留n位小数并格式化输出浮点数字类型
export function formatFloat(value, n = 2) {
  return Math.round(value * Math.pow(10, n)) / Math.pow(10, n)
}

// 对正整数循环除以10得到10的几次幂。
function getPower(integer) {
  let power = -1;
  while (integer >= 1) {
    power++;
    integer = integer / 10;
  }
  return power;
}

/**
 * 
 * @param {*} number 数字
 * @param {*} n 保留几位小数，默认保留2位
 */
export function unitChange(number, n = 2) {
  // 目标数字首先向下取整
  let integer = Math.floor(number);
  // 十的几次幂 从0开始对应匹配单位个, 十, 百, 千, 万, 十万, 百万, 千万...
  let power = getPower(integer);
  // 首先判断是否上万
  if (power > 3) {
    // 然后判断是否上亿
    if (power >= 8) {
      return formatFloat(integer / Math.pow(10, 8), n) + '亿+'
    } else {
      return formatFloat(integer / Math.pow(10, 4), n) + '万+'
    }
  } else {
    return number;
  }
}
