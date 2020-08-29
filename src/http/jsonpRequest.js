
/**
 * jsonp请求跨域
 * @param {Object} configs 函数的参数对象
 * configs = {
 *   url: 请求路径,必选
 *   jsonpKey: 后台的函数名,默认callback,可选
 *   jsonpCallback: 前台的执行函数名,默认一个随机,可选
 *   data: 请求的参数,可选
 * }
 */
export function jsonpRequest(configs) {
    return new Promise((resolve, reject) => {
        let script = document.createElement('script');
        //定义后台执行的函数名,默认callback
        const callbackKey = configs.jsonpKey || 'callback';
        //定义前端的执行函数名(默认一个随机的名称))
        const callbackName = configs.jsonpCallback || 'jsonp' + ('v1.0.0' + Math.random()).replace(/\D/g, '') + '_' + new Date().getTime();
        // 请求参数
        const data = configs.data || {};
        let queryArr = [];
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                queryArr.push(`${key}=${data[key]}`);
            }
        }
        // 拼接script请求路径
        script.src = `${configs.url}?${callbackKey}=${callbackName}&${queryArr.join("&")}`;
        //获取body元素
        const body = document.querySelector('body');
        //插入到body里
        body.appendChild(script);
        // 定义前端的执行函数
        window[callbackName] = function (result) {
            resolve(result);
        };
    });
}
