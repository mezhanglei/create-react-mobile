/**
 * 开发环境接口域名参数
 * 方式一：仅仅设置接口的公共字段名，例如“/api”，同时在webpack.dev.js的proxy里设置代理的目标地址，缺点:切换目标域名需要重启服务
 * 方式二：关闭谷歌浏览器的安全策略，在这里设置完整接口域名。当我们切换请求目标，无需重启服务。较为推荐
 */
const devParams = {
	baseURL: "http:www.baidu.com"
};

/**
 * 生产环境接口域名参数(两种情况)
 * 1.固定设置某个域名
 * 2.使用当前Ip作为接口域名，这种情况baseURL前端设置为空
 */
const prodParams = {
	baseURL: ""
};

/**
 * 根据当前执行环境返回对应的接口域名参数
 */
function getParams() {
	if (process.env.NODE_ENV === "development") {
		return devParams;
	} else if (process.env.NODE_ENV === "production") {
		return prodParams;
	}
}

export default getParams();
