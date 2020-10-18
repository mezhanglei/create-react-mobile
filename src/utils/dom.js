import { isDom } from "./type";
/**
 * 返回目标元素相对于定位父元素的位置
 * @param {*} ele 元素
 * @param {*} target 指定的定位父元素
 */
export function getElementXY(ele, target = null) {
    let pos = [ele.offsetLeft, ele.offsetTop];
    let parentNode = ele.offsetParent;
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
                parentNode = parentNode.offsetParent;
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
export function isContains(root, child) {
    // let node = child;
    // while (node) {
    //     if (node === root) {
    //         return true;
    //     }
    //     node = node.parentNode;
    // }
    // return false;
    if (!root) {
        return false;
    }
    return root.contains(child);
};

// 获取页面的卷曲滚动高度(兼容写法)
export function getPageScroll(el) {
    const doc = el.ownerDocument; // 节点所在document对象
    const win = doc.defaultView; // 包含document的window对象
    const x = doc.documentElement.scrollLeft || win.pageXOffset || doc.body.scrollLeft;
    const y = doc.documentElement.scrollTop || win.pageYOffset || doc.body.scrollTop;
    return { x, y };
};

// 获取元素的相对于页面的位置
export function getPositionInPage(el) {
    const rect = el.getBoundingClientRect();
    const pos = {
        x: rect.left,
        y: rect.top
    };
    pos.x += getPageScroll(el).x;
    pos.y += getPageScroll(el).y;
    return pos;
};

/**
 * 给目标节点设置对象,并返回旧样式
 * @param {*} style 样式对象
 * @param {*} options {element: HTMLElement 默认document.body}
 */
export function setStyle(style, options = {}) {
    const { element = document.body } = options;
    const oldStyle = {};

    const styleKeys = Object.keys(style);

    styleKeys.forEach(key => {
        oldStyle[key] = element.style[key];
    });

    styleKeys.forEach(key => {
        element.style[key] = style[key];
    });

    return oldStyle;
}

/**
 * 判断目标元素内部是否可以滚动
 * @param {*} ele 内容可以scroll的元素
 */
export function eleCanScroll(ele) {
    if (!isDom(ele)) {
        return;
    }
    if (ele.scrollTop > 0) {
        return true;
    } else {
        ele.scrollTop++;
        // 元素不能滚动的话，scrollTop 设置不会生效，还会置为 0
        const top = ele.scrollTop;
        // 重置滚动位置
        top && (ele.scrollTop = 0);
        return top > 0;
    }
}

// 判断页面是否有滚动条
export function isBodyOverflowing() {
    return (
        document.body.scrollHeight >
        (window.innerHeight || document.documentElement.clientHeight) &&
        window.innerWidth > document.body.offsetWidth
    );
}

// 是否可以使用dom
export function canUseDom() {
    return !!(
        typeof window !== 'undefined' &&
        window.document &&
        window.document.createElement
    );
}
