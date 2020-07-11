import React from "react";
import { HashRouter as Router } from "react-router-dom";
// import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Prompt } from 'react-router';

/**
 * 对于路由拦截组件Prompt自定义使用
 * @param {*} message Prompt组件的提示信息
 * @param {*} callback 控制当前路由跳转或者不跳转
 */
function getConfirmation(message, callback) {
    alert(message);
    callback(true);
    // callback(true) 表示离开当前路由
    // callback(false) 表示留在当前路由
};

/**
 * 监听路由离开时的组件
 * props: 父组件传来的参数
 */
function LeaveComponent(props) {
    // 默认为设置的publicPath
    const basename = process.env.PUBLIC_PATH;
    return (
        <Router getUserConfirmation={getConfirmation}>
            <Prompt message={`是否确定离开当前路由？${location.href}`} />
            {props.children}
        </Router>
    );
};


/**
 * 接受一个组件返回另一个组件的高阶组件
 * @param {*} ParentComponent 容器父组件
 * @param {*} SubComponent 被包裹子组件
 * 使用： TabNav(目标组件)
 */
export default function LeaveComponentHigh(SubComponent) {
    return (props) => (
        <LeaveComponent {...props}>
            <SubComponent {...props}></SubComponent>
        </LeaveComponent>
    );
}
