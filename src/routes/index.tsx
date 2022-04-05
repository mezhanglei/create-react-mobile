import React, { ReactNode } from "react";
import { HashRouter as Router, Route, Switch, Redirect, RouteProps } from "react-router-dom";
// import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import { DemoRoute } from "./demo";
import { DefaultRoutes } from "./default";
import { isLogin } from "@/core/common";
import { LOGIN_ROUTE } from "@/constants/account/index";
import TransitionSwitch from '@/components/transition-switch';

export interface MyRouteProps extends RouteProps {
    auth?: boolean; // 是否需要权限验证
    component: any; // 组件
    animationConfig?: { // 组件切换的动画类
        enter: string;
        exit: string;
    };
}

// 路由配置
const routes = [
    ...DemoRoute,
    ...DefaultRoutes
];

// 路由组件
export default function RouteComponent() {
    // BrowserRouter时需要设置basename
    const basename = Router.name == "BrowserRouter" ? process.env.PUBLIC_PATH : "";

    return (
        <Router basename={basename}>
            <TransitionSwitch routes={routes}>
                {routes.map((item: MyRouteProps, index) => {
                    return <Route
                        key={index}
                        exact={item.exact}
                        path={item.path}
                        render={(props) => {
                            if (!isLogin() && item.auth) {
                                return <Redirect to={{ pathname: LOGIN_ROUTE, state: { from: props.location } }} />;
                            } else {
                                return <item.component key={item.path} {...props}></item.component>
                            }
                        }}
                    />;
                })}
            </TransitionSwitch>
        </Router>
    );
}
