/**
 * script加载资源
 * @param {*} url 资源url
 * @param {*} callback 加载完后的回调
 */
export function loadScript(url, callback) {

    const script = document.createElement('script');
    script.type = 'text/javascript';
    // IE
    if (script.readyState) {

        script.onreadystatechange = function () {
            if (script.readyState == 'loaded' || script.readyState == 'complete') {
                script.onreadystatechange = null;
                callback();
            }
        };
    } else {
        //其他浏览器
        script.onload = function () {
            callback();
        };
    }
    script.src = url;
    document.getElementsByTagName('head')[0].appendChild(script);
}
