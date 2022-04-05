import { CSSProperties } from "react";
import { isDom } from "./type";
import { findInArray } from "./array";

/**
 * 接收类名或节点，返回节点
 * @param target 目标参数
 */
export const findElement = (target: any): null | HTMLElement => {
  let result = null;
  if (typeof target === "string") {
    result = document.querySelector(target);
  } else if (isDom(target)) {
    result = target;
  }
  return result;
};

// 返回目标元素的兄弟节点
export const findSiblingsElement = (target: HTMLElement, containOwner?: boolean) => {
  if (target && !isDom(target)) return;
  const ret = [];    //保存所有兄弟节点
  const childs = target?.parentNode?.children || []; //获取父级的所有子节点
  for (let i = 0; i < childs?.length; i++) {
    // 去掉本身
    if (isDom(childs[i]) && (containOwner || childs[i] != target)) {
      ret.push(childs[i]);
    }
  }
  return ret as HTMLElement[];
}

/**
 * 返回目标元素相对于定位父元素的位置
 * @param {*} ele 元素
 * @param {*} target 指定的定位父元素
 */
export function getAbsolute(ele: HTMLElement, parent: HTMLElement): { x: number, y: number } | undefined {

  if (isDom(ele) || !isContains(parent, ele)) {
    return;
  }

  let pos = {
    x: ele.offsetLeft,
    y: ele.offsetTop
  };
  let parentNode: any = ele.offsetParent;

  while (parentNode !== parent) {
    parentNode = parentNode?.offsetParent;
    pos = {
      x: pos?.x + parentNode?.offsetLeft,
      y: pos?.y + parentNode?.offsetTop
    }
  }

  return pos;
}

// 获取当前的window
export const getWindow = (node: any) => {
  // if node is not the window object
  if (node.toString() !== '[object Window]') {
    // get the top-level document object of the node, or null if node is a document.
    const { ownerDocument } = node;
    // get the window object associated with the document, or null if none is available.
    return ownerDocument ? ownerDocument.defaultView || window : window;
  }
};

/**
 * 返回元素的视窗内的位置
 * @param el 
 * @returns 
 */
export function getRect(el: HTMLElement) {
  return el.getBoundingClientRect()
}

/**
 * 判断根元素是不是包含目标元素
 * @param {*} root 根元素
 * @param {*} child 目标元素
 */
export function isContains(root: HTMLElement, child: HTMLElement): boolean {
  if (!root || root === child) return false;
  return root.contains(child);
};

/**
 * 查询元素是否在某个元素内
 * @param el 元素
 * @param parent 父元素
 */
export function matchParent(el: any, parent: HTMLElement): boolean {
  let node = el;
  do {
    if (node === parent) return true;
    if ([document.documentElement, document.body].includes(node)) return false;
    node = node.parentNode;
  } while (node);

  return false;
}

/**
 * 获取屏幕触摸标识
 * @param e 触摸事件对象
 * @param identifier 触摸标识
 */
export function getTouchIdentifier(e: TouchEvent, identifier?: number): number {
  if (identifier) {
    return (e?.targetTouches && findInArray(e?.targetTouches, item => identifier === item?.identifier)) ||
      (e?.changedTouches && findInArray(e?.changedTouches, item => identifier === item?.identifier));
  } else {
    return (e?.targetTouches && e?.targetTouches[0]?.identifier) || (e?.changedTouches && e?.changedTouches[0]?.identifier)
  }
}

/**
 * 设置滚动距离（兼容写法）
 * @param ele 目标元素
 * @param x 横轴坐标
 * @param y 纵轴坐标
 */
export function setScroll(ele: HTMLElement, x: number, y: number): void {
  const win = getWindow(ele);
  if ([document.documentElement, document.body].includes(ele)) {
    document.documentElement.scrollTop = y || 0;
    document.documentElement.scrollLeft = x || 0;
  } else {
    if (ele) {
      ele.scrollTop = y || 0;
      ele.scrollLeft = x || 0;
    } else if (win) {
      win.scrollTo(x || 0, y || 0);
    }
  }
};

/**
 * 获取页面或元素的卷曲滚动(兼容写法)
 * @param el 目标元素
 */
