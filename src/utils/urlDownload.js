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
 * 下载文件并重命名
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