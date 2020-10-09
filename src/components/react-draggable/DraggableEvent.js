import * as React from 'react';
import ReactDOM from 'react-dom';
import {
    matchesSelectorAndParentsTo, addEvent, removeEvent, addUserSelectStyles, getTouchIdentifier,
    removeUserSelectStyles
} from './utils/domFns';
import { createCoreData, getControlPosition, snapToGrid } from './utils/positionFns';
import log from './utils/log';

// Simple abstraction for dragging events names.
const eventsFor = {
    touch: {
        start: 'touchstart',
        move: 'touchmove',
        stop: 'touchend'
    },
    mouse: {
        start: 'mousedown',
        move: 'mousemove',
        stop: 'mouseup'
    }
};

// Default to mouse events.
let dragEventFor = eventsFor.mouse;


// 拖拽组件-事件处理
export default class DraggableEvent extends React.Component {

    // 用于调试消息(jsx特性)
    static displayName = 'DraggableEvent';

    static defaultProps = {
        allowAnyClick: false, // true表示允许非鼠标左键单击拖动
        cancel: null, // 不允许拖拽的类选择器
        disabled: false, // true禁止拖拽
        enableUserSelectHack: true, // true添加选中样式
        offsetParent: null, // 提供定位父元素
        handle: null, // 拖拽所在的类选择器
        grid: null, // 跳跃幅度, 例如: [25, 25]表示x, y轴25移动距离跳跃一次
        transform: null, // 
        onStart: function () { }, // 返回false则停止事件
        onDrag: function () { }, // 返回false则停止事件
        onStop: function () { }, // 返回false则停止事件
        onMouseDown: function () { },
        scale: 1,
    };

    state = {
        dragging: false,
        // Used while dragging to determine deltas.
        lastX: NaN, lastY: NaN,
        touchIdentifier: null
    };

    mounted = false;

    componentDidMount() {
        this.mounted = true;
        const thisNode = this.findDOMNode();
        if (thisNode) {
            // 监听touch事件时,不阻止默认行为
            addEvent(thisNode, eventsFor.touch.start, this.onTouchStart, { passive: false });
        }
    }

    componentWillUnmount() {
        this.mounted = false;
        // 其中: 删除顶层document对象的事件以防万一
        const thisNode = this.findDOMNode();
        if (thisNode) {
            const { ownerDocument } = thisNode;
            removeEvent(ownerDocument, eventsFor.mouse.move, this.handleDrag);
            removeEvent(ownerDocument, eventsFor.touch.move, this.handleDrag);
            removeEvent(ownerDocument, eventsFor.mouse.stop, this.handleDragStop);
            removeEvent(ownerDocument, eventsFor.touch.stop, this.handleDragStop);
            removeEvent(thisNode, eventsFor.touch.start, this.onTouchStart, { passive: false });
            // 移除选中样式
            if (this.props.enableUserSelectHack) removeUserSelectStyles(ownerDocument);
        }
    }

    // 节点
    findDOMNode() {
        return this.props.nodeRef ? this.props.nodeRef.current : ReactDOM.findDOMNode(this);
    }

    handleDragStart = (e) => {
        // Make it possible to attach event handlers on top of this one.
        this.props.onMouseDown(e);

        // 不是鼠标左键且不开启allowAnyClick则不生效
        if (!this.props.allowAnyClick && typeof e.button === 'number' && e.button !== 0) return false;

        // 判断是否渲染完成
        const thisNode = this.findDOMNode();
        if (!thisNode || !thisNode.ownerDocument || !thisNode.ownerDocument.body) {
            throw new Error('<DraggableEvent> not mounted on DragStart!');
        }
        const { ownerDocument } = thisNode;

        // props控制是否拖拽
        if (this.props.disabled ||
            (!(e.target instanceof ownerDocument.defaultView.Node)) ||
            (this.props.handle && !matchesSelectorAndParentsTo(e.target, this.props.handle, thisNode)) ||
            (this.props.cancel && matchesSelectorAndParentsTo(e.target, this.props.cancel, thisNode))) {
            return;
        }

        // 移动设备阻止默认行为
        if (e.type === 'touchstart') e.preventDefault();

        // 触摸设备获取触摸标识符,用于区分多点触控
        const touchIdentifier = getTouchIdentifier(e);
        this.setState({ touchIdentifier });

        // 获取当前事件对象的相对于定位父元素的位置
        const position = getControlPosition(e, touchIdentifier, this);
        if (position == null) return; // not possible but satisfies flow
        const { x, y } = position;

        // 返回事件对象相关的位置信息
        const coreEvent = createCoreData(this, x, y);

        log('DraggableEvent: handleDragStart: %j', coreEvent);

        // Call event handler. If it returns explicit false, cancel.
        log('calling', this.props.onStart);
        // 如果没有完成渲染或者返回false则禁止拖拽
        const shouldUpdate = this.props.onStart(e, coreEvent);
        if (shouldUpdate === false || this.mounted === false) return;

        // 滚动过程中选中文本被添加样式
        if (this.props.enableUserSelectHack) addUserSelectStyles(ownerDocument);

        this.setState({
            dragging: true,
            lastX: x, // 拖拽前位置
            lastY: y
        });

        addEvent(ownerDocument, dragEventFor.move, this.handleDrag);
        addEvent(ownerDocument, dragEventFor.stop, this.handleDragStop);
    };

