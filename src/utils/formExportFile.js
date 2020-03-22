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
  for(let key in params) {
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