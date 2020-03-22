/**
 * 根据action的不同返回不同的state值给store
 * action对象 = {
 *   type: action的类别
 *   payload: 新的数据
 * }
 */
import { myStorage } from 'src/utils/cache.js';
import { clearLoginInfo } from 'src/configs/common.js';
// 用来持久化数据的方法
import {getUserInfo, setUserInfo} from "../storage/index.js";
// 初始数据
let initState = {
    // 登录信息
    userInfo: getUserInfo()
}
export const userReducer = (state = initState, action) => {
    switch (action.type) {
        // 登录
        case 'LOGIN_IN':
            return { ...state, userInfo: setUserInfo(action.payload.userInfo) }
        // 退出账号
        case 'LOGIN_OUT':
            clearLoginInfo();
            return { ...state, userInfo: null }
        default:
            return { ...state }
    }
}