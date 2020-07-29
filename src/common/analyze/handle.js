import { setUrlQuery } from "@/utils/url";
import DefineEvent from "@/utils/event";

/**
 * 全局手工埋点函数
 * @param {*} url 访问的接口，必填
 * @param {*} data 默认传输的参数，选填
 * 使用说明: 
 * 1. 在入口文件处调用函数：Dpoint(url, data = {});
 * 2. 拥有event-name="point"自定义属性的标签将会被拦截点击事件，触发埋点发送请求的操作
 */
export function Dpoint(url, data = {}) {
    const event = new DefineEvent({
        eventName: "point",
        eventFn: function (e) {
            const cpImg = new Image();
            data = data || "";
            // 销毁img
            cpImg.onerror = function (err) {
                imgObject = null;
            };
            cpImg.onload = function (err) {
                imgObject = null;
            };
            // 标签发送请求
            cpImg.src = setUrlQuery({ ...data }, url);
        }
    });
    event.addEvent();
}
