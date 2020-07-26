import { formatFloat } from './base.js';
import { isArray, isString, isEmpty } from "./type";

//===时间格式化操作===//

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
 * 将时间转换成几分钟前，几小时前等等
 * @param {*} time 时间字符串/对象/时间戳
 * @param {String | Array} unitType  支持数组和字符串类型，表示指定要展示的单位
 *                                   1. 没有指定则默认从年到秒时间跨度大于1个单位的优先展示
 *                                   2. 单位为字符串类型, 则返回该类型的时间数据
 *                                   3. 单位为数组类型，则从年到秒时间跨度大于1个单位的优先展示
 */
export function getDateDiff(time, unitType) {
    if (!getNewDate(time)) {
        return "";
    }
    const timestamp = getNewDate(time).getTime();
    const now = new Date().getTime();
    const diffValue = now - timestamp;
    if (diffValue < 0) { return; }
    if (diffValue < 1000) { return "刚刚"; }
    // 要展示的时间单位，按照从小到大书写
    const opt = [{
        type: "second",
        label: '秒前',
        value: 1000
    }, {
        type: "minute",
        label: '分钟前',
        value: 1000 * 60
    }, {
        type: "hour",
        label: '小时前',
        value: 1000 * 60 * 60
    }, {
        type: "day",
        label: '天前',
        value: 1000 * 60 * 60 * 24
    }, {
        type: "week",
        label: '周前',
        value: 1000 * 60 * 60 * 24 * 7
    }, {
        type: "month",
        label: '月前',
        value: 1000 * 60 * 60 * 24 * 30
    }, {
        type: "year",
        label: '年前',
        value: 1000 * 60 * 60 * 24 * 30 * 12
    }];
    // 转换后的时间数组
    let result = [];
    // 如果单位为字符串, 则返回指定的单位时间
    if (isString(unitType)) {
        opt.map(item => {
            if (item.type == unitType) {
                const count = diffValue / item.value || 0;
                result.push(formatFloat(count) + item.label);
            }
        });
        // 单位为字符串数组类型，则从年到秒时间跨度大于1个单位的优先展示
    } else if (isArray(unitType) && unitType.length > 0) {
        opt.map(item => {
            const count = diffValue / item.value || 0;
            if (unitType.indexOf(item.type) > -1 && count > 1) {
                result.push(formatFloat(count) + item.label);
            }
        });
        // 默认
    } else {
        opt.map(item => {
            const count = diffValue / item.value || 0;
            if (count > 1) {
                result.push(formatFloat(count) + item.label);
            }
        });
    }
    return result[result.length - 1];
}

// ===日的操作=== //

/**
 * 开始日期到结束日期的所有日期数组(包括开始日期和结束日期)
 * @export
 * @param {*} startTime startTime：开始日期时间字符串/对象/时间戳
 * @param {*} endTime endTime：结束日期时间字符串/对象/时间戳
 * @param {*} fmt fmt为日期数组中的日期格式：日为YYYY-MM-DD，月为YYYY-MM,年为YYYY
 * @returns
 */
export function getDateList(startTime, endTime, fmt = 'YYYY-MM-DD') {
    if (!getNewDate(startTime) || !getNewDate(endTime)) {
        return [];
    }
    // 开始时间对象
    let start = getNewDate(startTime);
    // 结束时间对象
    let end = getNewDate(endTime);

    // 年月日规则对应的时间跨度
    const rules = [{
        type: 'YYYY',
        setName: 'setFullYear',
        getName: 'getFullYear',
        length: end.getFullYear() - start.getFullYear() + 1
    }, {
        type: 'YYYY-MM',
        setName: 'setMonth',
        getName: 'getMonth',
        length: (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()) + 1
    }, {
        type: 'YYYY-MM-DD',
        setName: 'setDate',
        getName: 'getDate',
        // 此为start的零点到end的24点跨度，如果是日期都为零点则需要加1
        length: Math.ceil((end.getTime() - start.getTime()) / (1000 * 24 * 60 * 60))
    }];

    // 获取的时间数组
    let timeArr = [];

    // 当前操作的对象
    rules.map((item) => {
        if (item.type === fmt) {
            // 时间跨度
            const length = item.length;
            // 获取时间数组
            timeArr = new Array(length);
            timeArr[0] = dateFormat(start, fmt);
            for (let i = 1; i < length; i++) {
                // 在31号使用setMonth会跳过一个月，必须先使用setDate初始化第一天
                if (item.type === 'YYYY-MM') {
                    start.setDate(1);
                }
                start[item.setName](start[item.getName]() + 1);
                timeArr[i] = dateFormat(start, fmt);
            }
        }
    });
    return timeArr;
}

