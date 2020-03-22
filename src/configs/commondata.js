/**
 * 公共的一些前端数据（比如遍历数据）写在这里统一管理
 */

// 根据value取name
export function getTarget(value) {
  let result = "";
  if (value == null || value == undefined || value == "") {
    return result;
  }
  this.stateArr &&
    this.stateArr.map(item => {
      if (item.value == value) {
        result = item.name;
      }
    });
  return result;
}