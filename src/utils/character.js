//===基础字符串或数字的处理===//
import { isObject, isNumber } from "./type";

//保留n位小数并格式化输出字符串类型的数据
export function formatFloat(value, n = 2) {
    if (value === undefined || value === '') {
        return '';
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

// 将数字或数字字符串转成百分比
export function numberToRate(value, n = 2) {
    if (value === undefined || value === '') {
        return '';
    }
    let num = typeof value === 'number' ? value : parseFloat(value);
    return formatFloat(num * 100, n) + '%';
}

// 对正整数循环除以10得到10的几次幂。
export function getPower(integer) {
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
export function unitChange(number, unit = "万", n = 2) {
    if (!isNumber(number)) {
        number = parseFloat(number);
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
export const trimParams = (data) => {
    if (typeof data === 'string') return data.trim();
    if (isObject(data)) {
        for (let key in data) {
            data[key] = trimParams(data[key]);
        }
    }
    return data;
};

// react将字符串转化为html
export function showhtml(htmlString) {
    return <div dangerouslySetInnerHTML={{ __html: htmlString }}></div>;
}

// 格式化text-area文本, 返回格式化后的字符串： 去空格，并实现换行
export const handleTextArea = (text) => {
    let arr = [];
    text.split('\n').forEach(item => arr.push(`<span>${item.trim()}</span>`));
    return arr.join('<br>');
};

// 隐藏手机号中间的四位数并返回结果
export function hideTelephone(phone) {
    phone = "" + phone;
    let reg = /(\d{3})\d{4}(\d{4})/;
    return phone.replace(reg, "$1****$2");
}
