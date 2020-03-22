/**
 * 路由配置文件
 * 规则: 1. 先在components.js文件中导出组件
 *       2. 在本文件中导入路由组件
 *       3. 书写配置规则
 */
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// import { NotFound } from "src/router/components.js";
// 路由配置规则
let routes = [
  // {
  //   path:'/',
  //   component: home
  // }
];

/**
 * 渲染路由组件(根据需要修改)
 * history路由模式的参数
 * 1.basename  类型string, 如果你的项目在服务器上的一个子目录那么这个basename就是目录的名称
 * 2.forceRefresh:bool 如果为true在页面导航的时候后采用整个页面刷新的形式.
 * 3.keyLength location.key(表示当前位置的唯一字符串)的长度。默认为6。
 * 4.children:node 要渲染的子元素。
 */
export default function MyRoutes() {
  return (
    <React.Suspense fallback={null}>
      <Router basename={process.env.PUBLIC_PATH}>
        <Switch>
          {
            routes.map((item, index) => {
              return <Route exact={item.path === '/'} path={item.path} component={item.component} key={index} />
            })
          }
          {/* <Route component={NotFound} /> */}
        </Switch>
      </Router>
    </React.Suspense >
  );
}