    handleDrag = (e) => {

        // 获取当前事件对象的相对于定位父元素的位置
        const position = getControlPosition(e, this.state.touchIdentifier, this);
        if (position == null) return;
        let { x, y } = position;

        // 拖拽跳跃,可设置多少幅度跳跃一次
        if (Array.isArray(this.props.grid)) {
            let deltaX = x - this.state.lastX, deltaY = y - this.state.lastY;
            [deltaX, deltaY] = snapToGrid(this.props.grid, deltaX, deltaY);
            if (!deltaX && !deltaY) return; // skip useless drag
            x = this.state.lastX + deltaX, y = this.state.lastY + deltaY;
        }

        // 返回事件对象相关的位置信息
        const coreEvent = createCoreData(this, x, y);

        log('DraggableEvent: handleDrag: %j', coreEvent);

        // 返回false则禁止拖拽并初始化鼠标事件
        const shouldUpdate = this.props.onDrag(e, coreEvent);
        if (shouldUpdate === false || this.mounted === false) {
            try {
                this.handleDragStop(new MouseEvent('mouseup'));
            } catch (err) {
                // 兼容废弃版本
                const event = document.createEvent('MouseEvents');
                event.initMouseEvent('mouseup', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                this.handleDragStop(event);
            }
            return;
        }

        this.setState({
            lastX: x,
            lastY: y
        });
    };

    handleDragStop = (e) => {
        if (!this.state.dragging) return;

        const position = getControlPosition(e, this.state.touchIdentifier, this);
        if (position == null) return;
        const { x, y } = position;
        const coreEvent = createCoreData(this, x, y);

        const shouldContinue = this.props.onStop(e, coreEvent);
        if (shouldContinue === false || this.mounted === false) return false;

        // 移除文本因滚动造成的显示
        const thisNode = this.findDOMNode();
        if (thisNode) {
            // Remove user-select hack
            if (this.props.enableUserSelectHack) removeUserSelectStyles(thisNode.ownerDocument);
        }

        log('DraggableEvent: handleDragStop: %j', coreEvent);

        // 重置
        this.setState({
            dragging: false,
            lastX: NaN,
            lastY: NaN
        });

        if (thisNode) {
            // Remove event handlers
            log('DraggableEvent: Removing handlers');
            removeEvent(thisNode.ownerDocument, dragEventFor.move, this.handleDrag);
            removeEvent(thisNode.ownerDocument, dragEventFor.stop, this.handleDragStop);
        }
    };

    onMouseDown = (e) => {
        dragEventFor = eventsFor.mouse; // on touchscreen laptops we could switch back to mouse

        return this.handleDragStart(e);
    };

    onMouseUp = (e) => {
        dragEventFor = eventsFor.mouse;

        return this.handleDragStop(e);
    };

    onTouchStart = (e) => {
        dragEventFor = eventsFor.touch;

        return this.handleDragStart(e);
    };

    onTouchEnd = (e) => {
        dragEventFor = eventsFor.touch;

        return this.handleDragStop(e);
    };

    render() {
        // 注意使用时, 子元素最好用闭合标签包裹, 以防出现props带来的问题(例如style样式中的transition和transform, 以及事件)
        return React.cloneElement(React.Children.only(this.props.children), {
            onMouseDown: this.onMouseDown,
            onMouseUp: this.onMouseUp,
            onTouchEnd: this.onTouchEnd
        });
    }
}
