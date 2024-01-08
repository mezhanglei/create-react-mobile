import React from "react";
import "./app.less";
import "./less";
import RouteComponent from "./routes/index";

// 根组件
const App: React.FC<any> = (props) => {
  return (
    <div className="app">
      <React.Suspense fallback={null}>
        <RouteComponent />
      </React.Suspense>
    </div>
  );
};

export default App;
