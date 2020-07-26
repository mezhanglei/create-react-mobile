import React from "react";
import { Route, Redirect, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { isLogin } from "@/common/common.js";

/**
 * 需要登录的容器组件
 * 功能说明:
 * props: 父组件传来的参数
 */
function LoginComponent(props) {
    return (
        <React.Fragment>
            {
                // 如果已登录，则直接跳转到对应页面，否则重定向到登录页面
                isLogin() ? props.children : <Redirect to={{ pathname: "/login", state: { from: props.location } }} />
            }
        </React.Fragment>
    );
}

/**
 * 接受一个组件返回另一个组件的高阶组件
 * @param {*} ParentComponent 容器父组件
 * @param {*} SubComponent 被包裹子组件
 * 使用： LoginComponent(目标组件)
 */
function LoginComponentHigh(SubComponent) {
    return (props) => (
        <LoginComponent {...props}>
            <SubComponent {...props}></SubComponent>
        </LoginComponent>
    );
}

export default LoginComponentHigh;
