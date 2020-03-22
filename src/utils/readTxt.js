/**
 * ajax读取本地txt文件得到web格式文本
 * @param {string} url 本地文件的相对路径 
 */
export function readTxt(url) {
  let xhr = new XMLHttpRequest(),
  okStatus = document.loacation.protocol === "file:" ? 0 : 200;
  xhr.open('GET', url, false);
  xhr.overrideMimeType("text/html;charset=utf-8");
  xhr.send(null);
  return xhr.status === okStatus ? xhr.responseText : null
}