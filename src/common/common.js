/**
 * 公共的业务方法放到这里
 */

import { myStorage, mySession } from "@/utils/cache.js";
import { TOKEN, USER_INFO } from "@/constants/account/index";
import { isIOS, isAndroid, isInWeChat, isQQ } from "@/utils/reg.js";

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

// 本地判断是否登录
export function isLogin() {
    return getToken();
}

// 退出登录后的本地操作
export function loginOut() {
    // 清除用户信息
    ClearUserInfo();
    window.location.href = '/#/login';
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
    if (isIOS()) {
        // 苹果app应用商店, iOS不支持iframe打开APP, 使用window.location.href
        window.location.href = '应用商店地址';
    } else if (isAndroid()) {
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
    }
}

/**
 * 闪烁消息
 * 使用:
 *   启动：message.showMessage(msg)
 *   停止: message.stopMessage()
 */
export const message = {
    timeout: null,
    oldTitle: document.title,
    time: 0,
    // 开始闪烁消息
    showMessage(msg) {
        message.timeout = setInterval(function () {
            message.time++;
            let title = '';
            if (message.time % 2 === 0) {
                title = '固定标题';
            } else {
                title = msg;
            }
            document.title = title;
        }, 600);

    },
    // 停止闪烁消息
    stopMessage() {
        document.title = message.oldTitle;
        clearTimeout(message.timeout);
    }
};

// 关闭当前页面
export function closePage() {
    if (confirm("您确定要关闭本页吗？")) {
        window.opener = null;
        window.open('', '_self');
        window.close();
    }
}
