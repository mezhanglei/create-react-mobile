//===基础字符串或数字的处理===//
import { isObject, isNumber, isEmpty, isNumberStr } from "./type";
import * as Pinyin from 'jian-pinyin';
import BigNumber from 'bignumber.js'

// 格式化数字或字符串
export function formatNumber(value: number | string, decimal = 2) {
  if (!isNumberStr(value)) return ''
  return decimal !== undefined ? new BigNumber(value).toFixed(decimal) : new BigNumber(value).toFixed()
}

export function strToCurrency(value?: string | number, decimal?: number) {
  if (isEmpty(value)) return ''
  if (!isNumberStr(value)) return '0.00'
  const fmt = {
    prefix: '',
    decimalSeparator: '.', // 小数点
    groupSeparator: ',', // 分组隔离符
    groupSize: 3, // 正数组分割数量
    secondaryGroupSize: 0,
    fractionGroupSeparator: ' ', //小数组分组的分隔符
    fractionGroupSize: 0, // 小数组的分割单位
    suffix: ''
  }
  return decimal !== undefined ? new BigNumber(value).toFormat(decimal, fmt) : new BigNumber(value).toFormat(fmt)
}

export function add(a?: string | number, b?: string | number) {
  return BigNumber(a || '0').plus(b || '0').toString()
}

export function subtract(a?: string | number, b?: string | number) {
  return BigNumber(a || '0').minus(b || '0').toString()
}

export function multiply(a?: string | number, b?: string | number) {
  return BigNumber(a || '0').multipliedBy(b || '0').toString()
}

export function divide(a?: string | number, b?: string | number) {
  return BigNumber(a || '0').dividedBy(b || '0').toString()
}

// 自动补充0
export function prefixZero(num: number, len: number) {
  if (String(num).length > len) return num;
  return (Array(len).join('0') + num).slice(-len);
}

