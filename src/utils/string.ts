import * as devalue from 'devalue'
import { isEmpty } from './type'
import * as Pinyin from 'jian-pinyin';
import Clipboard from 'clipboard';

// 复制到剪贴板
export function copyToClipboard(content: any, clickEvent: any, successFn?: () => void, errorFn?: () => void) {
  if(typeof content !== 'string') return;
  const clipboard = new Clipboard(clickEvent.target, {
    text: () => content
  })

  clipboard.on('success', () => {
    successFn && successFn();
    clipboard.destroy();
  })

  clipboard.on('error', () => {
    errorFn && errorFn();
    clipboard.destroy();
  })

  clipboard.onClick(clickEvent)
}

// 将对象转化为json字符串
export function toJSON(val: any) {
  if (isEmpty(val)) return;
  try {
    return devalue.stringify(val)
  } catch (e) {
    console.error(e)
  }
}

// 解析json字符串
export function parseJSON(val: string) {
  if (isEmpty(val)) return;
  try {
    return devalue.parse(val)
  } catch (e) {
    console.error(e)
  }
}

// 将对象转化为普通字符串(非json格式)
export function uneval(val: any, allowFunction: boolean = true): string | undefined {
  if (isEmpty(val)) return;
  if (typeof val === 'function') {
    if (allowFunction) {
      return val.toString()
    } else {
      return
    }
  }
  try {
    return devalue.uneval(val)
  } catch (e) {
    console.error(e)
  }
}

// 将普通字符串转化为js(非json格式)
export function evalString(val: string) {
  if (isEmpty(val)) return;
  try {
    return eval(`(function(){return ${val} })()`)
  } catch (e) {
    console.error(e)
  }
}

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

// 过滤标签，提取文本
export function filterHtmlTag(str: string) {
  if (typeof str !== 'string') return;
  // const cssReg = new RegExp('<style[\\s\\S]+?</style>', 'g');
  // const scriptReg = new RegExp('<script[\\s\\S]+?</script>', 'g');
  return (str.replace(/<[^\\>]*>/g, '').replace(/&nbsp;/ig, '')).replace(/(\n|\r|\r\n|↵)/g, '');
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
