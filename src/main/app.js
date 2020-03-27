import React from 'react'
import "./app.scss";
import http from "@/http/request.js";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// 引入组件
// import { NotFound } from "@/router/components.js";
import { Home, Category, Cart, Personal } from "@/router/components.js";
// 引入需要登录的高阶组件
import LoginComponent from "@/components/loginWrap/index.js";
// 导航组件
import TabNav from "@/components/tabnav/index.js";

/**
 * 渲染路由组件(根据需要修改)
 * history路由模式Router的参数
 * 1.basename  类型string, 如果你的项目在服务器上的一个子目录那么这个basename就是目录的名称
 * 2.forceRefresh:bool 如果为true在页面导航的时候后采用整个页面刷新的形式.
 * 3.keyLength location.key(表示当前位置的唯一字符串)的长度。默认为6。
 * 4.children:node 要渲染的子元素。
 * Route的参数(可传函数或组件, 值为函数时都会接受所有由route传入的所有参数):
 * 1.component: 使用React.createElement创建组件, 每次更新和渲染都会重新创建新组件, 卸载旧组件, 挂载新组件
 * 2.render: 当路由的路径匹配时调用(推荐).
 * 3.children: 当children的值是一个函数时，无论当前地址和path路径匹不匹配，都将会执行children对应的函数
 */
function MyRoutes() {
  return (
    <React.Suspense fallback={null}>
      <Router basename={process.env.PUBLIC_PATH}>
        <Switch>
          <Route exact path="/" render={props => <TabNav><Home {...props} /></TabNav>} />
          <Route path="/home" render={props => <TabNav><Home {...props} /></TabNav>} />
          <Route path="/cateGory" render={props => <TabNav><Category {...props} /></TabNav>} />
          <Route path="/cart" render={props => <TabNav><Cart {...props} /></TabNav>} />
          <Route path="/personal" render={props => <TabNav><Personal {...props} /></TabNav>} />
          {/* <Route component={NotFound} /> */}
        </Switch>
      </Router>
    </React.Suspense >
  );
}

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
        {/* <header>头部</header> */}
        <MyRoutes />
        {/* <footer>尾部</footer> */}
      </div>
    );
  };
};

export default App;
