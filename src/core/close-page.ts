// 关闭当前页面
export function closePage() {
  if (confirm("您确定要关闭本页吗？")) {
    window.opener = null;
    window.open('', '_self');
    window.close();
  }
}
