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
// 引入图标
import "@/icons/index.js";

// 只在开发环境下引入
// if (process.env.NODE_ENV === 'development') {
//     import("vconsole").then(module => {
//         const VConsole = module.default;
//         new VConsole();
//     });
// }

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
