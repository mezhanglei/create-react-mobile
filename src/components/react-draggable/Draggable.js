import * as React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import { createCSSTransform, createSVGTransform } from './utils/domFns';
import { canDragX, canDragY, createDraggableData, getBoundPosition } from './utils/positionFns';
import DraggableEvent from './DraggableEvent';
import log from './utils/log';

// 拖拽组件-回调处理(通过transform来控制元素拖拽, 不影响页面布局)
class Draggable extends React.Component {

    static displayName = 'Draggable';

    static defaultProps = {
        ...DraggableEvent.defaultProps,
        axis: 'both',
        bounds: false, // 边界,相对于定位父元素的位置范围: {left?: number, top?: number, right?: number, bottom?: number}或者定位父元素类选择器
        defaultClassName: 'react-draggable',
        defaultClassNameDragging: 'react-draggable-dragging', // 拖拽过程中标记的类名
        defaultClassNameDragged: 'react-draggable-dragged', // 拖拽过标记的类名
        defaultPosition: { x: 0, y: 0 },
        position: null,
        scale: 1
    };


    static getDerivedStateFromProps({ position }, { prevPropsPosition }) {
        if (
            position &&
            (!prevPropsPosition ||
                position.x !== prevPropsPosition.x || position.y !== prevPropsPosition.y
            )
        ) {
            log('Draggable: getDerivedStateFromProps %j', { position, prevPropsPosition });
            return {
                x: position.x,
                y: position.y,
                prevPropsPosition: { ...position }
            };
        }
        return null;
    }

    constructor(props) {
        super(props);

        this.state = {
            dragging: false,
            dragged: false,
            x: props.position ? props.position.x : props.defaultPosition.x,
            y: props.position ? props.position.y : props.defaultPosition.y,
            prevPropsPosition: { ...props.position },
            // 越界补偿
            slackX: 0, slackY: 0,
            // Can only determine if SVG after mounting
            isElementSVG: false
        };

        if (props.position && !(props.onDrag || props.onStop)) {
            // eslint-disable-next-line no-console
            console.warn('A `position` was applied to this <Draggable>, without drag handlers. This will make this ' +
                'component effectively undraggable. Please attach `onDrag` or `onStop` handlers so you can adjust the ' +
                '`position` of this element.');
        }
    }

    componentDidMount() {
        // Check to see if the element passed is an instanceof SVGElement
        if (typeof window.SVGElement !== 'undefined' && this.findDOMNode() instanceof window.SVGElement) {
            this.setState({ isElementSVG: true });
        }
    }

    componentWillUnmount() {
        this.setState({ dragging: false }); // prevents invariant if unmounted while dragging
    }

    // 节点
    findDOMNode() {
        return this.props.nodeRef ? this.props.nodeRef.current : ReactDOM.findDOMNode(this);
    }

    onDragStart = (e, data) => {
        log('Draggable: onDragStart: %j', data);

        // 如果onStart函数返回false则禁止拖拽
        const shouldStart = this.props.onStart(e, createDraggableData(this, data));
        if (shouldStart === false) return false;

        this.setState({ dragging: true, dragged: true });
    };

    onDrag = (e, data) => {
        if (!this.state.dragging) return false;
        log('Draggable: onDrag: %j', data);

        // 拖拽生成的位置信息
        const uiData = createDraggableData(this, data);

        const newState = {
            x: uiData.x,
            y: uiData.y
        };

        // 运动边界限制
        if (this.props.bounds) {
            // Save original x and y.
            const { x, y } = newState;

            // 
            newState.x += this.state.slackX;
            newState.y += this.state.slackY;

            // 边界处理
            const [newStateX, newStateY] = getBoundPosition(this, newState.x, newState.y);
            newState.x = newStateX;
            newState.y = newStateY;

            // 重新计算越界补偿
            newState.slackX = this.state.slackX + (x - newState.x);
            newState.slackY = this.state.slackY + (y - newState.y);

            // 更新
            uiData.x = newState.x;
            uiData.y = newState.y;
            uiData.deltaX = newState.x - this.state.x;
            uiData.deltaY = newState.y - this.state.y;
        }


        const shouldUpdate = this.props.onDrag(e, uiData);
        if (shouldUpdate === false) return false;

        this.setState(newState);
    };

    onDragStop = (e, data) => {
        if (!this.state.dragging) return false;

        // Short-circuit if user's callback killed it.
        const shouldContinue = this.props.onStop(e, createDraggableData(this, data));
        if (shouldContinue === false) return false;

        log('Draggable: onDragStop: %j', data);

        const newState = {
            dragging: false,
            slackX: 0,
            slackY: 0
        };

        // 如果是受控组件,则需要重置位置为最近一次的position
        const controlled = Boolean(this.props.position);
        if (controlled) {
            const { x, y } = this.props.position;
            newState.x = x;
            newState.y = y;
        }

        this.setState(newState);
    };

    render() {
        const {
            axis,
            bounds,
            children,
            defaultPosition,
            defaultClassName,
            defaultClassNameDragging,
            defaultClassNameDragged,
            position,
            positionOffset,
            scale,
            ...DraggableEventProps
        } = this.props;

        let style = {};
        let svgTransform = null;

        // 判断
        const draggable = !Boolean(position) || this.state.dragging;

        // 设置的tranform的位置
        const validPosition = position || defaultPosition;
        const transformOpts = {
            // Set left if horizontal drag is enabled
            x: canDragX(this) && draggable ?
                this.state.x :
                validPosition.x,

            // Set top if vertical drag is enabled
            y: canDragY(this) && draggable ?
                this.state.y :
                validPosition.y
        };

        // If this element was SVG, we use the `transform` attribute.
        // 如果子元素已经设置了transform,可以用一对标签包裹
        if (this.state.isElementSVG) {
            svgTransform = createSVGTransform(transformOpts, positionOffset);
        } else {
            style = createCSSTransform(transformOpts, positionOffset);
        }

        // 注意: 自定义className需要在子元素children上面设置
        const className = classNames((children.props.className || ''), defaultClassName, {
            [defaultClassNameDragging]: this.state.dragging,
            [defaultClassNameDragged]: this.state.dragged
        });

        // React.Children.only限制只能传递一个child
        // 注意使用时, 子元素最好用闭合标签包裹, 以防出现props带来的问题(例如style样式中的transition和transform, 以及事件)
        return (
            <DraggableEvent {...DraggableEventProps} onStart={this.onDragStart} onDrag={this.onDrag} onStop={this.onDragStop}>
                {React.cloneElement(React.Children.only(children), {
                    className: className,
                    style: { ...children.props.style, ...style },
                    transform: svgTransform
                })}
            </DraggableEvent>
        );
    }
}

export { Draggable as default, DraggableEvent };
