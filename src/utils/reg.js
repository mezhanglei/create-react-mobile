/**
 * 正则表达式的校验放在这里
 */

// 邮箱
export function isEmail(s) {
    if (!s) {
        return false;
    }
    return /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(s);
}

// 手机号码
export function isMobile(s) {
    if (!s) {
        return false;
    }
    return /^1[0-9]{10}$/.test(s);
}

// 验证码的格式，目前要求为6位
export function isCode(s) {
    if (!s) {
        return false;
    }
    return /^\d{6}$/.test(s);
}

// 电话号码
export function isPhone(s) {
    if (!s) {
        return false;
    }
    return /^([0-9]{3,4}-)?[0-9]{7,8}$/.test(s);
}

// url地址
export function isURL(s) {
    if (!s) {
        return false;
    }
    return /^http[s]?:\/\/.*/.test(s);
}

// 判断是否是个人微信的内置浏览器
export function isInWeChat() {
    let ua = navigator.userAgent.toLowerCase();
    if ((ua.match(/MicroMessenger/i) == 'micromessenger') && (ua.match(/wxwork/i) == 'wxwork')) {
        return false;
    } else if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        return true;
    } else {
        return false;
    }
}

// 判断是否在微信小程序环境中, true表示是在微信小程序环境中
export function isInMini(wx) {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
        //ios的ua中无miniProgram，但都有MicroMessenger（表示是微信浏览器）
        wx.miniProgram.getEnv((res) => {
            if (res.miniprogram) {
                return true;
            } else {
                return false;
            }
        });
    } else {
        return false;
    }
}

// 判断是否是企业微信
export function isCompanyChat() {
    let ua = window.navigator.userAgent.toLowerCase();
    if ((ua.match(/MicroMessenger/i) == 'micromessenger') && (ua.match(/wxwork/i) == 'wxwork')) {
        return true;
    } else {
        return false;
    }
}

// 判断是否在qq平台中
export function isQQ() {
    let ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/QQ/i) == "qq") {
        return true;
    } else {
        return false;
    }
}

// 判断是否是ios设备
export function isIOS() {
    return /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent);
}

// 判断是否在安卓
export function isAndroid() {
    let u = navigator.userAgent;
    // android终端或者uc浏览器
    let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
    return isAndroid == true ? true : false;
}

// 判断是否为身份证号
export function isIdCard(str) {
    if (!str) {
        return false;
    }
    return /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(str);
}

// 判断是不是JSON字符串
export function isJSON(str) {
    if (typeof str == 'string') {
        try {
            var obj = JSON.parse(str);
            if (typeof obj == 'object' && obj) {
                return true;
            } else {
                return false;
            }
        } catch (e) {
            return false;
        }
    }
}

// 判断是否为触摸屏设备
export function isTouch() {
    if ("ontouchstart" in window || "ontouchstart" in document) {
        return true
    } else {
        return false
    }
}