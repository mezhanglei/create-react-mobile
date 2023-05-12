let requestAnimationFrame = (function () {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    }
  );
})();
// 获取当前滚动的高度
const getScrollTop = function (Dom) {
  return Dom.scrollTop;
};
// 设置滚动条
const setScrollTo = function (Dom, value) {
  Dom.scrollTo(0, value);
  return value;
};
// 滚动
const smoothScroll = function (Dom, to, duration = 500) {
  if (duration < 0) {
    setScrollTo(Dom, to);
    return;
  }
  let diff = to - getScrollTop(Dom);
  if (diff === 0) return;
  let step = (diff / duration) * 10;
  requestAnimationFrame(function () {
    if (Math.abs(step) > Math.abs(diff)) {
      setScrollTo(Dom, getScrollTop(Dom) + diff);
      return;
    }
    setScrollTo(Dom, getScrollTop(Dom) + step);
    if ((diff > 0 && getScrollTop(Dom) >= to) || (diff < 0 && getScrollTop(Dom) <= to)) {
      return;
    }
    smoothScroll(Dom, to, duration - 20);
  });
};
export default {
  getScrollTop,
  setScrollTo,
  smoothScroll,
};
