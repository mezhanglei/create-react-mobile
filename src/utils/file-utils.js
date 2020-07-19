/**
 * base64编码的dataURL转化为Blob数据
 * @param {String} dataURL base64编码的dataURL字符串,格式比如 data:image/png;base64,经过base64编码的字符串
 * @result {Object} 返回值为Blob对象
 */
export function dataURLtoBlob(dataURL) {
    //获取MIME类型
    let mime = dataURL.split(',')[0].split(':')[1].split(';')[0];
    //对经过base64编码的数据进行解码
    let byteString = window.atob(dataURL.split(',')[1]);
    // 创建内存
    let arrayBuffer = new ArrayBuffer(byteString.length);
    // 生成内存的视图，通过TypeArray对象操作二进制
    let typeArray = new Uint8Array(arrayBuffer);
    // 遍历二进制数据通过typeArray对象将数据存储到arrayBuffer对象中
    for (let i = 0; i < byteString.length; i++) {
        typeArray[i] = byteString.charCodeAt(i);
    }
    // 生成blob数据
    return new Blob([typeArray], { type: mime });
}

/**
 * base64编码的dataURL转化为file二进制数据(可以js操控的二进制数据)
 * @param {String} dataURL base64编码的dataURL字符串,格式比如 data:image/png;base64,经过base64编码的字符串
 * @param {String} filename 文件流的名称
 * @result {Object} 返回值为File对象
 */
export function dataURLtoFile(dataURL, filename) {
    //获取MIME类型
    let mime = dataURL.split(',')[0].split(':')[1].split(';')[0];
    //对经过base64编码的数据进行解码
    let byteString = window.atob(dataURL.split(',')[1]);
    // 创建内存
    let arrayBuffer = new ArrayBuffer(byteString.length);
    // 生成内存的视图，通过TypeArray对象操作二进制
    let typeArray = new Uint8Array(arrayBuffer);
    // 遍历二进制数据通过typeArray对象将数据存储到arrayBuffer对象中
    for (let i = 0; i < byteString.length; i++) {
        typeArray[i] = byteString.charCodeAt(i);
    }
    // 生成file数据
    return new File([typeArray], filename, { type: mime });
}

/**
 * 将Blob数据转化为base64编码的DataURL字符串
 * @param {Object} blob Blob类型或file类型的数据
 * @param {Function} fn 回调函数
 */
export function blobToDataURL(blob, fn) {
    // 也可以采用window.URL.createObjectURL(blob)来创建，但注意所有图片加载完释放掉内存
    if (window.FileReader) {
        const file = new FileReader();
        //如果blob为空返回null
        if (blob == undefined) return fn(null);
        file.onload = function (e) {
            fn(e.target.result);
        };
        file.readAsDataURL(blob);
    }
}

/**
 * 前端导出csv格式表格(没有表格线),但是不支持合并表格和图片导出,并且解决了csv文件过大下载失败的问题
 * @param {String} str 标题字符串,格式: '标题1,标题2,标题3...'
 * @param {array} dataList 数据数组, 格式: [{},{},{}...]
 * @param {String} name 保存文件名
 */
export function exportCSV(str, dataList, name) {
    //标题
    str = str + '\n';
    //增加\t为了不让表格显示科学计数法或者其他格式
    for (let i = 0; i < dataList.length; i++) {
        for (let item in dataList[i]) {
            str += `${dataList[i][item] + '\t'},`;
        }
        str += '\n';
    }
    //在字符串前面添加\ufeff解决构造Blob中文乱码问题
    str = '\ufeff' + str;
    //构造Blob数据
    let blob = new Blob([str], { type: "text/plain;charset=utf-8" });
    //创建url和下载标签
    let url = window.URL.createObjectURL(blob);
    let link = document.createElement('a');
    link.href = url;
    link.download = name + '.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    //释放url对象
    window.URL.revokeObjectURL(url);
}

/**
* POST请求(表单)方式导出excel表格的方法
* @param {object} params 请求参数
* @param {string} url 请求接口 
*/
export function formExportFile(params, url) {
    //创建隐藏的表单
    let form = document.createElement('form');
    form.style.display = 'none';
    form.action = url;
    form.method = 'post';
    document.body.appendChild(form);
    //创建隐藏的控件
    for (let key in params) {
        let input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = params[key];
        form.appendChild(input);
    }
    //提交表单
    form.submit();
    //移除表单
    form.remove();
}

/**
 * ajax读取本地txt文件得到web格式文本
 * @param {string} url 本地文件的相对路径 
 */
export function readTxt(url) {
    let xhr = new XMLHttpRequest();
    let okStatus = document.loacation.protocol === "file:" ? 0 : 200;
    xhr.open('GET', url, false);
    xhr.overrideMimeType("text/html;charset=utf-8");
    xhr.send(null);
    return xhr.status === okStatus ? xhr.responseText : null;
}

/**
 * 下载blob数据
 * @param {Blob} blob blob数据
 * @param {string} fileName 保存的文件名称
 */
export function saveAs(blob, fileName) {
    // ie浏览器兼容不能打开blob链接的方法
    if (window.navigator.msSaveOrOpenBlob) {
        navigator.msSaveBlob(blob, fileName);
    } else if (window.URL) {
        //创建a标签
        const link = document.createElement('a');
        //获取body元素
        const body = document.querySelector('body');
        //创建url链接
        link.href = window.URL.createObjectURL(blob);
        //重命名
        link.download = fileName;
        //火狐需要隐藏标签
        link.style.display = 'none';
        //插入到body中
        body.appendChild(link);
        //触发下载
        link.click();
        //移除a标签
        body.removeChild(link);
        //释放url对象
        window.URL.revokeObjectURL(link.href);
    }
}

/**
 * get请求下载文件
 * @param {*} url 完整get请求接口
 * @param {*} fileName 文件名
 * @param {*} headers 头信息
 */
export function downLoadByGet(url, fileName, headers = {}) {
    //替换协议头为缺省协议,默认匹配当前协议
    url = url.replace(/^(http:|https:)/, '');
    // get请求获取二进制数据
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    // 设置头文件
    Object.keys(headers).map(key => {
        const value = headers[key];
        if (key) {
            xhr.setRequestHeader(key, value);
        };
    });

    xhr.responseType = 'blob';
    xhr.onload = () => {
        if (xhr.status == 200) {
            saveAs(xhr.response, fileName);
        }
    };
    xhr.send();
}
