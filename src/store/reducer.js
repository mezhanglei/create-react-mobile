/**
 * reducer: 根据action的不同返回不同的state值
 */
import { combineReducers } from 'redux'
import { userReducer } from './reducers/userReducer'
// 多个reducer合并, 每个reducer都代表一个模块, 访问state中的值需要去要访问对应模块下面的state
const RootReducer = combineReducers({
    userModule: userReducer
})
export default RootReducer