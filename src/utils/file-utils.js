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
    //创建缓冲数组
    let arrayBuffer = new ArrayBuffer(byteString.length);
    //创建类型数组对象用来描述二进制数据缓存区的一个类似数组的视图
    let typeArray = new Uint8Array(arrayBuffer);
    //遍历base64解码后的字符串的Unicode编码填入类型数组对象
    for (let i = 0; i < byteString.length; i++) {
        typeArray[i] = byteString.charCodeAt(i);
    }
    return new Blob([typeArray], { type: mime });
}

/**
 * 将Blob数据转化为base64编码的DataURL字符串
 * @param {Object} blob Blob类型的数据
 */
export function blobToDataURL(blob) {
    //创建filereader对象
    let reader = new FileReader();
    //上传完成时的结果
    reader.onload = function (e) {
        //e.target.result便为base64编码的DataURL字符串
    }
    //将blob数据转化为base64编码的DataURL数据
    reader.readAsDataURL(blob);
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
    str = '\ufeff' + str
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
* 表单方式导出excel表格的方法
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
    return xhr.status === okStatus ? xhr.responseText : null
}

/**
 * 请求获取blob方法
 * @param {string} url 下载文件链接
 * @return {promise} 返回值promise对象
 */
function getBlob(url) {
    return new Promise(resolve => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'blob';
        xhr.onload = () => {
            if (xhr.status == 200) {
                resolve(xhr.response);
            }
        };
        xhr.send();
    })
}

/**
 * 保存文件方法
 * @param {Blob} blob blob数据
 * @param {string} fileName 保存的文件名称
 */
function saveAs(blob, fileName) {
    //ie浏览器兼容不能打开blob链接的方法
    if (window.navigator.msSaveOrOpenBlob) {
        navigator.msSaveBlob(blob, fileName)
    } else {
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
 * 通过url链接下载文件并重命名
 * @param {*} url 下载链接
 * @param {*} fileName 文件名
 */
export function urlDownload(url, fileName) {
    //替换协议头为缺省协议,默认匹配当前协议
    url = url.replace(/^(http:|https:)/, '');
    //调用上述的方法下载
    getBlob(url).then(blob => {
        saveAs(blob, fileName);
    })
}