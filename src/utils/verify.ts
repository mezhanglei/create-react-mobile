/**
 * 校验
 */

// 判断是不是JSON字符串
export const isJSON = (value?: unknown) => {
  if (typeof value == 'string') {
    try {
      const obj = JSON.parse(value);
      if (typeof obj == 'object' && obj) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  } else { return false; }
};

// 判断是否为触摸事件
export const isEventTouch = (e: Event) => {
  return "touches" in e || "targetTouches" in e || "changedTouches" in e;
};

// 是否为SVG元素
export const isElementSVG = (el?: unknown) => {
  return typeof window.SVGElement !== 'undefined' && el instanceof window.SVGElement;
};
