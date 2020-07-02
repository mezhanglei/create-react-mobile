/**
 * 返回目标元素相对于定位父元素的位置和定位父元素
 * @param {*} ele 元素
 * @param {*} target 指定的定位父元素，默认为空表示最外层父元素
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
    } else {
        parentNode = null;
    }
    return { pos, parentNode };
}


/**
 * 判断是不是dom
 * @param {*} ele 
 */
export function IsDOM(ele) {
    if (typeof HTMLElement === 'object') {
        return ele instanceof HTMLElement;
    } else {
        return ele && typeof ele === 'object' && ele.nodeType === 1 && typeof ele.nodeName === 'string';
    }
}

/**
 * 判断是不是NodeList类型的DOM伪数组
 * @param {*} ele 
 */
export function IsNodeList(ele) {
    if (Object.prototype.toString.call(ele) === '[object NodeList]') {
        return true;
    } else {
        return false;
    }
}
