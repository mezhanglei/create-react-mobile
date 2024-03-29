import { getNewDate } from "./format";
import { TimeInputType } from "./interface";

// 周的操作

/**
 * 根据日期获取当前是周几
 * @export
 * @param {*} time 时间字符串/对象/时间戳
 * @returns
 */
export function getWeek(time: TimeInputType) {
  if (!getNewDate(time)) {
    return time;
  }
  let newDate = getNewDate(time);
  if (!newDate) return time;
  let index = newDate.getDay();
  let weeks = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  return weeks[index];
}
