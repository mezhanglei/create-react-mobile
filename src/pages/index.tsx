import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import App from "./app";
import store from "@/store/index";
import objectFitImages from 'object-fit-images';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// 引入全局样式
import "less/index.less";
import { ConfigProvider } from 'antd-mobile';
import antdMobileConfigs from '@/core/antd-mobile-configs';


// 只在开发环境下引入
// if (process.env.NODE_ENV === 'development') {
//     import("vconsole").then(module => {
//         const VConsole = module.default;
//         new VConsole();
//     });
// }

import ClickListen from "@/utils/listen-click";
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


ReactDOM.render(
  <Provider store={store} >
    <ConfigProvider {...antdMobileConfigs}>
      <App />
    </ConfigProvider>
  </Provider>,
  document.getElementById("root")
);
