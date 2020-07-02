import React, { Component } from 'react';

/**
 * 拖拽缩放组件
 * 实现原理：通过改变宽高来实现缩放，所以只支持右边框和下边框点击拖拽缩放
 * 使用: 
 *       <DragResize>
 *          被包裹
 *       </DragResize>
 */
class DragResize extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        // false事件冒泡(从里到外依次触发)，true事件捕获（从外到里依次触发）
        document.addEventListener('mousedown', this.doDown, false);
        document.addEventListener('mousemove', this.doMove, false);
        document.addEventListener('mouseup', this.doUp, false);
        document.addEventListener('dragover', this.doOver, false);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.doDown);
        document.removeEventListener('mousemove', this.doMove);
        document.removeEventListener('mouseup', this.doUp);
        document.removeEventListener('dragover', this.doOver);
    }

    // 获取事件触发点在目标盒子内的位置 = 触发点可视化区域位置 - 盒子边框可视化区域位置
    getPosition = (e, element) => {
        return {
            positionX: e.clientX - element.getBoundingClientRect().x,
            positionY: e.clientY - element.getBoundingClientRect().y
        };
    };

    // 获取鼠标的位置
    getPositions = (e, element) => {
        let positions = '';
        const { positionX, positionY } = this.getPosition(e, element);
        const distance = 10;
        // 上边
        if (positionY < distance && positionY > -distance) positions += 'n';
        // 下边
        else if (positionY > element.offsetHeight - distance && positionY < element.offsetHeight + distance) positions += 's';
        // 左边
        if (positionX < distance && positionX > -distance) positions += 'w';
        // 右边
        else if (positionX > element.offsetWidth - distance && positionX < element.offsetWidth + distance) positions += 'e';
        // 否则返回空字符串表示不在边缘
        return positions;
    };

    // 鼠标点击事件
    doDown = (e) => {
        e.preventDefault();
        const element = this.draggableDom;
        // 如果点击的是其他区域则不做操作
        const positions = this.getPositions(e, element);
        if (positions == '') return;
        // 是否可以拖拽
        this.isDraggable = true;
        // 存储拖拽前的信息
        this.setState({
            positions: positions,
            origClientX: e.clientX,
            origClientY: e.clientY,
            origWidth: element.offsetWidth,
            origHeight: element.offsetHeight
        });
    };

    doUp = () => {
        this.isDraggable = false;
    };

    doOver = () => {
        this.isDraggable = false;
    }

    // 鼠标移动事件
    doMove = (e) => {
        e.preventDefault();
        this.setMouseStyle(e, this.draggableDom);
        this.dragChange(e, this.draggableDom);
    }

    // 鼠标移动时实时设置鼠标的样式 e鼠标事件 element目标dom
    setMouseStyle = (e, element) => {
        const positions = this.getPositions(e, element);
        if (positions === 'n' || positions === 's') {
            element.style.cursor = 'row-resize';
        } else if (positions === 'w' || positions === 'e') {
            element.style.cursor = 'col-resize';
        } else if (positions === '') {
            element.style.cursor = 'default';
        } else {
            element.style.cursor = positions + '-resize';
        }
    }

    // 鼠标拖拽过程中目标发生的变化 e事件 element目标dom
    dragChange = (e, element) => {
        if (!this.isDraggable) {
            return;
        }
        // 初始位置
        const { positions, origClientX, origClientY, origWidth, origHeight } = this.state;
        // 最小宽度和最小高度
        const minWidth = 80;
        const minHeight = 80;
        // 计算规则：根据当前方向匹配对应的计算公式
        const rules = [{
            positions: 'e', // 方向
            property: 'width', // 要变更的属性
            value: Math.max(minWidth, origWidth + e.clientX - origClientX) //变更的数值，单位px
        }, {
            positions: 's',
            property: 'height',
            value: Math.max(minHeight, origHeight + e.clientY - origClientY)
        }, {
            positions: 'w',
            property: 'width',
            value: Math.max(minWidth, origWidth - e.clientX + origClientX)
        }, {
            positions: 'n',
            property: 'height',
            value: Math.max(minHeight, origHeight - e.clientY + origClientY)
        }];

        rules.map((item) => {
            if (positions.indexOf(item.positions) > -1) {
                element.style[item.property] = item.value + 'px';
            }
        });
    }

    render() {
        return (
            <div style={{ display: 'flex', overflow: 'hidden', border: '1px solid red', padding: '1px' }} ref={(node) => { this.draggableDom = node; }}>
                {this.props.children}
            </div>
        );
    }
}

export default DragResize;
