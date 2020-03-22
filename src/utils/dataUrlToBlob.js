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