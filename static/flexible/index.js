/**
 * 动态计算文档的根元素(font-size大小), 1rem = 屏幕宽度/10
 * 使用: 1. 通过本插件动态设置根元素字体大小来得到1rem = 屏幕宽度/10
 *       2. 根据屏幕的dpr来动态设置字体的大小.用来适配文字
 *       3. 然后通过pxtorem插件将页面中px转化成rem单位, 如果1rem = 37.5px, 则需要根据375px的ui图上的尺寸来写页面
 */
(function flexible(window, document) {
  // 文档
  var docEl = document.documentElement
  // 返回当前显示设备的物理像素分辨率与 CSS 像素分辨率的比率, 大于等于2表示高清屏
  var dpr = window.devicePixelRatio || 1

  // 根据dpr来设置body的font-szie大小
  function setBodyFontSize() {
    if (document.body) {
      document.body.style.fontSize = (12 * dpr) + 'px'
    }
    else {
      document.addEventListener('DOMContentLoaded', setBodyFontSize)
    }
  }
  setBodyFontSize();

  // 通过设置文档的font-szie来设置1rem = rem * 10 + 'px')
  function setRemUnit() {
    var rem = docEl.clientWidth / 10
    docEl.style.fontSize = rem + 'px'
  }

  setRemUnit()

  // 监听页面的窗口尺寸变化事件和展示事件从而动态设置文档的font-size大小
  window.addEventListener('resize', setRemUnit)
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) {
      setRemUnit()
    }
  })
}(window, document))
