import React from "react";
import styles from "./app.less";
// 引入路由组件
import RouteComponent from "@/routes/index/index.js";
import NotFound from "@/components/default/not-found";

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
    }
    componentWillUnmount() { }
    // 当suspense组件加载组件出错时通过此静态方法
    static getDerivedStateFromError(error) {
        return { isError: true };
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
            </div>
        );
    }
}

export default App;
