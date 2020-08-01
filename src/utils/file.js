import { setUrlQuery } from "./url";
import { isURL } from "./reg";
import { isBlob, isArrayBuffer } from "./type";

// === 格式转换 ===

// 常用office文件对应的MIME TYPE和后缀
export const FileAndMIME = {
    ".doc": "application/msword",
    ".dot": "application/msword",
    ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".dotx": "application/vnd.openxmlformats-officedocument.wordprocessingml.template",
    ".docm": "application/vnd.ms-word.document.macroEnabled.12",
    ".dotm": "application/vnd.ms-word.template.macroEnabled.12",
    ".xls": "application/vnd.ms-excel",
    ".xlt": "application/vnd.ms-excel",
    ".xla": "application/vnd.ms-excel",
    ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ".xltx": "application/vnd.openxmlformats-officedocument.spreadsheetml.template",
    ".xlsm": "application/vnd.ms-excel.sheet.macroEnabled.12",
    ".xltm": "application/vnd.ms-excel.template.macroEnabled.12",
    ".xlam": "application/vnd.ms-excel.addin.macroEnabled.12",
    ".xlsb": "application/vnd.ms-excel.sheet.binary.macroEnabled.12",
    ".ppt": "application/vnd.ms-powerpoint",
    ".pot": "application/vnd.ms-powerpoint",
    ".pps": "application/vnd.ms-powerpoint",
    ".ppa": "application/vnd.ms-powerpoint",
    ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ".potx": "application/vnd.openxmlformats-officedocument.presentationml.template",
    ".ppsx": "application/vnd.openxmlformats-officedocument.presentationml.slideshow",
    ".ppam": "application/vnd.ms-powerpoint.addin.macroEnabled.12",
    ".pptm": "application/vnd.ms-powerpoint.presentation.macroEnabled.12",
    ".potm": "application/vnd.ms-powerpoint.presentation.macroEnabled.12",
    ".ppsm": "application/vnd.ms-powerpoint.slideshow.macroEnabled.12"
};

/**
 * base64编码的dataURL转化为Blob不可变二进制数据
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
 * base64编码的dataURL转化为file二进制类型
 * @param {String} dataURL base64编码的dataURL字符串,格式比如 data:image/png;base64,经过base64编码的字符串
 * @param {String} fileName 文件流的名称
 * @result {Object} 返回值为File对象
 */
export function dataURLtoFile(dataURL, fileName) {
    fileName = fileName || new Date().getTime();
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
    return new File([typeArray], fileName, { type: mime });
}

/**
 * 将binary(二进制)数据转化为base64编码的DataURL字符串
 * @param {Object} data Blob类型或file类型的数据
 * @param {Function} fn 回调函数
 */
export function binaryToDataURL(data, fn) {
    if (window.FileReader) {
        const file = new FileReader();
        //如果data为空返回null
        if (data == undefined) return fn(null);
        file.onload = function (e) {
            fn(e.target.result);
        };
        file.readAsDataURL(data);
    }
}

/**
 * binary(二进制数据)转file
 * @param {*} data blob或arrayBuffer数据
 */
export function binaryToFile(data) {
    if (!isArrayBuffer() && !isBlob(data)) {
        console.error("arraybuffer or blob type is required");
        return;
    }
    return new File([data], filename, { type: contentType, lastModified: Date.now() });
}

/**
 * arraybuffer转换为字符串
 * @param {*} data arrayBuffer类型
 * Unicode：编码统一所有语言编码，但是存储运输不方便
 * utf-8：将Unicode编码转换为可变长编码，利如传输存储
 */
export function arraybufferToString(data) {
    if (!isArrayBuffer(data)) {
        console.error("arraybuffer type is required");
        return;
    }
    // 从arrayBuffer中处理中文乱码
    if ('TextDecoder' in window) {
        // utf-8解码
        const enc = new TextDecoder('utf-8');
        return enc.decode(new Uint8Array(err.data));
    } else {
        // Unicode解码
        const result = new Uint8Array(data);
        return String.fromCharCode(...result);
    }
}

// === 文件导出 ===

/**
 * 前端导出csv格式表格(没有表格线),但是不支持合并表格和图片导出,并且解决了csv文件过大下载失败的问题
 * @param {String} str 标题字符串,格式: '标题1,标题2,标题3...'
 * @param {array} dataList 数据数组, 格式: [{},{},{}...]
 * @param {String} fileName 保存文件名
 */
export function exportCSV(str, dataList, fileName) {
    fileName = fileName || new Date().getTime();
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
    //构造Blob数据(text/plain纯文本格式)
    let blob = new Blob([str], { type: "text/plain;charset=utf-8" });
    //创建url和下载标签
    let url = window.URL.createObjectURL(blob);
    let link = document.createElement('a');
    link.href = url;
    link.download = fileName + '.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    //释放url对象
    window.URL.revokeObjectURL(url);
}

/**
* 表单方式方式（post请求）导出文件的方法
* 1. 无法知道进度
* 2. 无法直接下载浏览器可直接预览的文件类型(如txt、png、jpg、gif等)
* 3. 兼容性好，不会出现URL长度限制问题
* @param {string} url 请求接口
* @param {object} params 请求参数 (需要看前后端的参数约定)
*/
export function formExportFile(url, params = {}) {
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
 * 下载二进制数据(ajax请求需设置responseType: "blob"或"arraybuffer")
 * @param {Blob} data 二进制数据 必填
 * @param {string} fileName 文件名称 必填
 * @param {string} type 文件后缀 必填
 */
export function saveAsBinary(data, fileName, type) {
    if (!fileName || !type) {
        console.error("please set file name and file type");
    }

    // 转换成blob数据
    let blob = null;
    if (isBlob(data)) {
        blob = data;
    } else if (isArrayBuffer(data)) {
        blob = new Blob([data], { type: FileAndMIME[type] });
    } else {
        return;
    }

    // ie浏览器兼容
    if (window.navigator.msSaveOrOpenBlob) {
        navigator.msSaveBlob(blob, `${fileName}.${type}`);
    } else if (window.URL) {
        //创建a标签
        const link = document.createElement('a');
        //获取body元素
        const body = document.querySelector('body');
        //创建url链接
        link.href = window.URL.createObjectURL(blob);
        //重命名
        link.download = `${fileName}.${type}`;
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
 * ajax读取txt文件(本地或远程)
 * @param {string} url 路径
 */
export function readTxt(url) {
    let xhr = new XMLHttpRequest();
    let okStatus = document.loacation.protocol === "file:" ? 0 : 200;
    xhr.open('GET', url, false);
    // 强制解析为text/html
    xhr.overrideMimeType("text/html;charset=utf-8");
    xhr.send(null);
    return xhr.status === okStatus ? xhr.responseText : null;
}

/**
 * window.open方式(get请求)下载文件
 * 1. 会新开窗口下载
 * 2. 浏览器可直接浏览的文件类型是不提供下载的，如txt、png、jpg、gif等
 * 3. 不能添加header，也无法知道下载的进度
 * @param {*} url 请求接口或文件路径
 * @param {*} params url上的query参数
 */
export function downLoadByExplorer(url, params = {}) {
    //替换协议头为缺省协议,默认匹配当前协议
    url = url.replace(/^(http:|https:)/, '');
    const newUrl = setUrlQuery(params, url);
    window.open(newUrl);
}
