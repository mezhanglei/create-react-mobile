/**
 * 校验规则
 */

export type RegVerify = (value: string) => boolean;
export type StrVerify = (value: string) => boolean;

// 邮箱
export const isEmail: RegVerify = function (value) {
  if (!value) {
    return false;
  }
  return /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(value);
};

// 手机号码
export const isPhoneNumber: RegVerify = function (value) {
  if (!value) {
    return false;
  }
  return /^1[0-9]{10}$/.test(value);
};

// 验证码的格式，目前要求为6位
export const isCode: RegVerify = function (value) {
  if (!value) {
    return false;
  }
  return /^\d{6}$/.test(value);
};

// 电话号码
export const isPhone: RegVerify = function (value) {
  if (!value) {
    return false;
  }
  return /^([0-9]{3,4}-)?[0-9]{7,8}$/.test(value);
};

// url地址
export const isURL: RegVerify = function (value) {
  if (!value) {
    return false;
  }
  return /^http[s]?:\/\/.*/.test(value);
};

// 判断是否为身份证号
export const isIdCard: RegVerify = function (value) {
  if (!value) {
    return false;
  }
  return /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(value);
};

// 判断是否是个人微信的内置浏览器
export const isInWeChat = function (): boolean {
  let ua = navigator.userAgent.toLowerCase();
  if ((ua.match(/MicroMessenger/i) === 'micromessenger') && (ua.match(/wxwork/i) === 'wxwork')) {
    return false;
  } else if (ua.match(/MicroMessenger/i) === 'micromessenger') {
    return true;
  } else {
    return false;
  }
};

// 判断是否在微信小程序环境中, true表示是在微信小程序环境中
export const isInMini = function (wx: any): void {
  var ua = navigator.userAgent.toLowerCase();
  if (ua.match(/MicroMessenger/i) === "micromessenger") {
    //ios的ua中无miniProgram，但都有MicroMessenger（表示是微信浏览器）
    wx.miniProgram.getEnv((res: any) => {
      if (res.miniprogram) {
        alert("在小程序里");
      } else {
        alert("不在小程序里");
      }
    });
  } else {
    alert("不在微信环境");
  }
};

// 判断是否是企业微信
export const isCompanyChat = function (): boolean {
  let ua = window.navigator.userAgent.toLowerCase();
  if ((ua.match(/MicroMessenger/i) === 'micromessenger') && (ua.match(/wxwork/i) === 'wxwork')) {
    return true;
  } else {
    return false;
  }
};

// 判断是否在qq平台中
export const isQQ = function (): boolean {
  let ua = window.navigator.userAgent.toLowerCase();
  if (ua.match(/QQ/i) === "qq") {
    return true;
  } else {
    return false;
  }
};

// 判断是否是ios设备
export const isIOS = function (): boolean {
  return /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent);
};

// 判断是否在安卓
export const isAndroid = function (): boolean {
  let u = navigator.userAgent;
  // android终端或者uc浏览器
  let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
  return isAndroid == true ? true : false;
};

// 判断是不是JSON字符串
export const isJSON: StrVerify = function (value) {
  if (typeof value == 'string') {
    try {
      const obj = JSON.parse(value);
      if (typeof obj == 'object' && obj) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  } else { return false; }
};

//是否是移动设备
export const isMobile = function (): boolean {
  let userAgent = navigator.userAgent, Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
  return Agents.some((i) => {
    return userAgent.includes(i);
  });
};

// 判断是否为触摸事件
export const isEventTouch = function (e: any): boolean {
  if ("touches" in e || "targetTouches" in e || "changedTouches" in e) {
    return true;
  } else {
    return false;
  }
};

// 是否为SVG元素
export const isElementSVG = function (el: any): boolean {
  if (typeof window.SVGElement !== 'undefined' && el instanceof window.SVGElement) {
    return true;
  } else {
    return false;
  }
};