/**
 * 判断是否为工作日
 * 
 * 先判断是不是调休工作日，然后再判断是不是节假日，最后判断是不是周末
 * @export
 * @param {*} time 时间字符串/对象/时间戳
 * @param {*} workDays 调休工作日期字符串数组 格式: ['2012-12-10','2012-9-10']
 * @param {*} holidays 休假日期字符串数组 格式: ['2012-12-10','2012-9-10']
 * @returns
 */
export function isWorkDate(time, { workDays = [], holidays = [] } = {}) {
    if (!getNewDate(time)) {
        return null;
    }
    let newDate = getNewDate(time);
    // 将节假日数组和目标日期全部转为同等格式便于比较
    let ymd = getYMD(time);
    holidays = holidays.map(item => {
        return getYMD(item);
    });
    workDays = workDays.map(item => {
        return getYMD(item);
    });
    // 判断是不是调休工作日
    if (workDays.indexOf(ymd) > -1) {
        return true;
    }
    //判断是否为传统假期
    if (holidays.indexOf(ymd) > -1) {
        return false;
    }
    //判断是否为周六，周天
    if (newDate.getDay() == 0 || newDate.getDay() == 6) {
        return false;
    }
    return true;
}

/**
 * 在两个时间段之间获取天数
 * @param {*} startTime startTime：开始日期时间字符串/对象/时间戳
 * @param {*} endTime endTime：结束日期时间字符串/对象/时间戳
 * @param {*} n 表示保留几位小数，默认0
 */
export function getBetweenDateNum(startTime, endTime, n = 0) {
    if (!getNewDate(startTime) || !getNewDate(endTime)) {
        return null;
    }
    // 开始时间对象
    let start = getNewDate(startTime);
    // 结束时间对象
    let end = getNewDate(endTime);
    return formatFloat((end.getTime() - start.getTime()) / (1000 * 24 * 60 * 60), n);
}

/**
 * 在两个日期之间计算工作日天数
 * @param {*} startTime startTime：开始日期时间字符串/对象/时间戳
 * @param {*} endTime endTime：结束日期时间字符串/对象/时间戳
 * @param {*} {}: {workDays：工作调休日数组，holidays：节假日期数组}
 */
export function countWorkDay(startTime, endTime, { workDays = [], holidays = [] } = {}) {
    if (!getNewDate(startTime) || !getNewDate(endTime)) {
        return null;
    }
    const start = getNewDate(startTime);
    const end = getNewDate(endTime);
    let first = start.getTime();
    let last = end.getTime();
    let count = 0;
    const T = 24 * 60 * 60 * 1000;
    for (let i = first; i <= last; i += T) {
        let date = new Date(i);
        //判断是否为工作日
        if (isWorkDate(date, { workDays, holidays })) {
            count++;
        }
    }
    return count;
}

/**
 * 当前日期几个工作日后的日期
 * 
 * @param {*} time 开始时间时间字符串/对象/时间戳
 * @param {*} dayNum 工作日天数
 * @param {*} {}: {workDays：工作调休日数组，holidays：节假日期数组}
 * @param {*} fmt 声明时间字符串格式, 默认YYYY-MM-DD
 * @returns
 */
export function getWorkDate(time, dayNum, { workDays = [], holidays = [] } = {}, fmt = 'YYYY-MM-DD') {
    if (!getNewDate(time)) {
        return null;
    }
    let newDate = getNewDate(time);
    let startTime = newDate.getTime();
    let T = 24 * 60 * 60 * 1000;
    let endTime = startTime + (dayNum * T);
    if (dayNum > 0) {
        let count = 0;
        for (let i = startTime + T; i <= endTime; i += T) {
            let date = new Date(i);
            if (!isWorkDate(date, { workDays, holidays })) {
                count++;
            }
        }
        return getWorkDate(new Date(endTime), count, { workDays, holidays }, fmt);
    } else {
        return dateFormat(newDate, fmt);
    }
}

// ===周的操作=== //
/**
 * 根据日期获取当前是周几
 * @export
 * @param {*} time 时间字符串/对象/时间戳
 * @returns
 */
export function getWeek(time) {
    if (!getNewDate(time)) {
        return time;
    }
    let newDate = getNewDate(time);
    let index = newDate.getDay();
    let weeks = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return weeks[index];
}

// ===月的操作=== //

/**
 * 根据时间获取该时间所在月的月底日期对象(月底零点)
 * @param {*} time 时间字符串/对象/时间戳
 */
