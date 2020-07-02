/**
 * 持久化保存数据的方法(目的是提供给redux使用)
 */

import { mySession, myStorage } from "@/utils/cache.js";

/**
 * 获取sessionStorage中的值
 * @param {*} key
 * @returns
 */
export function getSessionValue(key) {
    return mySession.get(key);
}


/**
 * 存储值到sessionStorage中并返回要存储的值
 * @param {*} key 目标的本地存储的key
 * @param {*} data 要存储的值
 * @returns
 */
export function setSessionValue(key, data) {
    mySession.set(key, data);
    return data;
}


/**
 * 获取localStorage中的值
 * @param {*} key
 * @returns
 */
export function getLocalValue(key) {
    return myStorage.get(key);
}

/**
 * 存储值到localStorage中并返回要存储的值
 * @param {*} key 目标的本地存储的key
 * @param {*} data 要存储的值
 * @returns
 */
export function setLocalValue(key, data) {
    myStorage.set(key, data);
    return data;
}
