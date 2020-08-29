import { formatFloat } from "@/utils/character";
import { getNewDate, dateFormat } from "./format";

// 月的操作

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
