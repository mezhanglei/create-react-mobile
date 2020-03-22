/**
 * 上传文件时将Blob数据转化为base64编码的DataURL字符串
 * @param {Object} blob Blob类型的数据
 */
export function blobToDataURL(blob) {
  //创建filereader对象
  let reader = new FileReader();
  //上传完成时的结果
  reader.onload = function(e) {
    //e.target.result便为base64编码的DataURL字符串
  }
  //将blob数据转化为base64编码的DataURL数据
  reader.readAsDataURL(blob);
}