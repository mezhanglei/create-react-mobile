import { formatFloat } from "@/utils/character";
import { getNewDate } from "./format";

// 年的操作

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