export function getScroll(el: HTMLElement): undefined | {
  x: number;
  y: number;
} {
  if (!isDom(el)) {
    return;
  }
  if ([document.documentElement, document.body].includes(el)) {
    const doc = el.ownerDocument; // 节点所在document对象
    const win: any = getWindow(doc); // 包含document的window对象
    const x = doc.documentElement.scrollLeft || win.pageXOffset || doc.body.scrollLeft;
    const y = doc.documentElement.scrollTop || win.pageYOffset || doc.body.scrollTop;
    return { x, y };
  } else {
    const x = el.scrollLeft;
    const y = el.scrollTop;
    return { x, y };
  }
};

// 事件对象在屏幕的位置
export function getScreenXY(e: MouseEvent | TouchEvent): null | { x: number, y: number } {
  let pos = null;
  if ("clientX" in e) {
    pos = {
      x: e.screenX,
      y: e.screenY
    };
  } else if ("touches" in e) {
    if (e.touches[0]) {
      pos = {
        x: e.touches[0]?.screenX,
        y: e.touches[0]?.screenY
      };
    }
  }
  return pos;
};

// 获取页面或元素的可视宽高(兼容写法, 不包括工具栏和滚动条及边框)
export function getClientWH(el: HTMLElement): undefined | {
  width: number;
  height: number;
} {
  if (!isDom(el)) {
    return;
  }
  const win = getWindow(el);
  if ([document.documentElement, document.body].includes(el)) {
    const width = el.clientWidth || win.screen.availWidth;
    const height = el.clientHeight || win.screen.availHeight;
    return { width, height };
  } else {
    const width = el.clientWidth;
    const height = el.clientHeight;
    return { width, height };
  }
};

// 获取页面或元素的宽高 = 可视宽高 + 滚动条 + 边框
export function getOffsetWH(el: HTMLElement): undefined | {
  width: number;
  height: number;
} {
  if (!isDom(el)) {
    return;
  }
  if ([document.documentElement, document.body].includes(el)) {
    const win = getWindow(el);
    const width = win.innerWidth;
    const height = win.innerHeight;
    return { width, height };
  } else {
    const width = el.offsetWidth;
    const height = el.offsetHeight;
    return { width, height };
  }
};

// 返回元素或事件对象的视口位置
export function getClientXY(el: MouseEvent | TouchEvent | HTMLElement): null | {
  x: number;
  y: number;
} {
  let pos = null;
  if ("clientX" in el) {
    pos = {
      x: el.clientX,
      y: el.clientY
    };
  } else if ("touches" in el) {
    if (el?.touches[0]) {
      pos = {
        x: el.touches[0]?.clientX,
        y: el.touches[0]?.clientY
      };
    }
  } else if (isDom(el)) {
    if ([document.documentElement, document.body].includes(el)) {
      pos = {
        x: 0,
        y: 0
      }
    } else {
      pos = {
        x: getRect(el)?.left,
        y: getRect(el).top
      };
    }
  }
  return pos;
}

// 获取在父元素内的视口位置
export function getClientXYInParent(el: HTMLElement, parent: HTMLElement = document.body || document.documentElement) {
  if ([document.documentElement, document.body].includes(parent)) {
    return getClientXY(el);
  } else if (parent) {
    const top = getRect(el).top - getRect(parent).top;
    const left = getRect(el).left - getRect(parent).left;
    return {
      x: left,
      y: top
    }
  }
}

// 目标在父元素内的四条边位置信息
export function getInsidePosition(el: HTMLElement, parent: HTMLElement = document.body || document.documentElement): null | {
  left: number;
  top: number;
  right: number;
  bottom: number;
} {
  let pos = null;
  if (isDom(el)) {
    const nodeOffset = getOffsetWH(el);
    if (!nodeOffset) return null;
    const borderLeftWidth = parseFloat(getComputedStyle(parent)?.borderLeftWidth) || 0;
    const borderTopWidth = parseFloat(getComputedStyle(parent)?.borderTopWidth) || 0;

    const top = getRect(el).top - getRect(parent).top - borderTopWidth;
    const left = getRect(el).left - getRect(parent).left - borderLeftWidth;

    return {
      left,
      top,
      right: left + nodeOffset?.width,
      bottom: top + nodeOffset?.height
    }
  }
  return pos;
}


