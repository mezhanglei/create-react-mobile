
/**
 * jsonp请求封装的promise对象
 * @param {Object} obj 函数的参数对象
 * obj = {
 *   url: 请求路径,必选
 *   jsonpKey: 后台的函数名,默认callback,可选
 *   jsonpCallback: 前台的执行函数名,默认一个随机,可选
 *   data: 请求的参数,可选
 * }
 */
export function jsonpRequest(obj) {
  return new Promise((resolve, reject) => {
    let script = document.createElement('script');
    //定义后台执行的函数名,默认callback
    let defaultKey = obj.jsonpKey || 'callback';
    //定义前端的执行函数名(默认一个随机的名称))
    let defaultName = obj.jsonpCallback || 'jsonp' + ('v1.0.0' + Math.random()).replace(/\D/g, '') + '_' + new Date().getTime();
    //请求参数拼接字符串
    let dataStr = '';
    for (let key in obj.data) {
      if (key) {
        dataStr = dataStr + '&' + key + '=' + obj.data[key];
      }
    };
    //让script标签请求
    script.src = obj.url + '?' + defaultKey + '=' + defaultName + dataStr;
    //获取body元素
    const body = document.querySelector('body');
    //插入到body里
    body.appendChild(script);
    // 定义前端的执行函数
    window[defaultName] = function (result) {
      resolve(result);
    }
  })
}