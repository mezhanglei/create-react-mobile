import { Toast } from "antd-mobile";
import { getUrlQuery } from "@/utils/url";
import { WECHAT_TOKEN } from "@/services/auth";
import { myStorage } from "@/utils/cache";
import { handleRedirect } from "@/services/wx";
import { useEffect } from "react";

/**
 * 微信授权回调页面（中转页）
 */

const AuthWechat = (props) => {

  useEffect(() => {
    document.title = '';
    // hash路由下先把回调完的url转换成正常的
    let wxUrl = handleRedirect();
    // 获取code
    const code = getUrlQuery('code', wxUrl);
    // 返回的路径
    const backPath = decodeURIComponent(getUrlQuery('current', wxUrl));
    // 先清除token
    myStorage.remove(WECHAT_TOKEN);

    // 请求token
    if (code) {
      // 通过code请求后台获取token
      const token = "后台请求";
      myStorage.set(WECHAT_TOKEN, token);
      window.location.replace(backPath);
    } else {
      Toast.show("微信授权失败, 请稍后再试");
    }
  }, []);

  return null;
};

export default AuthWechat;
