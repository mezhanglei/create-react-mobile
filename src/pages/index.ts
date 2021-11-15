// 在多页面中需要全局引入的文件可以放在这里(非npm包引入在配置文件中配置路径)


// 只在开发环境下引入
// if (process.env.NODE_ENV === 'development') {
//     import("vconsole").then(module => {
//         const VConsole = module.default;
//         new VConsole();
//     });
// }

import ClickListen from "@/utils/listen-click";
import objectFitImages from 'object-fit-images';
// 实例化一个节流类，在标签上有自定属性name的标签的click事件将被进行节流操作
const event = new ClickListen({
    name: "event-name=throttle",
    callback: function (e) {
        if (!this.timer) {
            this.timer = setTimeout(() => {
                e.cancelBubble = false;
                this.timer = null;
            }, 5000);
        } else {
            e.cancelBubble = true;
        }
    }
});
event.addEvent();

setTimeout(() => {
    objectFitImages();
}, 100);
