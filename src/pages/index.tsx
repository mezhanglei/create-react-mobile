import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from "./app";
import store from "@/store/index";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// 引入全局样式
import "../less/index.less";
import { ConfigProvider } from 'antd-mobile';
import antdMobileConfigs from '@/components/configs';

// 只在开发环境下引入
// if (process.env.NODE_ENV === 'development') {
//     import("vconsole").then(module => {
//         const VConsole = module.default;
//         new VConsole();
//     });
// }

const rootDiv = document.getElementById("root");
rootDiv && createRoot(rootDiv).render(
  <Provider store={store} >
    <ConfigProvider {...antdMobileConfigs}>
      <App />
    </ConfigProvider>
  </Provider>
);
