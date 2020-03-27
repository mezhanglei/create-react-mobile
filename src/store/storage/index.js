/**
 * 这里创建保存本地/读取本地/更新（增加，删除，更新）并保存每条数据的方法
 */

import { mySession, myStorage } from "@/utils/cache.js";

// 获取用户信息
export function getUserInfo() {
  return myStorage.get('userInfo');
}

// 存储并返回用户信息
export function setUserInfo(data) {
  myStorage.set('userInfo', data);
  return data;
}

