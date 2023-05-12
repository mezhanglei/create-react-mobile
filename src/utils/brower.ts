function userAgent(pattern: RegExp) {
  if (typeof window !== 'undefined' && window.navigator) {
    return !!/*@__PURE__*/navigator.userAgent.match(pattern);
  }
}

export const IE11OrLess = userAgent(/(?:Trident.*rv[ :]?11\.|msie|iemobile|Windows Phone)/i);
export const Edge = userAgent(/edge/i);
export const FireFox = userAgent(/firefox/i);
export const Safari = userAgent(/safari/i) && !userAgent(/chrome/i) && !userAgent(/android/i);
export const IOS = userAgent(/iP(ad|od|hone)/i);
export const ChromeForAndroid = userAgent(/chrome/i) && userAgent(/android/i);
export const isAndroid = userAgent(/android/i) || userAgent(/adr/i);

// 是否为企业微信
export const isCompanyChat = userAgent(/wxwork/i) && userAgent(/micromessenger/i)
// 是否为个人微信的内置浏览器
export const isInWeChat = isCompanyChat ? false : userAgent(/micromessenger/i);
// 是否为QQ内置浏览器
export const isQQ = userAgent(/qq/i);
// 是否是移动设备的浏览器
export const isMobile = function (): boolean {
  const Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
  return Agents.some((i) => {
    return userAgent(new RegExp(i, 'i'));
  });
};
