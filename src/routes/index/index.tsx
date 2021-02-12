import React from "react";
import { HashRouter as Router, Route, Switch, Prompt, Redirect, RouteProps } from "react-router-dom";
// import { BrowserRouter as Router, Route, Switch, Prompt, Redirect } from "react-router-dom";
import { Toast } from "antd-mobile";
import { HomeRoutes, Home } from "./home";
import { CategoryRoutes } from "./category";
import { CartRoutes } from "./cart";
import { PersonalRoutes } from "./personal";
import NotFound from "@/components/default/not-found";
import { DefaultRoutes } from "./default";
import { initWX } from "@/core/wx";
import TabNav from "@/components/tabnav/index";
import { myStorage } from "@/utils/cache";
import { isLogin } from "@/core/common";
import { LOGIN_ROUTE } from "@/constants/account/index";
import TransitionRoute from "@/routes/index/transitionRoute/index";

export interface MyRouteProps extends RouteProps {
    auth?: boolean; // 是否需要权限验证
    component: any; // 组件
}

// 路由配置
const routes = [
    {
        path: "/",
        component: TabNav(Home),
        // 路由为/时必须设置exact为true
        exact: true
    },
    ...HomeRoutes,
    ...CategoryRoutes,
    ...CartRoutes,
    ...PersonalRoutes,
    ...DefaultRoutes,
    // {
    //     path: '*',
    //     component: TabNav(NotFound),
    //     auth: true
    // }
];

// 进入路由页面之前触发的方法
function beforeRouter(props, item: MyRouteProps) {
    // 微信授权
    // initWX();
}

// 路由组件
export default function RouteComponent() {
    // BrowserRouter时需要设置basename
    const basename = Router.name == "BrowserRouter" ? process.env.PUBLIC_PATH : "";

    return (
        <Router basename={basename}>
            <Switch>
                {routes.map((item: MyRouteProps, index) => {
                    return <Route
                        key={index}
                        exact={item.exact}
                        path={item.path}
                        render={(props) => {
                            beforeRouter(props, item);
                            if (!isLogin() && item.auth) {
                                return <Redirect to={{ pathname: LOGIN_ROUTE, state: { from: props.location } }} />;
                            } else {
                                return (
                                    <React.Fragment>
                                        <item.component key={item.path} {...props}></item.component>
                                    </React.Fragment>
                                );
                            }
                        }}
                    />;
                })}
            </Switch>
            <TransitionRoute />
        </Router>
    );
}

