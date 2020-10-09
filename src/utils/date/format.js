import { isArray, isString } from "@/utils/type";

// 时间格式化操作

/**
 * 将其他类型格式的时间转化为日期对象并返回
 * @export
 * @param {*} time 时间字符串/对象/时间戳
 * @returns
 */
export function getNewDate(time) {
    if (typeof time === 'object') {
        return time;
    } else if (typeof time === 'string') {
        // 浏览器对/分割的时间字符串都兼容
        return new Date(time.replace(/-/gi, '/'));
    } else if (typeof time === 'number') {
        return new Date(time);
    } else {
        return null;
    }
}

/**
 * 将时间转换为时间戳
 * @param {*} time 时间字符串/对象/时间戳
 */
export function getDateTimeStamp(time) {
    if (!getNewDate(time)) {
        return null;
    }
    const newDate = getNewDate(time);
    return Date.parse(newDate);
}

/**
 * 将日期转换为 2020501 这种年月日格式
 * @param {*} time 时间字符串/对象/时间戳
 */
export function getYMD(time) {
    if (!getNewDate(time)) {
        return "";
    }
    let newDate = getNewDate(time);
    let y = newDate.getFullYear();
    let m = newDate.getMonth() + 1;
    m = m < 10 ? '0' + m : '' + m;
    let d = newDate.getDate() < 10 ? '0' + newDate.getDate() : '' + newDate.getDate();
    let ymd = y + m + d;
    return ymd;
}

/**
 * 格式化时间字符串，返回新的格式的时间字符串
 * @param {*} time 时间字符串/对象/时间戳
 * @param {*} fmt 格式类型：默认 YYYY-MM-DD，完整类型YYYY-MM-DD hh:mm:ss
 * @returns
 */
export function dateFormat(time, fmt = 'YYYY-MM-DD') {
    if (!getNewDate(time)) {
        return "";
    }
    let newDate = getNewDate(time);
    let part;
    // 校验规则
    const opt = {
        'Y+': newDate.getFullYear().toString(), // 年
        'M+': (newDate.getMonth() + 1).toString(), // 月
        'D+': newDate.getDate().toString(), // 日
        'h+': newDate.getHours().toString(), // 时(24小时制)
        'm+': newDate.getMinutes().toString(), // 分
        's+': newDate.getSeconds().toString() // 秒
    };

    // 遍历每一个规则，进行对应的匹配
    Object.keys(opt).map((item) => {
        // 匹配到的规则字符串部分
        part = new RegExp('(' + item + ')').exec(fmt);
        if (part) {
            // 规则字符串
            const match = part[1];
            // 规则对应的时间字符串，如果规则字符串等于1则为原字符串部分，如果大于1则在前面添加字符0
            let replaceStr = match.length === 1 ? opt[item] : opt[item].padStart(match.length, '0');
            fmt = fmt.replace(match, replaceStr);
        }
    });
    return fmt;
}

/**
 * 目标时间转为时间间隔
 * @param {*} time 时间字符串/对象/时间戳
 * @param {String | Array} unitType  指定要展示的单位
 *                                   1. 字符串类型：指定单位单位
 *                                   2. 数组类型：指定一串单位，按数组顺序，数组前面且值大于1的优先展示
 */
export function getDateDiff(time, unitType) {
    if (!getNewDate(time)) {
        return "";
    }
    const oldDate = getNewDate(time);
    const newDate = new Date();
    // 毫秒差距
    const diffMs = newDate.getTime() - oldDate.getTime();
    // 年的差距
    const diffYear = newDate.getFullYear() - oldDate.getFullYear();
    // 月的差距
    const diffMonth = diffYear * 12 + newDate.getMonth() - oldDate.getMonth();
    // 天数的差距
    const diffDay = diffMs / (1000 * 60 * 60 * 24);
    // 同年月下的日期差距
    const diffDate = newDate.getDate() - oldDate.getDate();
    if (diffMs < 0) { return; }
    if (diffMs < 1000) { return "刚刚"; }

    // 没有指定单位则取默认顺序
    unitType = unitType || ['d-', 'dd', 'hh', 'mm', 'ss'];
    // 计算规则
    const opt = {
        'YYYY': { value: diffYear, label: '年前' },
        'MM': { value: diffMonth, label: '月前' },
        'ww': { value: diffMs / (1000 * 60 * 60 * 24 * 7), label: '周前' },
        'dd': { value: diffDay, label: '天前' },
        'd-': { value: (diffDay < 2 && diffDate == 1) ? 1 : 0, label: '昨天' },
        'hh': { value: diffMs / (1000 * 60 * 60), label: '小时前' },
        'mm': { value: diffMs / (1000 * 60), label: '分钟前' },
        'ss': { value: diffMs / 1000, label: '秒前' }
    };

    // 返回的结果
    let result = time;
    if (isString(unitType)) {
        // 返回指定单位的
        if (opt[unitType]) {
            result = Math.floor(opt[unitType].value) + opt[unitType].label;
        }
    } else if (isArray(unitType)) {
        // 遍历所有单位，值大于1的优先展示, 终止循环
        unitType.some(item => {
            if (opt[item] && opt[item].value >= 1) {
                result = Math.floor(opt[item].value) + opt[item].label;
                return true;
            }
        });
    }
    return result;
}
