import { CSSProperties } from "react";
import { isDom } from "./type";
import { findInArray } from "./array";

/**
 * 接收类名或节点，返回节点
 * @param target 目标参数
 */
export const findElement = (target: string | HTMLElement): any => {
    let result = null;
    if (typeof target === "string") {
        result = document.querySelector(target);
    } else if (isDom(target)) {
        result = target;
    }
    return result;
};

/**
 * 返回目标元素相对于定位父元素的位置
 * @param {*} ele 元素
 * @param {*} target 指定的定位父元素
 */
export function getElementXY(ele: HTMLElement, parent: HTMLElement): { x: number, y: number } | undefined {

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
        if ((node === document.body) || (node === document.documentElement)) return false;
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
    if (ele === document.body) {
        if (document.documentElement) {
            document.documentElement.scrollTop = y || 0;
            document.documentElement.scrollLeft = y || 0;
        } else if (window) {
            window.scrollTo(x || 0, y || 0);
        }
    } else {
        ele.scrollTop = y || 0;
        ele.scrollLeft = x || 0;
    }
};

/**
 * 获取页面或元素的卷曲滚动(兼容写法)
 * @param el 目标元素
 */
export interface ScrollInterface {
    x: number;
    y: number;
}
export function getScroll(el: HTMLElement = (document.body || document.documentElement)): undefined | ScrollInterface {
    if (!isDom(el)) {
        return;
    }
    if (el === document.body || el === document.documentElement) {
        const doc = el.ownerDocument; // 节点所在document对象
        const win: any = doc.defaultView; // 包含document的window对象
        const x = doc.documentElement.scrollLeft || win.pageXOffset || doc.body.scrollLeft;
        const y = doc.documentElement.scrollTop || win.pageYOffset || doc.body.scrollTop;
        return { x, y };
    } else {
        const x = el.scrollLeft;
        const y = el.scrollTop;
        return { x, y };
    }
};

// 获取页面或元素的可视宽高(兼容写法, 不包括工具栏和滚动条)
export interface ClientInterface {
    width: number;
    height: number;
}
export function getClientWH(el: HTMLElement = (document.body || document.documentElement)): undefined | ClientInterface {
    if (!isDom(el)) {
        return;
    }
    if (el === document.body || el === document.documentElement) {
        const width = el.clientWidth || window.screen.availWidth;
        const height = el.clientHeight || window.screen.availHeight;
        return { width, height };
    } else {
        const width = el.clientWidth;
        const height = el.clientHeight;
        return { width, height };
    }
};

// 返回元素或事件对象的可视位置
export interface SizeInterface {
    x: number;
    y: number;
}
export function getClientXY(el: MouseEvent | TouchEvent | HTMLElement): null | SizeInterface {
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
        pos = {
            x: el.getBoundingClientRect().left,
            y: el.getBoundingClientRect().top
        };
    }
    return pos;
}

/**
 * 获取元素或事件对象的相对于页面的真实位置 = 滚动高度 + 可视位置
 * @param el 元素或事件对象
 */
export function getPositionInPage(el: MouseEvent | TouchEvent | HTMLElement): null | SizeInterface {
    const clientXY = getClientXY(el);
    const scroll = getScroll();
    let pos = null;
    if (clientXY) {
        pos = {
            x: clientXY.x + (scroll?.x || 0),
            y: clientXY.y + (scroll?.y || 0)
        }
    }
    return pos;
};


/**
 * 返回元素或事件对象相对于父元素的窗口位置
 * @param el 元素或事件对象
 * @param parent 父元素
 */
export function getClientXYInParent(el: MouseEvent | TouchEvent | HTMLElement, parent: HTMLElement): null | SizeInterface {
    let pos = null;
    if ("clientX" in el) {
        pos = {
            x: el?.clientX - parent.getBoundingClientRect().left,
            y: el?.clientY - parent.getBoundingClientRect().top
        };
    } else if ("touches" in el) {
        if (el?.touches[0]) {
            pos = {
                x: el?.touches[0]?.clientX - parent.getBoundingClientRect().left,
                y: el?.touches[0]?.clientY - parent.getBoundingClientRect().top
            };
        }
    } else if (isDom(el)) {
        pos = {
            x: el.getBoundingClientRect().left - parent.getBoundingClientRect().left,
            y: el.getBoundingClientRect().top - parent.getBoundingClientRect().top
        };
    }

    return pos;
}


/**
 * 获取元素或事件对象的相对于父元素的真实位置 = 可视位置 - 父元素的可视位置 + 父元素的卷曲滚动距离
 * @param el 元素或事件对象
 * @param parent 父元素
 */
export function getPositionInParent(el: MouseEvent | TouchEvent | HTMLElement, parent: HTMLElement): null | SizeInterface {
    const clientXY = getClientXYInParent(el, parent);
    const scroll = getScroll(parent);
    let pos = null;
    if (clientXY) {
        pos = {
            x: clientXY.x + (scroll?.x || 0),
            y: clientXY.y + (scroll?.y || 0),
        }
    }

    return pos;
};

/**
 * 给目标节点设置样式,并返回旧样式
 * @param {*} style 样式对象
 * @param {*} options {element: HTMLElement 默认document.body}
 */
interface OptionsType {
    element?: HTMLElement,
    [propName: string]: any;
}
export function setStyle(style: any, options: OptionsType = {}): CSSProperties {
    const { element = document.body } = options;
    const oldStyle: any = {};

    const styleKeys: string[] = Object.keys(style);

    styleKeys.forEach(key => {
        oldStyle[key] = (element.style as any)[key];
    });

    styleKeys.forEach(key => {
        (element.style as any)[key] = (style as any)[key];
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
    const root = [document.body, document.documentElement];
    if (root.indexOf(target) > -1) {
        return document.body || document.documentElement;
    };

    let scrollParent = target.parentNode;

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

/**
 * 添加事件监听
 * @param el 目标元素
 * @param event 事件名称
 * @param handler 事件函数
 * @param inputOptions 配置
 */
interface InputOptionsType {
    captrue?: boolean,
    once?: boolean,
    passive?: boolean
}
export function addEvent(el: any, event: string, handler: (...rest: any[]) => any, inputOptions?: InputOptionsType): void {
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
export function removeEvent(el: any, event: string, handler: (...rest: any[]) => any, inputOptions?: InputOptionsType): void {
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