/**
 * 返回事件对象相对于父元素的真实位置
 * @param el 事件对象
 * @param parent 父元素
 */
export function getEventPosition(el: MouseEvent | TouchEvent, parent: HTMLElement = document.body || document.documentElement): null | {
  x: number;
  y: number;
} {
  let pos = null;
  if ("clientX" in el) {
    pos = {
      x: el?.clientX - getRect(parent).left,
      y: el?.clientY - getRect(parent).top,
    };
  } else if ("touches" in el) {
    if (el?.touches[0]) {
      pos = {
        x: el?.touches[0]?.clientX - getRect(parent).left,
        y: el?.touches[0]?.clientY - getRect(parent).top
      };
    }
  }

  return pos;
}

// 目标在父元素四条内边框距离信息
export function getInsideRange(el: HTMLElement, parent: HTMLElement): null | {
  left: number;
  top: number;
  right: number;
  bottom: number;
} {
  let pos = null;
  if (isDom(el)) {
    const parentScrollW = parent?.scrollWidth || 0;
    const parentScrollH = parent?.scrollHeight || 0;
    const borderLeftWidth = parseFloat(getComputedStyle(parent)?.borderLeftWidth) || 0;
    const borderTopWidth = parseFloat(getComputedStyle(parent)?.borderTopWidth) || 0;
    const nodeW = getOffsetWH(el)?.width || 0;
    const nodeH = getOffsetWH(el)?.height || 0;

    const top = getRect(el).top - getRect(parent).top - borderTopWidth;
    const left = getRect(el).left - getRect(parent).left - borderLeftWidth;

    return {
      left,
      top,
      right: parentScrollW - (left + nodeW),
      bottom: parentScrollH - (top + nodeH)
    }
  }
  return pos;
}

/**
 * 给目标节点设置样式,并返回旧样式
 * @param {*} style 样式对象
 * @param {*} node 目标元素
 */
export function setStyle(style: CSSProperties, node: HTMLElement = document.body || document.documentElement): CSSProperties {
  const oldStyle: CSSProperties = {};

  const styleKeys: string[] = Object.keys(style);

  styleKeys.forEach(key => {
    oldStyle[key] = (node.style)[key];
  });

  styleKeys.forEach(key => {
    (node.style)[key] = style[key];
  });

  return oldStyle;
}

/**
 * 判断目标元素内部是否可以滚动
 * @param {*} ele 内容可以scroll的元素
 */
export function eleCanScroll(ele: HTMLElement): boolean {
  if (!isDom(ele)) {
    return false;
  }
  if (ele.scrollTop > 0) {
    return true;
  } else {
    ele.scrollTop++;
    const top = ele.scrollTop;
    return top > 0;
  }
}

/**
 * 获取目标元素的可滚动父元素
 * @param {*} target 目标元素
 * @param {*} step 遍历层数，设置可以限制向上冒泡查找的层数
 */
export function getScrollParent(target: any, step?: number): HTMLElement {
  const root = [document.documentElement, document.body];
  if (root.indexOf(target) > -1) {
    return document.body || document.documentElement;
  };

  let scrollParent = target?.parentNode;

  if (step) {
    while (root.indexOf(scrollParent) == -1 && step > 0) {
      if (eleCanScroll(scrollParent)) {
        return scrollParent;
      }
      scrollParent = scrollParent.parentNode;
      step--;
    }
  } else {
    while (root.indexOf(scrollParent) == -1) {
      if (eleCanScroll(scrollParent)) {
        return scrollParent;
      }
      scrollParent = scrollParent.parentNode;
    }
  }
  return document.body || document.documentElement;
};

// 是否可以使用dom
export function canUseDom(): boolean {
  return !!(
    typeof window !== 'undefined' &&
    window.document &&
    window.document.createElement
  );
}

export const insertBefore = (newElement: HTMLElement, targetElement: HTMLElement) => {
  const parentElement = targetElement.parentNode;
  if (!parentElement) return;
  (parentElement as HTMLElement).insertBefore(newElement, targetElement);
}

