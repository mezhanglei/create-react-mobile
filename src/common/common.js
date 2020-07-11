/**
 * 公共的业务方法放到这里
 */

import { myStorage, mySession } from "@/utils/cache.js";
import { TOKEN, USER_INFO } from "@/constants/account/index";
import { isIOS, isAndroid, isInWeChat, isQQ } from "@/utils/reg-utils";

// 清空用户信息和token等信息
export function clearLoginInfo() {
    myStorage.remove(TOKEN);
    myStorage.remove(USER_INFO);
}

// 本地判断是否登录
export function isLogin() {
    const userInfo = myStorage.get(USER_INFO);
    if (userInfo && userInfo[TOKEN]) {
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
    if ("scrollIntoView" in document.activeElement) {
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
 * 1.判断iOS和Android
 * 2.iOS判断是否在微信中，
 *   -是，无论是否已有APP都直接跳转到App Store
 *   -否，直接打开APP或跳转到App Store
 * 3.Android判断是否在微信中，
 *   -是，提示用户用浏览器打开页面，再直接打开APP或跳转下载页面
 *   -否，直接打开APP或跳转下载页面
 */
export function downLoadApp() {
    // 判断是安卓还是ios
    if (isAndroid()) {
        if (isInWeChat() || isQQ()) {
            // 引导用户在浏览器中打开
            return;
        }
        // Android, 尝试打开app或下载页面
        let ifr = document.createElement('iframe');
        ifr.src = 'msfacepay://';
        ifr.style.display = 'none';
        document.body.appendChild(ifr);
        window.setTimeout(() => {
            document.body.removeChild(ifr);
            // 安卓下载地址
            window.location.href = "安卓下载地址";
        }, 2000);
    } else if (isIOS()) {
        // 苹果app应用商店
        window.location.href = 'itms-apps://itunes.apple.com/cn/app/id1515056060?mt=8';
        // if (isInWeChat() || isQQ()) {
        //     window.location.href = 'itms-apps://itunes.apple.com/cn/app/id1515056060?mt=8';
        //     return;
        // }
        // //iOS不支持iframe打开APP, 使用window.location.href
        // window.location.href = 'msfacepay://';
        // window.setTimeout(() => {
        //     //打开app应用商店，由app开发人员提供
        //     window.location.href = 'itms-apps://itunes.apple.com/cn/app/id1515056060?mt=8';
        // }, 2000);
    }
}
