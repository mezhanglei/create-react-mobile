/**
 * 公共的一些业务方法或请求放到这里
 */

import { myStorage, mySession } from '@/utils/cache.js';
// import http from "@/http/request.js";

// 清空用户信息和token等信息
export function clearLoginInfo() {
  myStorage.remove('token');
  myStorage.remove('userInfo');
}

// 判断是否登录
export function isLogin() {
  const userInfo = myStorage.get("userInfo");
  if (userInfo.token) {
    return true;
  } else {
    return false;
  }
}

// 隐藏手机号中间的四位数并返回结果
export function hideTelephone(phone) {
  phone = "" + phone;
  let reg = /(\d{3})\d{4}(\d{4})/;
  return phone.replace(reg, "$1****$2");
}

// 调用此函数，关掉键盘，并回到页面顶部，以解决iOS 12中键盘收起后页面底部会有一部分空白的问题
export function resetPageInIOS() {
  if ('scrollIntoView' in document.activeElement) {
    document.activeElement.blur();
  }
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

// 禁止页面滚动默认行为（移动端）
export function bodyScroll(event) {
  event.preventDefault();
}

// 禁止页面滚动，解决弹框出现时 IOS 上滚动穿透的问题, passive：false用来提升移动端性能优化，作用不调用preventDefault()，从而避免延迟
export function forbidBodyScroll() {
  document
    .getElementsByTagName("body")[0]
    .addEventListener("touchmove", bodyScroll, { passive: false });
}

// 解除禁止滚动，解决弹框出现时 IOS 上滚动穿透的问题
export function allowBodyScroll() {
  document
    .getElementsByTagName("body")[0]
    .removeEventListener("touchmove", bodyScroll);
}

// react将字符串转化为html
export function showhtml(htmlString) {
  return <div dangerouslySetInnerHTML={{ __html: htmlString }}></div>;
}

/**
 * 微信发起支付的平台(根据当前的平台返回相应的字段添加到全局请求的头文件)
 * 安卓APP：ANDROID
 * 苹果APP：IOS    
 * 移动端网页：H5
 * PC端网页：PC
 * 微信公众号：WEIXIN
 * 微信小程序：MINI
 * 企业微信：WORK_WEIXIN
 */
export function wxPayPlatform() {
  // 如果是在个人微信内置浏览器环境中，则使用公众号支付
  if (isInWeChat() && !isCompanyChat()) {
    return "WEIXIN"
    // 如果是在企业微信或其他平台则不传
  } else {
    return ""
  }
}