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

// 底部导航栏
export const navList = [{
  title: "首页",
  path: "/",
  icon: "iconfont iconhome",
  selectIcon: "iconfont iconhome",
  badge: 1,
  dot: false
}, {
  title: "分类",
  path: "/category",
  icon: "iconfont icon-fenlei",
  selectIcon: "iconfont icon-fenlei",
  badge: "new",
  dot: false
}, {
  title: "购物车",
  path: "/cart",
  icon: "iconfont icongouwuche1",
  selectIcon: "iconfont icongouwuche1",
  badge: 1,
  dot: false
}, {
  title: "我的",
  path: "/personal",
  icon: "iconfont iconweibiaoti2fuzhi12",
  selectIcon: "iconfont iconweibiaoti2fuzhi12",
  badge: "",
  dot: true
}]