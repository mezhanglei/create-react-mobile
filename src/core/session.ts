/**
 * 本地缓存和账号相关管理
 */

import { myStorage } from "@/utils/cache";
import { TOKEN, USER_INFO } from "@/constants/account/index";
import { LOGIN_PATH } from "@/constants/account/index";
import { UserInfo } from "@/services/account/interface";

// 清空账户信息
export function clearUserInfo() {
  myStorage.remove(TOKEN);
  myStorage.remove(USER_INFO);
}

// 本地获取用户信息
export const getUserInfo = () => {
  return myStorage.get(USER_INFO);
};

// 本地获取token信息
export const getToken = () => {
  return myStorage.get(TOKEN);
};

// 本地存储token信息
export const setToken = (token: string) => {
  myStorage.set(TOKEN, token);
}

// 本地存储用户信息
export const setUserInfoStorage = (data: UserInfo) => {
  myStorage.set(USER_INFO, data);
}

// 本地判断是否登录
export function isLogin() {
  return getToken();
}

// 退出登录后的本地操作
export function loginOut() {
  // 清除用户信息
  clearUserInfo();
  window.location.href = LOGIN_PATH;
}

// 初始化用户信息
export const initUserInfo = async () => {
  const { data } = await getUserInfo();
  setUserInfoStorage(data);
  return data;
}

