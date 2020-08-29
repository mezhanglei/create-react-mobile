import { formatFloat } from "@/utils/character";
import { getNewDate, dateFormat } from "./format";

// 日的操作

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
