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
  let blob = new Blob([str], {type: "text/plain;charset=utf-8"});
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