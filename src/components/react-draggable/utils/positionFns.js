// @flow
import { isNum, int } from './shims';
import { getTouch, innerWidth, innerHeight, offsetXYFromParent, outerWidth, outerHeight } from './domFns';

// 边界处理
export function getBoundPosition(draggable, x, y) {
    // If no bounds, short-circuit and move on
    if (!draggable.props.bounds) return [x, y];

    // Clone new bounds
    let { bounds } = draggable.props;
    bounds = typeof bounds === 'string' ? bounds : cloneBounds(bounds);
    const node = findDOMNode(draggable);

    if (typeof bounds === 'string') {
        const { ownerDocument } = node;
        const ownerWindow = ownerDocument.defaultView;
        let boundNode;
        if (bounds === 'parent') {
            boundNode = node.parentNode;
        } else {
            boundNode = ownerDocument.querySelector(bounds);
        }
        if (!(boundNode instanceof ownerWindow.HTMLElement)) {
            throw new Error('Bounds selector "' + bounds + '" could not find an element.');
        }
        const nodeStyle = ownerWindow.getComputedStyle(node);
        const boundNodeStyle = ownerWindow.getComputedStyle(boundNode);
        // 计算出边界(即相对于定位父元素的位置范围)
        bounds = {
            left: -node.offsetLeft + int(boundNodeStyle.paddingLeft) + int(nodeStyle.marginLeft),
            top: -node.offsetTop + int(boundNodeStyle.paddingTop) + int(nodeStyle.marginTop),
            right: innerWidth(boundNode) - outerWidth(node) - node.offsetLeft +
                int(boundNodeStyle.paddingRight) - int(nodeStyle.marginRight),
            bottom: innerHeight(boundNode) - outerHeight(node) - node.offsetTop +
                int(boundNodeStyle.paddingBottom) - int(nodeStyle.marginBottom)
        };
    }

    // Keep x and y below right and bottom limits...
    if (isNum(bounds.right)) x = Math.min(x, bounds.right);
    if (isNum(bounds.bottom)) y = Math.min(y, bounds.bottom);

    // But above left and top limits.
    if (isNum(bounds.left)) x = Math.max(x, bounds.left);
    if (isNum(bounds.top)) y = Math.max(y, bounds.top);

    return [x, y];
}

// 计算拖拽的距离,当拖拽距离小于设定值则四舍五入返回0
export function snapToGrid(grid, pendingX, pendingY) {
    const x = Math.round(pendingX / grid[0]) * grid[0];
    const y = Math.round(pendingY / grid[1]) * grid[1];
    return [x, y];
}

export function canDragX(draggable) {
    return draggable.props.axis === 'both' || draggable.props.axis === 'x';
}

export function canDragY(draggable) {
    return draggable.props.axis === 'both' || draggable.props.axis === 'y';
}

// 获取相对于定位父元素的位置
export function getControlPosition(e, touchIdentifier, draggableEvent) {
    const touchObj = typeof touchIdentifier === 'number' ? getTouch(e, touchIdentifier) : null;
    if (typeof touchIdentifier === 'number' && !touchObj) return null;
    const node = findDOMNode(draggableEvent);
    // User can provide an offsetParent if desired.
    const offsetParent = draggableEvent.props.offsetParent || node.offsetParent || node.ownerDocument.body;
    return offsetXYFromParent(touchObj || e, offsetParent, draggableEvent.props.scale);
}

// 返回DraggableEvent组件需要的位置信息
export function createCoreData(draggable, x, y) {
    const state = draggable.state;
    const isStart = !isNum(state.lastX);
    const node = findDOMNode(draggable);

    if (isStart) {
        // If this is our first move, use the x and y as last coords.
        return {
            node,
            deltaX: 0, deltaY: 0,
            lastX: x, lastY: y,
            x, y,
        };
    } else {
        // Otherwise calculate proper values.
        return {
            node,
            // x,y方向移动一次的距离
            deltaX: x - state.lastX, deltaY: y - state.lastY,
            // 拖拽前位置
            lastX: state.lastX, lastY: state.lastY,
            x, y,
        };
    }
}

// 返回Draggable组件需要的位置信息
export function createDraggableData(draggable, coreData) {
    const scale = draggable.props.scale;
    return {
        node: coreData.node,
        x: draggable.state.x + (coreData.deltaX / scale),
        y: draggable.state.y + (coreData.deltaY / scale),
        deltaX: (coreData.deltaX / scale),
        deltaY: (coreData.deltaY / scale),
        lastX: draggable.state.x,
        lastY: draggable.state.y
    };
}

// 克隆新的边界
function cloneBounds(bounds) {
    return {
        left: bounds.left,
        top: bounds.top,
        right: bounds.right,
        bottom: bounds.bottom
    };
}

function findDOMNode(draggable) {
    const node = draggable.findDOMNode();
    if (!node) {
        throw new Error('<DraggableEvent>: Unmounted during event!');
    }
    // $FlowIgnore we can't assert on HTMLElement due to tests... FIXME
    return node;
}
