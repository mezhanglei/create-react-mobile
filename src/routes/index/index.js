import React from "react";
import { Prompt } from 'react-router';
import { HashRouter as Router, Route, Switch } from "react-router-dom";
// import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Toast } from "antd-mobile";
import { HomeRoutes, Home } from "./home-routes";
import { CategoryRoutes } from "./category-routes";
import { CartRoutes } from "./cart-routes";
import { PersonalRoutes } from "./personal-routes";
import NotFound from "@/components/default/not-found";
import { DefaultRoutes } from "./default-routes";
import { initWX } from "@/common/wx";
import LoginComponent from "@/components/login/index";
import TabNav from "@/components/tabnav/index";
// import { TransitionGroup, CSSTransition } from "react-transition-group";

/**
 * 页面路由配置
 * 必填参数说明：
 *  1.path: 路由
 *  2.component: 组件
 * 非必填参数说明：
 *  exact: 默认false， 为true时表示严格匹配，只有访问的路由和目标完全相等时才会被渲染
 */
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
    {
        path: '*',
        component: TabNav(NotFound)
    }
];

// 进入路由页面之前触发的方法
function beforeRouter(props) {
    // 微信授权
    // initWX();
}

/**
 * 对于路由拦截组件Prompt自定义使用, 离开当前路由页面之前触发
 * @param {*} message Prompt组件的提示信息
 * @param {*} callback 控制当前路由跳转或者不跳转
 */
function getConfirmation(message, callback) {
    console.log(location.href)
    alert(message);
    callback(true);
    // callback(true) 表示离开当前路由
    // callback(false) 表示留在当前路由
};

/**
 * 渲染路由组件(根据需要修改)
 * Router是所有路由组件共用的底层接口组件，它是路由规则制定的最外层的容器。
   Route路由规则匹配，并显示当前的规则对应的组件。
   Link路由跳转的组件
 * history路由模式Router的参数
 * 1.basename  类型string, 路由访问基准
 * 2.forceRefresh:bool true则表示导航时刷新页面.
 * 3.keyLength location.key的长度, 点击同一个链接时，每次该路由下的 location.key都会改变，可以通过key的变化来刷新页面(hash不支持)。
 * 4.children:node 要渲染的子元素。
 * Route的参数(可传函数或组件, 值为函数时都会接受所有由route传入的所有参数):
 * 1.component: 使用React.createElement创建组件, 每次更新和渲染都会重新创建新组件, 卸载旧组件, 挂载新组件
 * 2.render: 当路由的路径匹配时调用(推荐).
 * 3.children: 当children的值是一个函数时，无论当前地址和path路径匹不匹配，都将会执行children对应的函数
 */
export default function RouteComponent() {
    // 默认为设置的publicPath
    const basename = process.env.PUBLIC_PATH;
    return (
        <Router basename={basename} getUserConfirmation={getConfirmation}>
            <Switch>
                {routes.map((item, index) => {
                    return (
                        <Route
                            key={index}
                            exact={item.exact ? true : false}
                            path={item.path}
                            render={(props) => {
                                beforeRouter(props);
                                return (
                                    <React.Fragment>
                                        <Prompt message={`是否确定离开当前路由？${location.href}`} />
                                        <item.component {...props} meta={item.meta}></item.component>
                                    </React.Fragment>
                                );
                            }}
                        />
                    );
                })}
            </Switch>
        </Router>
    );
}