export function getMonthEndDay(time) {
    if (!getNewDate(time)) {
        return null;
    }
    const newDate = getNewDate(time);
    const year = newDate.getFullYear();
    const month = newDate.getMonth() + 1;
    const end = new Date(year, month, 0);
    return end;
}

/**
 * 根据时间获取该时间所在月的月初日期对象(月初零点)
 * @param {*} time 时间字符串/对象/时间戳
 */
export function getMonthStartDay(time) {
    if (!getNewDate(time)) {
        return null;
    }
    const newDate = getNewDate(time);
    const year = newDate.getFullYear();
    const month = newDate.getMonth();
    const start = new Date(year, month, 1);
    return start;
}

/**
 * 获取时间所在月的所有天数
 * @export
 * @param {*} time 时间字符串/对象/时间戳
 * @returns
 */
export function getMonthDayNum(time) {
    if (!getNewDate(time)) {
        return null;
    }
    const newDate = getNewDate(time);
    const year = newDate.getFullYear();
    const month = newDate.getMonth() + 1;
    // 下个月初零点
    const endDate = new Date(year, month, 0);
    return endDate.getDate();
}

/**
 * 根据时间获取所在月的剩余天数
 * @export
 * @param {*} time 时间字符串/对象/时间戳
 * @param {*} n 表示保留几位小数(四舍五入)，默认0
 * @returns
 */
export function getMonthRestDayNum(time, n = 0) {
    if (!getNewDate(time)) {
        return null;
    }
    const start = getNewDate(time);
    const monthDayNum = getMonthDayNum(time);
    const T = 1000 * 24 * 60 * 60;
    return formatFloat((monthDayNum * T - start.getTime()) / (1000 * 24 * 60 * 60), n);
}

/**
 * 时间在当月消耗的天数
 * @export
 * @param {*} time 时间字符串/对象/时间戳
 * @param {*} n 表示保留几位小数，默认0
 * @returns
 */
export function getMonthStartDayNum(time, n = 0) {
    if (!getNewDate(time)) {
        return null;
    }
    const start = getMonthStartDay(time);
    const end = getNewDate(time);
    return formatFloat((end.getTime() - start.getTime()) / (1000 * 24 * 60 * 60), n);
}

/**
 * 根据时间获取距离所在月月初的日的数组
 * @export
 * @param {*} time 时间字符串/对象/时间戳
 * @returns
 */
export function getMonthStartDays(time) {
    if (!getNewDate(time)) {
        return [];
    }
    let newDate = getNewDate(time);
    const currentDay = newDate.getDate();
    let dayArray = [];
    for (let i = 1; i <= currentDay; i++) {
        // 设置月的第几天(时刻为当前时刻),返回时间戳
        let day = newDate.setDate(i);
        let everyDay = dateFormat(day, 'YYYY-MM-DD');
        dayArray.push(everyDay);
    }
    return dayArray;
}

/**
 * 根据时间获取距离所在月月底的日期数组
 * @export
 * @param {*} time 时间字符串/对象/时间戳
 * @returns
 */
export function getMonthRestDays(time) {
    if (!getNewDate(time)) {
        return [];
    }
    let newDate = getNewDate(time);
    const currentDay = newDate.getDate();
    const dayNum = getMonthDayNum(newDate);
    let dayArray = [];
    for (let i = currentDay; i <= dayNum; i++) {
        let day = newDate.setDate(i);
        let everyDay = dateFormat(day, 'YYYY-MM-DD');
        dayArray.push(everyDay);
    }
    return dayArray;
}

/**
 * 根据时间获取所在月的所有日的数组
 * @export
 * @param {*} time 时间字符串/对象/时间戳
 * @returns
 */
export function getMonthDays(time) {
    if (!getNewDate(time)) {
        return [];
    }
    let newDate = getNewDate(time);
    let dayNum = getMonthDayNum(newDate);
    let dayArray = [];
    for (let i = 1; i <= dayNum; i++) {
        let day = newDate.setDate(i);
        let everyDay = dateFormat(day, 'YYYY-MM-DD');
        dayArray.push(everyDay);
    }
    return dayArray;
}

// ===年的操作=== //

/**
 * 是否为闰年
 * @export
 * @param {*} time 时间字符串/对象/时间戳
 * @returns
 */
export function isLeapYear(time) {
    if (!getNewDate(time)) {
        return null;
    }
    let newDate = getNewDate(time);
    if (newDate instanceof Date) {
        return (0 == newDate.getYear() % 4 && ((newDate.getYear() % 100 != 0) || (newDate.getYear() % 400 == 0)));
    }
    console.warn('time fomrat is wrong');
    return false;
}
