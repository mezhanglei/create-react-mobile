/**
 * 根据action的不同返回不同的state值给store
 * action对象 = {
 *   type: action的类别
 *   payload: 新的数据
 * }
 */

import { clearLoginInfo } from '@/common/common.js';
import { TOKEN, USER_INFO } from "@/constants/account/index";
// 用来持久化数据的方法
import { getSessionValue, setSessionValue, getLocalValue, setLocalValue } from "../cache.js";
// 初始数据
let initState = {
    // 登录信息
    userInfo: getLocalValue(USER_INFO)
};

export const userReducer = (state = initState, action) => {
    switch (action.type) {
        // 登录
        case 'LOGIN_IN':
            return { ...state, userInfo: setLocalValue(USER_INFO, action.payload) };
        // 退出账号
        case 'LOGIN_OUT':
            clearLoginInfo();
            return { ...state, userInfo: null };
        // 修改账号资料
        case 'CHANGE_ACCOUNT':
            return { ...state, userInfo: setLocalValue(USER_INFO, action.payload) };
        default:
            return { ...state };
    }
};
