import {
    Home,
    Category,
    Cart,
    Personal
} from "./components";
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
        meta: {
            title: "首页",
        },
    },
    {
        path: "/home",
        component: TabNav(Home),
        // 路由为/时必须设置exact为true
        exact: true,
        meta: {
            title: "首页",
        },
    },
    {
        path: "/cateGory",
        component: TabNav(Category),
        // 路由为/时必须设置exact为true
        exact: true,
        meta: {
            title: "分类",
        },
    },
    {
        path: "/cart",
        component: TabNav(Cart),
        // 路由为/时必须设置exact为true
        exact: true,
        meta: {
            title: "购物车",
        },
    },
    {
        path: "/personal",
        component: TabNav(Personal),
        // 路由为/时必须设置exact为true
        exact: true,
        meta: {
            title: "个人中心",
        }
    }
];

function RouteComponent() {
    // 默认网站页面的title(在Route组件的render函数中渲染)
    let defaultTitle = "首页";
    return (
        <React.Fragment>
            {routes.map((item, index) => {
                return (
                    <Route
                        key={index}
                        exact={item.exact ? true : false}
                        path={item.path}
                        render={(props) => {
                            // 动态设置title
                            document.title = item.meta.title || defaultTitle;
                            return (
                                <item.component {...props} meta={item.meta}></item.component>
                            );
                        }}
                    />
                );
            })}
        </React.Fragment>
    );
}

export default RouteComponent;