export const insertAfter = (newElement: HTMLElement, targetElement: HTMLElement) => {
  const parentElement = targetElement.parentNode;
  if (!parentElement) return;
  if ((parentElement as HTMLElement).lastChild == targetElement) {
    (parentElement as HTMLElement).appendChild(newElement);
  } else {
    (parentElement as HTMLElement).insertBefore(newElement, targetElement.nextElementSibling);
  }
}

export interface BoundingRect {
  left: number;
  top: number;
  right: number;
  bottom: number;
}
// 判断两个元素是否碰撞
export const isBump = (move: BoundingRect, other: BoundingRect) => {
  let l1 = move?.left
  let t1 = move?.top
  let r1 = move?.right
  let b1 = move?.bottom

  let l2 = other?.left
  let t2 = other?.top
  let r2 = other?.right
  let b2 = other?.bottom

  return !(r1 - l2 < 0 || b1 - t2 < 0 || r2 - l1 < 0 || b2 - t1 < 0)
}

export const getDirection = (e: MouseEvent | TouchEvent, ele: any) => {
  const eventXY = getEventPosition(e, ele);
  const offsetWH = getOffsetWH(ele);
  if (!eventXY || !offsetWH) return '';
  const { x, y } = eventXY;
  const { width, height } = offsetWH;
  const midX = width / 2;
  const midY = height / 2;
  let direction = [];

  if (y > 0 && y < midY) {
    direction.push('top');
  } else if (y > midY && y < height) {
    direction.push('bottom')
  }
  if (x > 0 && x < midX) {
    direction.push('left')
  } else if (x > midX && x < width) {
    direction.push('right')
  }
  return direction;
}

// 获取元素指定的属性值
export function css(el: any, key?: string) {
  const win = getWindow(el);
  let elStyle;
  if (win) {
    elStyle = win.getComputedStyle(el);
  } else {
    elStyle = el.currentStyle;
  }

  return typeof key === 'string' ? elStyle[key] : elStyle;
}

// 获取当前元素的前面的兄弟元素
export const prevAll = function (node: HTMLElement) {
  const _parent = node.parentNode;
  const children = _parent?.children || [];
  const siblings = [];
  for (let i = 0; i < children?.length; i++) {
    const _childI = children[i];
    if (_childI == node) {
      break;
    }
    siblings.push(_childI);
  }
  return siblings;
};

// 获取当前元素之后的兄弟元素
export const nextAll = function (node: HTMLElement) {
  const _parent = node.parentNode;
  const children = _parent?.children || [];
  const siblings = [];
  for (let i = children?.length - 1; i >= 0; i--) {
    const _childI = children[i];
    if (_childI == node) {
      break;
    }
    siblings.unshift(_childI);
  }
  return siblings;

}


/**
 * 添加事件监听
 * @param el 目标元素
 * @param event 事件名称
 * @param handler 事件函数
 * @param inputOptions 配置
 */
export function addEvent(el: any, event: string, handler: (...rest: any[]) => any, inputOptions?: {
  captrue?: boolean,
  once?: boolean,
  passive?: boolean
}): void {
  if (!el) return;
  // captrue: true事件捕获 once: true只调用一次,然后销毁 passive: true不调用preventDefault
  const options = { capture: false, once: false, passive: false, ...inputOptions };
  if (el.addEventListener) {
    el.addEventListener(event, handler, options);
  } else if (el.attachEvent) {
    el.attachEvent('on' + event, handler);
  } else {
    // $FlowIgnore: Doesn't think elements are indexable
    el['on' + event] = handler;
  }
}

/**
 * 移除事件监听
 * @param el 目标元素
 * @param event 事件名称
 * @param handler 事件函数
 * @param inputOptions 配置
 */
export function removeEvent(el: any, event: string, handler: (...rest: any[]) => any, inputOptions?: {
  captrue?: boolean,
  once?: boolean,
  passive?: boolean
}): void {
  if (!el) return;
  const options = { capture: false, once: false, passive: false, ...inputOptions };
  if (el.removeEventListener) {
    el.removeEventListener(event, handler, options);
  } else if (el.detachEvent) {
    el.detachEvent('on' + event, handler);
  } else {
    // $FlowIgnore: Doesn't think elements are indexable
    el['on' + event] = null;
  }
}
