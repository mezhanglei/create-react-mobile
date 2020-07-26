import { setUrlQuery } from "@/utils/url";
/**
 * 前端数据手工埋点的方法
 * 1. 先实例化一个实例 const point = new Dpoint({url: '接口地址', attrName: '自定义属性名'})
 * 2. 调用实例的addEvent()方法，就可以监听事件
 * 3. 给目标要检测的标签添加自定义属性，值为要传给后台的值，监听会根据这个来找到要触发事件的目标
 * 4. 完成事件埋点，当触发事件时就会发送请求到服务端
 * 
 * 
 * 参数说明：
 *   url: 接口地址
 *   attrName: 要传的属性名
 *   eventType: 事件类型
 *   step：递归查找埋点的标签所递归的层数，默认3
 *   default：对象类型，传给服务端的默认数据
 */

export default class Dpoint {
    constructor(configs) {
        configs = configs || {};
        // 接口地址
        this.url = configs.url;
        // 识别埋点的自定义属性名
        this.attrName = configs.attrName || "point";
        // 触发的事件名
        this.eventType = configs.eventType || "click";
        // 递归查询触发事件的的递归层数
        this.step = configs.step || 3;
        // 默认要传的参数(参数最好用encodeURIComponent进行url编码)
        this.default = configs.default || {};
    }

    // 将数据发送到服务端
    sendMsg(data) {
        const cpImg = new Image();
        data = data || "";
        this.destroyImage(cpImg);
        // 标签发送请求
        cpImg.src = setUrlQuery({ [this.attrName]: data, ...this.default }, this.url);
    };

    // 加载错误或者加载完成后销毁image标签
    destroyImage(imgObject) {
        imgObject.onerror = function (err) {
            imgObject = null;
        };
        imgObject.onload = function (err) {
            imgObject = null;
        };
    }

    // 给body添加绑定事件，监听，如果触发了，则查询附近的父元素是否含有标记属性，如果含有，则执行发送代码
    addEvent() {
        const body = document.getElementsByTagName('body')[0];
        if (body) {
            body.addEventListener(this.eventType, this.eventFunc, false);
        }
    }

    // 解绑对应事件
    removeEvent(eventType) {
        const body = document.getElementsByTagName('body')[0];
        if (body) {
            body.removeEventListener(eventType, this.eventFunc, false);
        }
    }

    // 触发事件
    eventFunc = (e) => {
        e = e || window.event;
        const target = e.target || e.srcElement;
        const data = this.findSource(target);
        if (data) {
            this.sendMsg(data);
        }
    };

    // 根据事件触发点，查询附近的有自定义属性的标签，如果有将其存储的数据返回
    findSource(dom) {
        let flag = false;
        // 标签名
        let tagName = dom.tagName.toLowerCase();
        // 触发事件的目标
        let target = dom;
        // 递归查询的层数
        let num = this.step;
        while (tagName !== 'body' && num > 0) {
            flag = target.getAttribute(this.attrName) != null;
            if (flag) {
                // 自定义属性只能是字符串
                return target.getAttribute(this.attrName);
            }
            target = target.parentNode;
            tagName = target.tagName.toLowerCase();
            num--;
        }
        return flag;
    };

    // 获取当前页面所有的点位数据
    getAllPoint(attr) {
        attr = attr || this.attrName;
        // 所有点位的dom集合(NodeList)
        const points = document.querySelectorAll('[' + attr + ']');
        const result = {
            points: points
        };
        return result;
    }
}
