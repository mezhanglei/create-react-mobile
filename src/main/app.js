import React from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'

/**
 * history路由模式的参数
 * 1.basename  类型string, 如果你的项目在服务器上的一个子目录那么这个basename就是目录的名称
 * 2.getUserConfirmation 类型
 */
function MyRoutes() {
  return (
    <Router basename={process.env.PUBLIC_PATH}>
      <div>
        <Switch>
          {/* <Route path='/' exact render={props => <Layout {...props}><Home></Home></Layout>}></Route>
          <Redirect to="/404"></Redirect> */}
        </Switch>
      </div>
    </Router>
  );
}

// 根组件
class App extends React.Component {
  constructor(props) {
    super(props);
  };
  componentDidMount() {
  };
  componentWillUnmount() {
  };
  render() {
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
