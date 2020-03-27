import wx from 'weixin-js-sdk'
import http from '@/http/request.js';
import { isInWeChat, isIOS } from "@/configs/reg.js";
/**
 * 微信分享
 */
class WXShare {
  constructor(config) {
    let defaultConfig = {
      // // 公众号的appid
      // appId: 'wx7d0a4305d747a1f7',
      // // 返回的类型
      // responseType: 'code',
      // // 授权链接重定向后的链接
      // redirect_uri: 'http://tv6ib5.natappfree.cc/WxAuth',
      // // 授权的作用域，snsapi_userinfo表示用户手动授权
      // scope: 'snsapi_userinfo'
    }
    this.config = Object.assign(defaultConfig, config)
  };

  /**
   * 返回拼接微信的授权链接
   */
  // getAuthLink() {
  //   // 目标回调页面，进入授权链接后重定向的地址
  //   let redirectUrl = encodeURIComponent(this.redirect_uri);
  //   // 进入这个链接后，如果用户同意授权，页面将跳转至 redirect_uri?code=CODE&state=STATE。若用户禁止授权，则重定向后不会带上code参数，仅会带上state参数redirect_uri?state=STATE
  //   let authLink = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${this.appId}&redirect_uri=${redirectUrl}&response_type=${this.responseType}&scope=${this.scope}&state=STATE#wechat_redirect`;
  //   return authLink;
  // };

  /**
   * 微信分享的签名配置
   * 通过config接口注入权限验证配置(同一个url仅需调用一次,history模式下不同的url需要在url变化时调用，hash模式则只需要一次调用，因为hash字符串改变不会被包括在http请求中)
   */
  shareConfig(url) {
    // 如果不是在微信中则不起作用
    if (!isInWeChat()) {
      return
    }
    //如果是 iOS 设备，则使用第一次进入App时的URL去初始化wxConfig，切换路由时IOS中浏览器的url并不会改变，依旧是第一次进入页面的地址，所以需要将第一次进入应用的 url 存起来，当路由变化时还是使用第一次的 url 去请求签名。
    // if (isIOS()) {
    //   //记录第一次进入时的链接，iOS 分享时需要用到
    //   if (!store.state.user.theFirstLink) {
    //     store.commit('user/setTheFirstLink', url)
    //   } else {
    //     url = store.state.user.theFirstLink
    //   }
    // }

    // 将当前url传给后台请求微信签名配置
    http({
      method: "get",
      url: "",
      data: {
        url: encodeURI(url)
      }
    }).then(res => {
      // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作
      if (res.code == 200) {
        let data = res.data || {};
        wx.config({
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: data.appId,   // 必填，公众号的唯一标识
          nonceStr: data.nonceStr,   // 必填，生成签名的随机串
          signature: data.signature, // 必填，签名
          timestamp: data.timestamp, // 必填，生成签名的时间戳
          // 必填，需要使用的JS接口列表，所有JS接口列表
          jsApiList: [
            // 1.4.0启用，自定义“分享给朋友”及“分享到QQ”按钮的分享内容
            // "updateAppMessageShareData",
            // 1.4.0启用，自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容
            // "updateTimelineShareData",
            // 即将废弃，获取“分享到朋友圈”按钮点击状态及自定义分享内容接口
            "onMenuShareAppMessage",
            // 即将废弃，获取“分享给朋友”按钮点击状态及自定义分享内容接口
            "onMenuShareTimeline"
          ]
        })
      }
    })
  };
  /**
   * 在分享签名配置后，调用分享的接口
   * 说明：（1）页面加载时就调用分享接口：jssdk接口需放在ready函数里执行
   *       （2）点击按钮时执行，则只需要先config，然后直接调用微信的相关接口就可以，无需ready
   */
  share(url, title, desc, imgUrl) {
    if (!isInWeChat()) {
      return
    }
    // 有url则分享url，没有则默认首页
    let shareUrl = url;
    let shareTitle = title;
    let shareDesc = desc;
    let shareImg = imgUrl;

    wx.ready(() => {
      // 在 weixin-js-sdk 1.4 之后，分享到朋友和朋友圈要分别使用 updateAppMessageShareData，updateTimelineShareData
      // 这里为了兼容老版本的微信，所以把以前的老版本的方法也写上
      // wx.updateAppMessageShareData({
      //   title: shareTitle, // 分享标题
      //   desc: shareDesc, // 分享描述
      //   link: shareUrl, // 分享链接 默认以当前链接
      //   imgUrl: shareImg, // 分享图标
      //   success: () => {
      //     //分享成功回调，分享成功后要做的事情可以写在这里，比如说上传分享成功信息给服务器，方便做统计
      //   }
      // })
      // wx.updateTimelineShareData({
      //   title: shareTitle,
      //   link: shareUrl,
      //   imgUrl: shareImg
      // })
      wx.onMenuShareAppMessage({ // 分享给朋友，此方法即将被废弃，改用 updateAppMessageShareData
        title: shareTitle,
        desc: shareDesc,
        link: shareUrl,
        imgUrl: shareImg
      })
      wx.onMenuShareTimeline({ //分享到朋友圈，此方法即将被废弃，改用 updateTimelineShareData
        title: shareTitle,
        link: shareUrl,
        imgUrl: shareImg
      })
      wx.error(res => {
        // config信息验证失败会执行error函数，如签名过期导致验证失败，
        // 具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
        console.log(res)
      })
    })
  };
}

// 实例化一个微信授权类
const wechatShare = new WXShare();

export default wechatShare;