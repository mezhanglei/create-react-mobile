
/**
 * 实现本地图片预览
 * 
 * @param {object} file 表示文件对象
 */
export function imageView(file) {
  //h5 获取base64编码的Data类型url字符串(针对小文件如图片)
  if (window.FileReader) {
    let f = new FileReader();
    f.onload = function (e) {
      //e.target.result便为base64编码的Data类型URL字符串,直接给图片赋值
    }
    f.readAsDataURL(file);
    //通过创建一个指向该文件的路径url
  } else if (window.URL) {
    // url = window.URL.createObjectURL(file)
  }
}