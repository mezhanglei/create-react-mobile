//===字符串或数字的处理===//


// 判断值是否为空, true为空，false为非空
export function isEmpty(value) {
    const type = ["", undefined, null];
    if (type.indexOf(value) > -1) {
        return true;
    } else {
        return false;
    }
}
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
    let num = typeof value === 'number' ? value : Number(value);
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
            return formatFloat(integer / Math.pow(10, 8), n) + '亿+';
        } else {
            return formatFloat(integer / Math.pow(10, 4), n) + '万+';
        }
    } else {
        return number;
    }
}

/**
 * 判断目标是否是DOM类型
 * @param {*} ele 目标
 */
export function IsDOM(ele) {
    if (typeof HTMLElement === 'object') {
        return ele instanceof HTMLElement;
    } else {
        return ele && typeof ele === 'object' && ele.nodeType === 1 && typeof ele.nodeName === 'string';
    }
}

/**
 * 递归去除参数的前后空格
 * @param {*} data 参数
 */
export const trimParams = (data) => {
    if (!data) return data;
    if (typeof data === 'boolean' || typeof data === 'number' || data instanceof Array) return data;
    if (typeof data === 'string') return data.trim();
    if (data instanceof Object && Object.prototype.toString.call(data) === '[object Object]') {
        for (let key in data) {
            data[key] = trimParams(data[key]);
        }
    }
    return data;
};

