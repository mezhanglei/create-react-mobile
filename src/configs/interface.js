/**
 * 后台接口集合
 */

// ===========故障相关接口========== //

// 提交报障信息
export const submitError = "/wechatWorkorder/v1/wechat/workorder/add"


// ===========微信相关========== //
// 通过code获取用户信息接口
export const codeGetOpenId = "/wechatUser/v1/web/code/user/info";
// 通过openId实现公众号h5登录
export const loginH5 = "/jwt/v1/wechat/official/account/h5/login";
// 获取个人中心信息
export const getUserInfo = "/wechatUser/v1/wechat/user/info";

