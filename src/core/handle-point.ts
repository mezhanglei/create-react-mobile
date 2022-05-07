import { addUrlQuery } from "@/utils/url";
import ClickListen from "@/utils/listen-click";

/**
 * 全局手工埋点函数
 * @param {*} url 访问的接口，必填
 * @param {*} data 默认传输的参数，选填
 * 使用说明: 
 * 1. 在入口文件处调用函数：Dpoint(url, data = {});
 * 2. 将name作为自定属性的标签将会被拦截点击事件，触发埋点发送请求的操作
 */
export function Handlepoint(url: string, data = {}) {
  const event = new ClickListen({
    name: "click-type=point",
    callback: function (e) {
      let cpImg: any = new Image();
      data = data || "";
      // 销毁img
      cpImg.onerror = function (err) {
        cpImg = null;
      };
      cpImg.onload = function (err) {
        cpImg = null;
      };
      // 标签发送请求
      cpImg.src = addUrlQuery({ ...data }, url);
    }
  });
  event.addEvent();
}
