// 在多页面中需要全局引入的文件可以放在这里(非npm包引入在配置文件中配置路径)


// 只在开发环境下引入
// if (process.env.NODE_ENV === 'development') {
//     import("vconsole").then(module => {
//         const VConsole = module.default;
//         new VConsole();
//     });
// }

import DefineEvent from "@/utils/event.js";
// 实例化一个节流类，自定义属性event-name="throttle"的标签上的click事件将被进行节流操作
const event = new DefineEvent({
    eventName: "throttle",
    eventFn: function (e) {
        if (!this.timer) {
            this.timer = setTimeout(() => {
                e.cancelBubble = false;
                this.timer = null;
            }, 500);
        } else {
            e.cancelBubble = true;
        }
    }
});
event.addEvent();
