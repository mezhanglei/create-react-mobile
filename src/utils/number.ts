import BigNumber from 'bignumber.js';
import { isEmpty, isNumber, isNumberStr } from './type';

// 转为数字
export function toNumber(value: any, decimal?: number) {
  if (!isNumberStr(value)) return '';
  return new BigNumber(formatNumber(value, decimal)).toNumber();
}

// 格式化数字或字符串
export function formatNumber(value: number | string, decimal?: number, mode?: 'up' | 'down' | 'default') {
  if (!isNumberStr(value)) return '';
  const modeMap = {
    up: 0, // 进1
    down: 1, // 舍去
    default: 4, // 四舍五入
  };
  const roundMode = (mode ? modeMap[mode] : modeMap.default) as BigNumber.RoundingMode;
  BigNumber.config({ ROUNDING_MODE: roundMode });
  return typeof decimal === 'number' ? new BigNumber(value).toFixed(decimal) : new BigNumber(value).toFixed();
}

// 加
export function add(...args: Array<string | number>) {
  if (!(args instanceof Array)) return;
  return args.reduce((pre, cur) => BigNumber(pre || '0').plus(cur || '0').toString());
}

// 减
export function subtract(...args: Array<string | number>) {
  if (!(args instanceof Array)) return;
  return args.reduce((pre, cur) => BigNumber(pre || '0').minus(cur || '0').toString());
}

// 乘
export function multiply(...args: Array<string | number>) {
  if (!(args instanceof Array)) return;
  return args.reduce((pre, cur) => BigNumber(pre || '0').multipliedBy(cur || '0').toString());
}

// 除
export function divide(...args: Array<string | number>) {
  if (!(args instanceof Array)) return;
  return args.reduce((pre, cur) => BigNumber(pre || '0').dividedBy(cur).toString());
}

export function strToCurrency(value?: string | number, decimal?: number) {
  if (isEmpty(value)) return '';
  if (!isNumberStr(value)) return '0.00';
  const fmt = {
    prefix: '',
    decimalSeparator: '.', // 小数点
    groupSeparator: ',', // 分组隔离符
    groupSize: 3, // 正数组分割数量
    secondaryGroupSize: 0,
    fractionGroupSeparator: ' ', //小数组分组的分隔符
    fractionGroupSize: 0, // 小数组的分割单位
    suffix: ''
  };
  return decimal !== undefined ? new BigNumber(value).toFormat(decimal, fmt) : new BigNumber(value).toFormat(fmt);
}

/**
 * 比较大小
 * 返回 1  a > b
 * 返回 0 a = b
 * 返回 -1 a < b
 * 返回-2 存在空值 
 * @param a 
 * @param b 
 * @returns 
 */
export function compareTo(a?: string | number, b?: string | number) {
  if (!isNumberStr(a) || !isNumberStr(b)) return -2;
  return BigNumber(a).comparedTo(b);
}

// 将数字或数字字符串转成百分比
export function numberToRate(value: number | string, n = 2) {
  if (value === undefined || value === '') {
    return '';
  }
  let num = typeof value === 'number' ? value : parseFloat(value);
  return formatNumber(num * 100, n) + '%';
}

// 前面自动补充0
export function prefixZero(num: number, len: number) {
  if (String(num).length > len) return num;
  return (Array(len).join('0') + num).slice(-len);
}

// 对正整数循环除以10得到10的几次幂。
export function getPower(integer: number) {
  let power = -1;
  while (integer >= 1) {
    power++;
    integer = integer / 10;
  }
  return power;
}

/**
 * 将大数字转为带单位的数字, 
 * @param {*} number 数字
 * @param {String} unit 指定单位，默认 "万"
 * @param {Number} n 保留几位小数，默认保留2位
 */
export function numberAddUnit(num: number | string, unitStr = "万") {
  if (typeof num === "string") {
    num = parseFloat(num);
  } else if (!isNumber(num)) {
    return;
  }
  const unitByPower = {
    4: "万",
    5: "十万",
    6: "百万",
    7: "千万",
    8: "亿",
    9: "十亿",
    10: "百亿",
    11: "千亿",
    12: "万亿"
  };
  const powerByUnit = Object.entries(unitByPower).reduce((acc, [k, v]) => ({ ...acc, [v]: k }), {});
  if (unitStr) {
    const power = powerByUnit[unitStr];
    const result = formatNumber(num / Math.pow(10, power), 2);
    return result + unitStr;
  } else {
    const integer = Math.floor(num);
    const power = getPower(integer);
    const unit = unitByPower[power];
    const result = formatNumber(num / Math.pow(10, power), 2);
    return result + unit;
  }
}

/**
 * 随机一定范围内的数字
 * @param max 最大值
 * @param min 最小值
 */
export function randomNumber(max = 1, min = 0) {
  if (min >= max) {
    return max;
  }
  return Math.floor(Math.random() * (max - min) + min);
}
