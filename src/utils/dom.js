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
