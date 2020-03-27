import React from 'react'
import { Route, Redirect, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { isLogin } from "@/configs/common.js"

/**
 * 需要登录的路由高阶组件(需配合Route使用)
 * 功能说明: 
 * 默认只有路由匹配的组件中才可以使用this.props, 使用withRouter包裹组件后就可以在组件中获取到this.props中的值了.
 * Component: 表示组件
 * rest: 剩余的其他props参数
 * 使用说明: 1. 首先引入LoginComponent
 *           2. 实例化路由组件: <Route path="路由" render={LoginComponent(目标组件)} />
 */
function WrapComponent({ component: Component, ...rest }) {
    return (
        <Route
            {...rest}
            // 如果已登录，则直接跳转到对应页面，否则重定向到登录页面
            render={props => isLogin() ? <Component {...props} /> :
                // 将前一页面路径信息存入到状态中
                <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
            }
        >
        </Route>
    )
}
/**connect的第一个参数:
 * 将store中的state数据作为props绑定到目标组件上供目标组件及子组件访问
 * state: store中的state数据
 * ownProps: connect的组件中自己的props, 即父组件传给它的所有props
 * 当state或者ownProps变化的时候，mapStateToProps都会被调用，计算出一个新的props, 在与ownProps合并后更新给目标组件
 */
const mapStateToProps = (state, ownProps) => {
    return {
        userInfo: state.userModule.userInfo
    }
}

function LoginComponent(componentModule) {
    const Wrap = withRouter(connect(mapStateToProps)(WrapComponent));
    return (props) => (
      <Wrap component={componentModule}>
      </Wrap>
    );
  };

export default LoginComponent;
