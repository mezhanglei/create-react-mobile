// 登录拦截高阶组件
import LoginComponent from "@/components/loginWrap/index";
// tab栏高阶组件
import TabNav from "@/components/tabnav/index";
import React from "react";
import {
    HashRouter as Router,
    Route,
    Switch,
    withRouter,
} from "react-router-dom";
import { Toast } from "antd-mobile";
import { HomeRoutes, Home } from "./home-routes";
import { CategoryRoutes } from "./category-routes";
import { CartRoutes } from "./cart-routes";
import { PersonalRoutes } from "./personal-routes";
import NotFound from "@/pages/index/default/not-found";
import { DefaultRoutes } from "./default-routes";
import { initWX } from "@/common/wx";
// import { TransitionGroup, CSSTransition } from "react-transition-group";

/**
 * 页面路由配置
 * 必填参数说明：
 *  1.path: 路由
 *  2.component: 组件
 * 非必填参数说明：
 *  1. exact: 默认false， 为true时表示严格匹配，只有访问的路由和目标完全相等时才会被渲染
 *  2. meta： Object 路由携带的参数对象, 其中的title属性表示页面当前的标题(只适用于非服务端渲染)
 */
const routes = [
    {
        path: "/",
        component: TabNav(Home),
        // 路由为/时必须设置exact为true
        exact: true,
        // onEnter: (props) => {
        //     console.log(props);
        // },
        // 非官方API，用来存储页面信息
        meta: {
            title: "首页",
        },
    },
    ...HomeRoutes,
    ...CategoryRoutes,
    ...CartRoutes,
    ...PersonalRoutes,
    ...DefaultRoutes,
    {
        path: '*',
        component: TabNav(NotFound),
        // 非官方API，在渲染页面之前生效
        onEnter: (props) => {
            console.log(props, "页面不存在");
        }
    }
];

function RouteComponent() {
    return (
        <Switch>
            {routes.map((item, index) => {
                return (
                    <Route
                        key={index}
                        exact={item.exact ? true : false}
                        path={item.path}
                        render={(props) => {
                            // 微信授权
                            // initWX();
                            // 渲染路由组件前的处理
                            item.onEnter && item.onEnter(props);
                            return (
                                <item.component {...props} meta={item.meta}></item.component>
                            );
                        }}
                    />
                );
            })}
        </Switch>
    );
}

export default RouteComponent;
