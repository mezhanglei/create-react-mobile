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
    let node = child;
    while (node) {
        if (node === root) {
            return true;
        }
        node = node.parentNode;
    }
    return false;
};

// 获取页面的卷曲滚动高度(兼容写法)
export function getPageScroll() {
    const x = document.documentElement.scrollLeft || window.pageXOffset || document.body.scrollLeft;
    const y = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
    return { x, y };
};

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
