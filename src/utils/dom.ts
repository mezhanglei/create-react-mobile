import { CSSProperties } from "react";
import { isDom } from "./type";
/**
 * 返回目标元素相对于定位父元素的位置
 * @param {*} ele 元素
 * @param {*} target 指定的定位父元素
 */
export function getElementXY(ele: HTMLElement, target: HTMLElement | null = null): any {
    let pos = [ele.offsetLeft, ele.offsetTop];
    let parentNode = ele.offsetParent as HTMLElement;
    let flag = true;
    if (parentNode != ele) {
        while (parentNode && flag) {
            pos[0] += parentNode.offsetLeft;
            pos[1] += parentNode.offsetTop;
            //  如果找到目标节点则终止循环
            if (parentNode === target) {
                parentNode = target;
                flag = false;
                // 目标不为空则继续寻找
            } else {
                parentNode = parentNode.offsetParent as HTMLElement;
            }
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
    if (!root) {
        return false;
    }
    return root.contains(child);
};

// 滚动的兼容
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

// 获取页面或元素的卷曲滚动(兼容写法)
export function getScroll(el: HTMLElement = (document.body || document.documentElement)): any {
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
export function getClient(el: HTMLElement = (document.body || document.documentElement)): any {
    if (!isDom(el)) {
        return;
    }
    if (el === document.body || el === document.documentElement) {
        const x = el.clientWidth || window.screen.availWidth;
        const y = el.clientHeight || window.screen.availHeight;
        return { x, y };
    } else {
        const x = el.clientWidth;
        const y = el.clientHeight;
        return { x, y };
    }
};

// 获取元素或事件对象的相对于页面的真实位置 = 滚动高度 + 可视位置
export function getPositionInPage(el: MouseEvent | TouchEvent | HTMLElement): any {

    let pos = {};
    if (el instanceof MouseEvent) {
        pos = {
            x: el.clientX + getScroll().x,
            y: el.clientY + getScroll().y
        };
    } else if (el instanceof TouchEvent) {
        pos = {
            x: el.touches[0].clientX + getScroll().x,
            y: el.touches[0].clientY + getScroll().y
        };
    } else if (isDom(el)) {
        pos = {
            x: el.getBoundingClientRect().left + getScroll().x,
            y: el.getBoundingClientRect().top + getScroll().y
        };
    }

    return pos;
};

// 获取元素或事件对象的相对于父元素的真实位置 = 可视位置 - 父元素的可视位置 + 父元素的卷曲滚动距离
export function getPositionInParent(el: MouseEvent | TouchEvent | HTMLElement, parent: HTMLElement): any {
    let pos = {};
    if (el instanceof MouseEvent) {
        pos = {
            x: el.clientX - parent.getBoundingClientRect().left + getScroll(parent).x,
            y: el.clientY - parent.getBoundingClientRect().top + getScroll(parent).y
        };
    } else if (el instanceof TouchEvent) {
        pos = {
            x: el.touches[0].clientX - parent.getBoundingClientRect().left + getScroll(parent).x,
            y: el.touches[0].clientY - parent.getBoundingClientRect().top + getScroll(parent).y
        };
    } else if (isDom(el)) {
        pos = {
            x: el.getBoundingClientRect().left - parent.getBoundingClientRect().left + getScroll(parent).x,
            y: el.getBoundingClientRect().top - parent.getBoundingClientRect().top + getScroll(parent).y
        };
    }

    return pos;
};

/**
 * 给目标节点设置对象,并返回旧样式
 * @param {*} style 样式对象
 * @param {*} options {element: HTMLElement 默认document.body}
 */
interface OptionsType {
    element: HTMLElement,
    [propName: string]: any;
}

export function setStyle(style: any, options: OptionsType) {
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
export function getScrollParent(target: any, step?: number) {
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
export function canUseDom() {
    return !!(
        typeof window !== 'undefined' &&
        window.document &&
        window.document.createElement
    );
}

// 添加事件监听
interface InputOptionsType {
    captrue?: boolean,
    once?: boolean,
    passive?: boolean 
}
export function addEvent(el: any, event: MouseEvent | TouchEvent, handler: () => any, inputOptions?: InputOptionsType) {
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

// 移除事件监听
export function removeEvent(el: any, event: MouseEvent | TouchEvent, handler: () => any, inputOptions?: InputOptionsType) {
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
