import React from "react";
import { createRoot } from "react-dom/client";
import App from "./app";
import { ConfigProvider } from 'antd-mobile';
import antdConfigs from "@/components/configs";
// 引入全局样式
import "./less/index.less";
import "core-js/stable";
import "regenerator-runtime/runtime";
import { getUrlQuery } from "@/utils/url";
import { clearUserInfo, setLocalUserInfo, setToken } from "@/services/auth";
import ErrorBoundary from "./components/ErrorBoundary";
import { getUserInfo } from "./services/account";

// 只在开发环境下引入
// if (process.env.NODE_ENV === 'development') {
//     import("vconsole").then(module => {
//         const VConsole = module.default;
//         new VConsole();
//     });
// }

// 支持接收token参数
const token = getUrlQuery('token');
const rootDiv = document.getElementById("root");
const root = rootDiv && createRoot(rootDiv);

const renderApp = () => {
  root && root.render(
    <ErrorBoundary>
      <ConfigProvider {...antdConfigs} >
        <App />
      </ConfigProvider>
    </ErrorBoundary>
  );
};

if (token) {
  clearUserInfo();
  const tokenString = decodeURIComponent(token);
  setToken(tokenString);
  getUserInfo().then((userInfo) => {
    setLocalUserInfo(userInfo);
    renderApp();
  });
} else {
  renderApp();
}
