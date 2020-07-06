import React from "react";
import styles from "./app.less";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
// import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Prompt } from 'react-router';
// 引入路由组件
import RouteComponent from "./routes/index.js";

/**
 * 渲染路由组件(根据需要修改)
 * history路由模式Router的参数
 * 1.basename  类型string, 路由访问基准
 * 2.forceRefresh:bool 如果为true在页面导航的时候后采用整个页面刷新的形式.
 * 3.keyLength location.key(表示当前位置的唯一字符串)的长度。默认为6。
 * 4.children:node 要渲染的子元素。
 * Route的参数(可传函数或组件, 值为函数时都会接受所有由route传入的所有参数):
 * 1.component: 使用React.createElement创建组件, 每次更新和渲染都会重新创建新组件, 卸载旧组件, 挂载新组件
 * 2.render: 当路由的路径匹配时调用(推荐).
 * 3.children: 当children的值是一个函数时，无论当前地址和path路径匹不匹配，都将会执行children对应的函数
 */
function MyRoutes() {
    // 默认为设置的publicPath
    const basename = process.env.PUBLIC_PATH;
    return (
        <React.Suspense fallback={null}>
            <Router getUserConfirmation={getConfirmation} basename={basename}>
                <Prompt message="是否确定离开当前路由？" />
                <Switch>
                    {RouteComponent()}
                </Switch>
            </Router>
        </React.Suspense>
    );
}

/**
 * 路由切换拦截，若是需要提示信息则需配合Prompt组件使用
 * @param {*} message Prompt组件的提示信息
 * @param {*} callback 控制当前路由跳转或者不跳转
 */
function getConfirmation(message, callback) {
    callback(true);
    // callback(true) 表示离开当前路由
    // callback(false) 表示留在当前路由
};

// 根组件
class App extends React.Component {
    constructor(props) {
        super(props);
    }
    state = {
        isError: false,
    };
    componentDidMount() {
    }
    componentWillUnmount() { }
    // 当suspense组件加载组件出错时通过此静态方法
    static getDerivedStateFromError(error) {
        return { isError: true };
    }

    render() {
        // if (this.state.isError) {
        //   return (<NotFound />)
        // }
        return (
            <div className={styles["app"]}>
                {/* <header>头部</header> */}
                <MyRoutes />
                {/* <footer>尾部</footer> */}
            </div>
        );
    }
}

export default App;
