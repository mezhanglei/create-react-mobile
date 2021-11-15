import { loadScript } from "@/utils/script";
import { isInWeChat, isIOS } from "@/utils/verify";

/**
 * 在页面加载完毕后初始化：initWxShare()
 * 注意: ios下当使用history，hash路由跳转时，分享的链接不为当前页面链接，window.location.href跳转的链接则不会有这个问题
 */
export function initWxShare() {
    loadScript("http://res.wx.qq.com/open/js/jweixin-1.4.0.js", function () {
        if (!isInWeChat()) {
            return;
        }
        const data = {};
        // 签名配置，不同的url需要不同的签名
        wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: data.appId, // 必填，公众号的唯一标识
            nonceStr: data.nonceStr, // 必填，生成签名的随机串
            signature: data.signature, // 必填，签名
            timestamp: data.timestamp, // 必填，生成签名的时间戳
            jsApiList: [
                'scanQRCode',
                'openLocation',
                "onMenuShareTimeline", // 即将废弃，获取“分享给朋友”按钮点击状态及自定义分享内容接口
                "onMenuShareAppMessage" // 即将废弃，获取“分享到朋友圈”按钮点击状态及自定义分享内容接口
                // 1.4.0启用，自定义“分享给朋友”及“分享到QQ”按钮的分享内容
                // "updateAppMessageShareData",
                // 1.4.0启用，自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容
                // "updateTimelineShareData",
            ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });

        // config信息验证后会执行ready方法
        wx.ready(function () {
            wx.onMenuShareTimeline({
                title: '',
                link: '',
                imgUrl: '',
                type: 'link',
                success: function (res) {
                    console.log(res);
                },
                cancel: function (res) {
                    console.log(res);
                }
            });
            wx.onMenuShareAppMessage({
                title: '', // 分享标题
                desc: '', // 分享描述
                link: '', // 分享链接
                imgUrl: '', //  // 分享图标
                type: 'link',
                success: function (res) {
                    console.log(res);
                },
                cancel: function (res) {
                    console.log(res);
                }
            });
        });
    });
}
