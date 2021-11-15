
/**
 * jsonp请求跨域
 */
export interface JSONP_CONFIG {
    url: string // 接口
    jsonpKey?: string // 请求参数的key
    jsonpName?: string // 请求参数的名--后台执行函数名
    data: object // 参数
}
export function jsonpRequest<T>(configs: JSONP_CONFIG): Promise<T> {
    return new Promise((resolve, reject) => {
        let script = document.createElement('script');
        //定义后台执行的函数名,默认callback
        const callbackKey = configs.jsonpKey || 'callback';
        //定义前端的执行函数名(默认一个随机的名称))
        const callbackName = configs.jsonpName || 'jsonp' + ('v1.0.0' + Math.random()).replace(/\D/g, '') + '_' + new Date().getTime();
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
        const body = document.querySelector('body') as HTMLElement;
        //插入到body里
        body.appendChild(script);
        // 定义前端的执行函数
        window[callbackName] = function (result: T) {
            resolve(result);
        };
    });
}