// 将数字或数字字符串转成百分比
export function numberToRate(value: number | string, n = 2) {
  if (value === undefined || value === '') {
    return '';
  }
  let num = typeof value === 'number' ? value : parseFloat(value);
  return formatNumber(num * 100, n) + '%';
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
export function numberAddUnit(number: number | string, unit = "万", n = 2) {
  if (typeof number === "string") {
    number = parseFloat(number);
  } else if (!isNumber(number)) {
    return;
  }
  // 单位对应十的几次幂的映射规则
  const unitMap = {
    "十": 1,
    "百": 2,
    "千": 3,
    "万": 4,
    "十万": 5,
    "百万": 6,
    "千万": 7,
    "亿": 8,
    "十亿": 9,
    "百亿": 10,
    "千亿": 11,
    "万亿": 12
  };
  // 目标数字首先向下取整
  let integer = Math.floor(number);
  // 十的几次幂 从0开始对应匹配单位个, 十, 百, 千, 万, 十万, 百万, 千万...
  let power = getPower(integer);
  // 当前单位对应的十的幂次
  const unitPower = unitMap[unit];
  if (power >= unitPower) {
    return formatNumber(number / Math.pow(10, unitPower), n) + unit;
  }
  return number;
}

/**
 * 递归去除参数的前后空格
 * @param {*} data 参数
 */
export const trimParams = (data: any) => {
  if (typeof data === 'string') return data.trim();
  if (isObject(data)) {
    for (let key in data) {
      data[key] = trimParams(data[key]);
    }
  }
  return data;
};

// 格式化text-area文本, 返回格式化后的字符串： 去空格，并实现换行
export const handleTextArea = (text: string) => {
  const arr: string[] = [];
  text.split('\n').forEach(item => arr.push(`<span>${item.trim()}</span>`));
  return arr.join('<br>');
};

// 隐藏手机号中间的四位数并返回结果
export function hideTelephone(phone: number | string) {
  phone = "" + phone;
  let reg = /(\d{3})\d{4}(\d{4})/;
  return phone.replace(reg, "$1****$2");
}

// 过滤富文本中的标签和空格，提取文本
export function richTextFilter(str: string) {
  // return str.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/g, '').replace(/&nbsp;/ig, '');
  return (str.replace(/<[^<>]+>/g, '').replace(/&nbsp;/ig, ''));
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

// 2~36转十进制
export const OtherToDecimal = (num: string, base: number) => {
  const bases = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const config = {};
  for (let k = 0; k < base; k++) {
    config[bases[k]] = k;
  }
  num = String(num);
  num = num.toUpperCase();
  let count = 0;
  let res = 0;
  let i;
  while (num.length > 0) {
    i = num[num.length - 1];
    i = config[i];
    res = res + i * Math.pow(base, count);
    num = num.substr(0, num.length - 1);
    count++;
  }
  return res;
};

// 十进制转化为2~36进制
export const DecimalToOther = (number: number, base: number) => {
  const arr = [];
  const string = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let baseString = '';
  if (base < 2 || base > 36) return baseString;
  while (number > 0) {
    arr.push(Math.floor(number % base));
    number = Math.floor(number / base);
  }
  while (arr.length != 0) baseString += string[arr.pop()];
  return baseString;
};

// 拼音排序
export interface PinyinItem {
  text: string;
  letter: string;
  pinyin: string
}
export function pinyinSort(stringArr: string[], asc: boolean = true) {

  // 字符串转化成带拼音的数组
  const listWithPinyin = [];
  for (let i = 0; i < stringArr.length; i++) {
    const text = stringArr[i];
    const pinyinStr = Pinyin.getSpell(text, (charactor, spell) => {
      return spell[1];
    });
    const pinyinArr = pinyinStr.split(',');
    const pinyin = pinyinArr.join('');
    const letter = pinyin?.[0]?.toUpperCase();
    const item = { text, letter, pinyin }
    listWithPinyin?.push(item);
  }

  // 比较拼音之间谁的序号排在前面
  const compare = (a: string, b: string) => {
    const sortStr = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const maxLength = Math.max(a?.length, b?.length);
    for (let i = 0; i < maxLength; i++) {
      const aChar = a[i]?.toUpperCase();
      const bChar = b[i]?.toUpperCase();
      const aCharIndex = sortStr.indexOf(aChar)
      const bCharIndex = sortStr.indexOf(bChar)

      if (aCharIndex < bCharIndex) {
        return true;
      } else if (aCharIndex > bCharIndex) {
        return false;
      }
    }
  };

  const sortList = listWithPinyin?.sort((a, b) => {
    return compare(a.pinyin, b.pinyin) && asc ? -1 : 1
  });

  return sortList;
}



// 针对目标字符串，返回匹配的值替换成着重红色字体，支持关键字空格分词
export const matchChar = (content: string, keyWords?: string) => {
  if (!content) return;
  if (isEmpty(keyWords)) return content;
  // 是否有空格分词
  const splitParts: string[] = keyWords?.split(' ') || [];
  // 正则匹配字符串
  let matchRegStr = '';
  for (let i = 0; i < splitParts?.length; i++) {
    matchRegStr += '(' + splitParts[i] + ')([\\s\\S]*)';
  }
  const matchReg = new RegExp(matchRegStr);
  const matchRes = content?.match(matchReg);
  let k = 0;
  if (matchRes !== null) {
    let replaceReturn = "";
    for (let j = 1; j < matchRes.length; j++) {
      if (matchRes[j] === splitParts[k]) {
        replaceReturn += '<span style="color:red;">$' + j + '</span>';
        k++;
      } else {
        // 与 regexp 中的第1到第99个子表达式相匹配的文本。
        replaceReturn += '$' + j;
      }
    }
    return content?.replace(matchReg, replaceReturn)
  }
};

// 截取两个字符串之间的字符
export const sliceBetweenStr = (str: string, firstStr: string, endStr?: string) => {
  if (str == "" || str == null || str == undefined) { // "",null,undefined
    return "";
  }
  if (str.indexOf(firstStr) < 0) {
    return "";
  }
  const subFirstStr = str.substring(str.indexOf(firstStr) + firstStr.length, str.length);
  const endIndex = endStr ? subFirstStr.indexOf(endStr) : subFirstStr?.length;
  const subSecondStr = subFirstStr.substring(0, endIndex);
  return subSecondStr;
}