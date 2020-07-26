import React from "react";
import styles from "./app.less";
// 引入路由组件
import RouteComponent from "@/routes/index/index.js";
import NotFound from "@/components/default/not-found";
// import ToTop from "@/components/top/top";

// 路由组件
function MyRoutes() {
    return (
        <React.Suspense fallback={null}>
            <RouteComponent />
        </React.Suspense>
    );
}

// 根组件
class App extends React.Component {
    constructor(props) {
        super(props);
    }
    state = {
        isError: false,
    };
    componentDidMount() {
        this.setState({
            scrollDom: ReactDOM.findDOMNode(this)
        });
        window.history.forward = this.aop('forward');
        window.history.back = this.aop('back');
        // 第三阶段：捕获pushState 和 replaceState
        window.addEventListener('forward', function () {
            console.log(11111);
            // 上报【进入页面】事件
        }, true);
        window.addEventListener('back', function () {
            console.log(2222);
            // 上报【进入页面】事件
        }, true);
    }
    componentWillUnmount() { }
    // 当suspense组件加载组件出错时通过此静态方法
    static getDerivedStateFromError(error) {
        return { isError: true };
    }

    // history路有变化监听
    aop(type) {
        // history上的事件
        const source = window.history[type];
        return function () {
            // 创建并执行一模一样的事件
            const event = new Event(type);
            event.arguments = arguments;
            window.dispatchEvent(event);
            // 执行事件
            const rewrite = source.apply(this, arguments);
            return rewrite;
        };
    }

    render() {
        // if (this.state.isError) {
        //     return (<NotFound />);
        // }
        return (
            <div className={styles["app"]}>
                {/* <header>头部</header> */}
                <MyRoutes />
                {/* <footer>尾部</footer> */}
                {/* <ToTop scrollDom={this.state.scrollDom} /> */}
            </div>
        );
    }
}

export default App;
