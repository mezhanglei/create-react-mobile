// @flow
import { findInArray, isFunction, int } from './shims';
import browserPrefix, { browserPrefixToKey } from './getPrefix';

let matchesSelectorFunc = '';
export function matchesSelector(el, selector) {
    if (!matchesSelectorFunc) {
        matchesSelectorFunc = findInArray([
            'matches',
            'webkitMatchesSelector',
            'mozMatchesSelector',
            'msMatchesSelector',
            'oMatchesSelector'
        ], function (method) {
            // $FlowIgnore: Doesn't think elements are indexable
            return isFunction(el[method]);
        });
    }

    // Might not be found entirely (not an Element?) - in that case, bail
    // $FlowIgnore: Doesn't think elements are indexable
    if (!isFunction(el[matchesSelectorFunc])) return false;

    // $FlowIgnore: Doesn't think elements are indexable
    return el[matchesSelectorFunc](selector);
}

// Works up the tree to the draggable itself attempting to match selector.
export function matchesSelectorAndParentsTo(el, selector, baseNode) {
    let node = el;
    do {
        if (matchesSelector(node, selector)) return true;
        if (node === baseNode) return false;
        node = node.parentNode;
    } while (node);

    return false;
}

// 添加事件监听兼容处理
export function addEvent(el, event, handler, inputOptions) {
    if (!el) return;
    const options = { capture: true, ...inputOptions };
    if (el.addEventListener) {
        el.addEventListener(event, handler, options);
    } else if (el.attachEvent) {
        el.attachEvent('on' + event, handler);
    } else {
        // $FlowIgnore: Doesn't think elements are indexable
        el['on' + event] = handler;
    }
}

export function removeEvent(el, event, handler, inputOptions) {
    if (!el) return;
    const options = { capture: true, ...inputOptions };
    if (el.removeEventListener) {
        el.removeEventListener(event, handler, options);
    } else if (el.detachEvent) {
        el.detachEvent('on' + event, handler);
    } else {
        // $FlowIgnore: Doesn't think elements are indexable
        el['on' + event] = null;
    }
}

export function outerHeight(node) {
    // This is deliberately excluding margin for our calculations, since we are using
    // offsetTop which is including margin. See getBoundPosition
    let height = node.clientHeight;
    const computedStyle = node.ownerDocument.defaultView.getComputedStyle(node);
    height += int(computedStyle.borderTopWidth);
    height += int(computedStyle.borderBottomWidth);
    return height;
}

export function outerWidth(node) {
    // This is deliberately excluding margin for our calculations, since we are using
    // offsetLeft which is including margin. See getBoundPosition
    let width = node.clientWidth;
    const computedStyle = node.ownerDocument.defaultView.getComputedStyle(node);
    width += int(computedStyle.borderLeftWidth);
    width += int(computedStyle.borderRightWidth);
    return width;
}
export function innerHeight(node) {
    let height = node.clientHeight;
    const computedStyle = node.ownerDocument.defaultView.getComputedStyle(node);
    height -= int(computedStyle.paddingTop);
    height -= int(computedStyle.paddingBottom);
    return height;
}

export function innerWidth(node) {
    let width = node.clientWidth;
    const computedStyle = node.ownerDocument.defaultView.getComputedStyle(node);
    width -= int(computedStyle.paddingLeft);
    width -= int(computedStyle.paddingRight);
    return width;
}

// 获取相对于定位父元素的位置 = 事件对象可视位置 + 滚动距离 - 定位父元素的可视位置
export function offsetXYFromParent(evt, offsetParent, scale) {
    const isBody = offsetParent === offsetParent.ownerDocument.body;
    const offsetParentRect = isBody ? { left: 0, top: 0 } : offsetParent.getBoundingClientRect();

    const x = (evt.clientX + offsetParent.scrollLeft - offsetParentRect.left) / scale;
    const y = (evt.clientY + offsetParent.scrollTop - offsetParentRect.top) / scale;

    return { x, y };
}

// 设置css的transform
export function createCSSTransform(controlPos, positionOffset) {
    const translation = getTranslation(controlPos, positionOffset, 'px');
    return { [browserPrefixToKey('transform', browserPrefix)]: translation };
}

// 设置svg的transform
export function createSVGTransform(controlPos, positionOffset) {
    const translation = getTranslation(controlPos, positionOffset, '');
    return translation;
}

// 获取设置后的translate位置 {x, y表示目前的translate位置} positionOffset表示要设置的translate位置
export function getTranslation({ x, y }, positionOffset, unitSuffix) {
    let translation = `translate(${x}${unitSuffix},${y}${unitSuffix})`;
    if (positionOffset) {
        const defaultX = `${(typeof positionOffset.x === 'string') ? positionOffset.x : positionOffset.x + unitSuffix}`;
        const defaultY = `${(typeof positionOffset.y === 'string') ? positionOffset.y : positionOffset.y + unitSuffix}`;
        translation = `translate(${defaultX}, ${defaultY})` + translation;
    }
    return translation;
}

export function getTouch(e, identifier) {
    return (e.targetTouches && findInArray(e.targetTouches, t => identifier === t.identifier)) ||
        (e.changedTouches && findInArray(e.changedTouches, t => identifier === t.identifier));
}

export function getTouchIdentifier(e) {
    if (e.targetTouches && e.targetTouches[0]) return e.targetTouches[0].identifier;
    if (e.changedTouches && e.changedTouches[0]) return e.changedTouches[0].identifier;
}

// 添加选中样式
export function addUserSelectStyles(doc) {
    if (!doc) return;
    let styleEl = doc.getElementById('react-draggable-style-el');
    if (!styleEl) {
        styleEl = doc.createElement('style');
        styleEl.type = 'text/css';
        styleEl.id = 'react-draggable-style-el';
        styleEl.innerHTML = '.react-draggable-transparent-selection *::-moz-selection {background: red;}\n';
        styleEl.innerHTML += '.react-draggable-transparent-selection *::selection {background: red;}\n';
        doc.getElementsByTagName('head')[0].appendChild(styleEl);
    }
    if (doc.body) addClassName(doc.body, 'react-draggable-transparent-selection');
}

// 移除选中样式和选中区域
export function removeUserSelectStyles(doc) {
    if (!doc) return;
    try {
        if (doc.body) removeClassName(doc.body, 'react-draggable-transparent-selection');
        // $FlowIgnore: IE
        if (doc.selection) {
            // $FlowIgnore: IE
            doc.selection.empty();
        } else {
            // Remove selection caused by scroll, unless it's a focused input
            // (we use doc.defaultView in case we're in an iframe)
            const selection = (doc.defaultView || window).getSelection();
            if (selection && selection.type !== 'Caret') {
                selection.removeAllRanges();
            }
        }
    } catch (e) {
        // probably IE
    }
}

export function addClassName(el, className) {
    if (el.classList) {
        el.classList.add(className);
    } else {
        if (!el.className.match(new RegExp(`(?:^|\\s)${className}(?!\\S)`))) {
            el.className += ` ${className}`;
        }
    }
}

export function removeClassName(el, className) {
    if (el.classList) {
        el.classList.remove(className);
    } else {
        el.className = el.className.replace(new RegExp(`(?:^|\\s)${className}(?!\\S)`, 'g'), '');
    }
}
