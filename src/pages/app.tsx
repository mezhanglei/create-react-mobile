import React from "react";
import "./app.less";
// 引入路由组件
import RouteComponent from "@/routes/index";
import NotFound from "@/components/default/not-found";

// 根组件
const App: React.FC<any> = (props) => {
    return (
        <div className="app">
            <RouteComponent />
        </div>
    );
}

export default App;
