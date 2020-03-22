// applyMiddlewares将多个中间件合并起来返回一个dsipatch被重写的新的store
// createStore 创建一个store实例
// bindActionCreator调用函数bindActionCreators(actionCreators, store.dispatch)就可以实现store在组件及其子组件执行dispatch方法,一般通过全局导入store来代替
// combineReducers合并多个reducer 返回新的state
import { createStore, applyMiddleware, combineReducers } from 'redux'
// 日志中间件,仅在开发环境下使用,必须放在最后
import logger from 'redux-logger'
// 异步分发action中间件
import thunk from 'redux-thunk'
import { userReducer } from './reducers/user.js'
// 多个reducer合并, 每个reducer都代表一个模块, 访问state中的值需要去要访问对应模块下面的state
const RootReducer = combineReducers({
    userModule: userReducer
})
// applyMiddleware可以作为第二个参数也可以作为第三个参数
let store = createStore(RootReducer, applyMiddleware(thunk, logger))
export default store

/**
 * 不结合react-redux使用
 * 1. 创建reducer
 * 2. 合并多个reducer
 * 3. redux的createStore方法实例化一个store
 * 4. 引入store
 * 5. 在组件中创建个订阅函数可以监听到state值: const fn = () => { store.getState()获取所有的state }, 通过store.subscribe(fn) 监听state变化
 * 6. 通过store.dispatch(action对象)来更新store最新数据
 * 7. 组件卸载时调用卸载方法: store.unsubscribe(fn)
 */


/**
 * 结合react-redux使用(其中有Provider组件和connect方法):
 * 1. 创建reducer
 * 2. 合并多个reducer
 * 3. redux的createStore方法实例化一个store
 * 4.使用Provider组件包裹根组件, 从外部封装了整个应用，并向connect高阶组件传递store中的信息,
 * 5.在目标组件中的使用connect方法和参数说明:
 *   (1)使用connect方法包裹目标组件, 通过传相应的参数, 来获取store传过来的props: connect(mapStateToProps, ...)(PrivateRoute)
 *   (2) 参数说明如下
 */

/**connect的第一个参数:
 * 将store中的state数据作为props绑定到目标组件上供目标组件及子组件访问
 * state: store中的state数据
 * ownProps: connect的组件中自己的props, 即父组件传给它的所有props
 * 1. 当state或者ownProps变化的时候，mapStateToProps都会被调用，计算出一个新的props, 在与ownProps合并后更新给目标组件
 * 2. 在目标组件中获取值: this.props.属性名
 */
// const mapStateToProps = (state, ownProps) => {
//   return {
//       属性名: state.reducer模块名.loginState
//   }
// }

/**connect的第二个参数
* 将dispatch(action)的方法通过props传给组件或子组件调用
* @param {*} dispatch store的dispatch方法
* @param {*} ownProps connect的组件中自己的props, 即父组件传给它的所有props
* 1. 当state或者ownProps变化的时候，mapDispatchToProps都会被调用，计算出一个新的props, 在与ownProps合并后更新给目标组件
* 2. 在目标组件中执行更新方法: this.props.方法名(要更新的值)
*/
// const mapDispatchToProps = (dispatch, ownProps) => {
//   return {
      //  newState表示要更新的值
//     方法名: newState => {
//       dispatch(action对象或返回action的函数)
//     }
//   }
// }

/**
* connect第三个参数(可省略)
* 合并传入的state, dispatch, 和自身的props为一个对象传给目标组件
* 默认方式:Object.assign()
* const = mergeProps = (stateProps, dispatchProps, ownProps) => {
*  return Object.assign({}, stateProps, dispatchProps, ownProps)
* }
*/

/**
* connect方法第四个参数(可省略), 默认值{pure: true, withRef: false}
* 当pure为true时shouldComponentUpdate 并且浅对比 mergeProps 的结果, 如果没变化就不更新(所以通常将withRouter放在最外面, props会变化)
* 当withRef为true时, 会保存一个对被包装组件实例的引用，该引用通过 getWrappedInstance() 方法获得
*/