// 时间格式化操作
import { TimeInputType } from "./interface";

/**
 * 将其他类型格式的时间转化为日期对象并返回
 * @export
 * @param {*} time 时间字符串/对象/时间戳
 * @returns
 */
export function getNewDate(time: TimeInputType): Date | null {
    if (time instanceof Date) {
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
export function getDateTimeStamp(time: TimeInputType): number | null {

    const newDate = getNewDate(time);
    if (!newDate) return null;
    return Date.parse(newDate);
}

/**
 * 将日期转换为 2020501 这种年月日格式
 * @param {*} time 时间字符串/对象/时间戳
 */
export function getYMD(time: TimeInputType): string {
    let newDate = getNewDate(time);
    if(!newDate) return '';
    let y = newDate.getFullYear();
    let m = newDate.getMonth() + 1;
    m = m < 10 ? ('0' + m) : ('' + m);
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
export function dateFormat(time: TimeInputType, fmt = 'YYYY-MM-DD'): string {
    let newDate = getNewDate(time);
    if(!newDate) return '';
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
 * 将时间字符串按照一定规则格式化
 * 小于1小时内，则显示相对时间，即 “X分钟前”（例 1分钟前）
 * 大于一小时，则显示绝对时间，即详细时间（例：19:48）
 * 昨天和前天，则显示相对时间（例：昨天 19:48、前天 19:48）
 * 若是3天前，则显示绝对时间，即详细日期+时间（例：04-01 19:48）；
 * 若是非当年，则显示带年份的绝对时间，即详细日期+时间（例：2019-04-01 19:48）
 * @param {*} time 
 */
export function getDateFormat(time: TimeInputType): string {
    const oldDate = getNewDate(time);
    if(!oldDate) return '';
    const newDate = new Date();
    // 毫秒差距（绝对差距）
    const diffMs = newDate.getTime() - oldDate.getTime();
    // 年的差距（绝对差距）
    const diffYear = newDate.getFullYear() - oldDate.getFullYear();
    // 月的差距(绝对差距)
    const diffMonth = diffYear * 12 + newDate.getMonth() - oldDate.getMonth();
    // 日期差距(年或月下的日期差距，非绝对差距)
    const diffDate = newDate.getDate() - oldDate.getDate();

    if (diffMs < 1000) { return "刚刚"; }

    if (diffYear >= 1) {
        return dateFormat(time, "YYYY-MM-DD hh:mm");
    } else if ((diffMonth < 1 && diffDate >= 3) || diffMonth >= 1) {
        return dateFormat(time, "MM-DD hh:mm");
    } else if ((diffMonth < 1 && diffDate == 2)) {
        return "前天" + dateFormat(time, "hh:mm");
    } else if ((diffMonth < 1 && diffDate == 1)) {
        return "昨天" + dateFormat(time, "hh:mm");
    } else if (diffMs / (1000 * 60 * 60) >= 1) {
        return dateFormat(time, "hh:mm");
    } else if (diffMs / (1000 * 60) >= 1) {
        return Math.floor(diffMs / (1000 * 60)) + "分钟前";
    } else {
        return "刚刚";
    }
}
