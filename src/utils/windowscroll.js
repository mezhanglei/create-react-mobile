
/**
 * 利用window.scrollTo()实现页面匀速滚动动画
 * @param {Number} currentY 当前所在的高度
 * @param {Number} targetY 将要达到的目标高度
 * @param {Number} step 步长
 * @param {Number} time 每次执行时间间隔,单位ms
 */
export default function scroll(currentY, targetY, step=10, time=0) {
  clearInterval(document.timeID)
  document.timeID = setInterval(function () {
    //  向下运动
    if (currentY < targetY) {
      currentY += step;
      window.scrollTo(0, currentY);
      if (currentY > targetY) {  //边界检测
        window.scrollTo(0, targetY);
        clearInterval(document.timeID);
      }
      // 向上运动
    } else {
      currentY -= step;
      window.scrollTo(0, currentY);
      if (currentY <= targetY) {   //边界检测
        window.scrollTo(0, targetY);
        clearInterval(document.timeID);
      }
    }
  }, time)
}
