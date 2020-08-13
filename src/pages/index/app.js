import React from "react";
import styles from "./app.less";
// 引入路由组件
import RouteComponent from "@/routes/index/index.js";
import NotFound from "@/components/default/not-found";

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

    render() {
        return (
            <div className={styles["app"]}>
                <RouteComponent />
            </div>
        );
    }
}

export default App;
