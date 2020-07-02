import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import App from "./app.js";
import store from "@/store/index.js";

// 引入全局样式
import "less/index.less";
// 处理点击移动端事件
import FastClick from "fastclick";
FastClick.attach(document.body);
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById("root")
);
