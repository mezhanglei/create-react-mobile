import React from "react";
import { Route, Redirect, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { isLogin } from "@/configs/common.js";

/**
 * 需要登录的容器组件(需配合Route使用)
 * 功能说明:
 * props: 父组件传来的参数
 * rest: 剩余的其他props参数
 */
function WrapComponent(props) {
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
 * 通过高阶组件的方式包裹目标组件实现登录拦截
 * @param {*} ComponentModule 传入的组件
 * * 使用说明:  1. 首先引入LoginComponent
 *             2. 将目标组件包裹：LoginComponent(目标组件)
 *             3. 通过Route组件实例化(只要在@/router/routes.js中配置过路由的组件可以省略这一步)
 */
function LoginComponent(ComponentModule) {
  const Wrap = WrapComponent;
  return (props) => (
    <Wrap {...props}>
      <ComponentModule {...props}></ComponentModule>
    </Wrap>
  );
}

export default LoginComponent;
