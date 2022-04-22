import { isAndroid, isInWeChat, isIOS, isQQ } from "@/utils/verify";

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