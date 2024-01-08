import { isMobile } from "@/utils/brower";
import { addEvent, removeEvent, getScreenXY } from "@/utils/dom";

const eventsFor = {
  touch: {
    move: 'touchmove',
    keydown: 'keydown'
  },
  mouse: {
    move: 'mousemove',
    keydown: 'keydown'
  }
};

const dragEventFor = isMobile() ? eventsFor.touch : eventsFor.mouse;

/**
 * 监听页面超时
 * @param callback 超时后执行的函数
 * @param maxNum 限制时间(秒)
 */
const actionListener = (callback: (arg?: any) => any, maxNum: number) => {
  let count = 0;
  let x: number | undefined;
  let y: number | undefined;

  // 事件对象移动事件
  const onMove = (e: MouseEvent | TouchEvent) => {
    const x1 = getScreenXY(e)?.x;
    const y1 = getScreenXY(e)?.y;
    if (x !== x1 || y !== y1) {
      count = 0;
    }
    x = x1;
    y = y1;
  };

  // 键盘事件
  const onKeyDown = () => {
    count = 0;
  };

  // 计时器
  const countTime = () => {
    count++;
    if (count >= maxNum) {
      const ret = callback();
      count = 0;
      // 返回true时清除定时器监听
      if (ret) {
        clearInterval(timer);
        removeEvent(document, dragEventFor.move, onMove);
        removeEvent(document, dragEventFor.keydown, onKeyDown);
      }
    }
  };

  addEvent(document, dragEventFor.move, onMove);
  addEvent(document, dragEventFor.keydown, onKeyDown);
  const timer = setInterval(countTime, 1000);
};

export default actionListener;
