//===字符串或数字的处理===//

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
 * 将一个对象里的参数以query参数拼接到目标url上
 * @param {*} url 目标url
 * @param {*} query 参数对象
 */
export function setUrlQuery(url, query) {
    if (!url) return "";
    if (query) {
        let queryArr = [];
        for (const key in query) {
            if (query.hasOwnProperty(key)) {
                queryArr.push(`${key}=${query[key]}`);
            }
        }
        if (url.indexOf("?") !== -1) {
            url = `${url}&${queryArr.join("&")}`;
        } else {
            url = `${url}?${queryArr.join("&")}`;
        }
    }
    return url;
}

/**
 * 删除url中指定的query参数
 * @param {str} url 指定的url
 * @param {str} name 要删除的指定的query参数名
 */
export function urlDelQuery(url, name) {
    let urlArr = url.split("?");
    if (urlArr.length > 1 && urlArr[1].indexOf(name) > -1) {
        let query = urlArr[1];
        let obj = {};
        let arr = query.split("&");
        for (let i = 0; i < arr.length; i++) {
            arr[i] = arr[i].split("=");
            obj[arr[i][0]] = arr[i][1];
        }
        delete obj[name];
        let resultUrl =
            urlArr[0] +
            "?" +
            JSON.stringify(obj)
                .replace(/[\"\{\}]/g, "")
                .replace(/\:/g, "=")
                .replace(/\,/g, "&");
        return resultUrl;
    } else {
        return url;
    }
}

/**
 * 根据参数名从而获取query参数的参数值
 * @param {*} name 目标参数的名字
 */
export function getUrlQuery(url, name) {
    let urlArr = url.split("?");
    if (urlArr.length > 1 && urlArr[1].indexOf(name) > -1) {
        let query = urlArr[1];
        let obj = {};
        let arr = query.split("&");
        for (let i = 0; i < arr.length; i++) {
            arr[i] = arr[i].split("=");
            obj[arr[i][0]] = arr[i][1];
        }
        return obj[name];
    } else {
        return null;
    }
}

