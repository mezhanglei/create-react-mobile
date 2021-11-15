//===基础字符串或数字的处理===//
import { isObject, isNumber, isEmpty } from "./type";
import * as Pinyin from 'jian-pinyin';

//保留n位小数并格式化输出字符串类型的数据
export function formatFloat(value: number | string, n = 2) {
    if (typeof value === 'string') {
        value = parseFloat(value);
    } else if (!isNumber(value)) {
        return "";
    }
    // 浮点类型数字
    let numValue = Math.round(value * Math.pow(10, n)) / Math.pow(10, n);
    // 转为字符串
    let strValue = numValue.toString();
    // 小数点索引值
    let spotIndex = strValue.indexOf('.');
    // 没有点加个点
    if (spotIndex < 0 && n > 0) {
        spotIndex = strValue.length;
        strValue += '.';
    }
    while (strValue.length <= spotIndex + n) {
        strValue += '0';
    }
    return strValue;
}

// 自动补充0
export function prefixZero(num: number, len: number) {
    if (String(num).length > len) return num;
    return (Array(len).join(0) + num).slice(-len);
}

// 将数字或数字字符串转成百分比
export function numberToRate(value: number | string, n = 2) {
    if (value === undefined || value === '') {
        return '';
    }
    let num = typeof value === 'number' ? value : parseFloat(value);
    return formatFloat(num * 100, n) + '%';
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
        return formatFloat(number / Math.pow(10, unitPower), n) + unit;
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

/**
 * 生成GUID(全局唯一标识符32位，UUID的一种)
 * 其中4表示UUID生成算法版本
 */
export const getGUID = () => {
    let str = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
    return str.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
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

// 首字母排序
export function pinyinSort(stringArr: string[], maxLength = 6) {

    // 按照指定长度补全，然后将36进制字符串转成十进制比较大小
    const pinyinToNum = (pinyinArr: string[]) => {
        let value = '';
        const string = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        pinyinArr?.forEach((char) => {
            if (char) {
                const firstLetter = char?.[0]?.toUpperCase() || '';
                const str = string?.indexOf(firstLetter) > -1 ? firstLetter : '';
                value += str;
            }
        });
  
        const newValue = value.padEnd(maxLength, '0');
        return OtherToDecimal(newValue, 36);
    };

    const dataMap = {};
    for (let i = 0; i < stringArr.length; i++) {
        const text = stringArr[i];
        const pinyinStr = Pinyin.getSpell(text, (charactor, spell) => {
            return spell[1];
        });
        const pinyinArr = pinyinStr.split(',');
        const pinyin = pinyinArr.join('');
        const key = pinyin?.[0]?.toUpperCase();
        if (dataMap[key]) {
            const value = dataMap[key];
            const addValue = { text, pinyin, pinyinNum: pinyinToNum(pinyinArr) };
            value?.push(addValue);
            dataMap[key] = value;
        } else {
            dataMap[key] = [{ text, pinyin, pinyinNum: pinyinToNum(pinyinArr) }];
        }
    }

    const ret = [] as { key: string, value: { text: string, pinyin: string, pinyinNum: number }[] }[];
    const letters = '*ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    for (let i = 1; i < letters.length; i++) {
        const value = dataMap[letters[i]];
        if (value) {
            const obj = new Object() as { key: string, value: { text: string, pinyin: string, pinyinNum: number }[] };
            obj.key = letters[i];
            const sortValue = value?.sort((a, b) => {
                return (a?.pinyinNum - b?.pinyinNum);
            });
            obj.value = sortValue;
            ret.push(obj);
        }
    }
    return ret;
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
}