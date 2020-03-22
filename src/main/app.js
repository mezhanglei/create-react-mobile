import React from 'react'
import MyRoutes from "src/router/router.js";
// import { NotFound } from "src/router/components.js";

// 根组件
class App extends React.Component {
  constructor(props) {
    super(props);
  };
  state = {
    isError: false
  };
  componentDidMount() {
  };
  componentWillUnmount() {
  };
  // 当suspense组件加载组件出错时通过此静态方法
  static getDerivedStateFromError(error) {
    return { isError: true };
  }
  render() {
    // if (this.state.isError) {
    //   return (<NotFound />)
    // }
    return (
      <div className="app">
        <header>头部</header>
        <MyRoutes />
        <footer>尾部</footer>
      </div>
    );
  };
};

export default App;
