import React from 'react';
// immutable一般用于不可变对象, 不会被其他地方的对象改变(ie存在兼容问题)
import { List } from 'immutable';

import styles from './style.less';
import { isTouch } from "@/utils/reg";

// 拖拽时的样式类
const dragClassName = 'move';
// 不可拖拽时的样式类
const excludedInDragClassName = 'default';

/**
 * 实例化可拖拽的盒子
 * 参数:
 * initialTags: 初始化的tag组件
 * tags: tag组件
 * 方法:
 * getAddTagFunc: function(addTags) {} 获取添加进盒子的tag
 * tags数据的参数
 *  undraggable： 不允许拖拽
 */
export default function buildDraggableArea({ triggerAddFunc = () => { }, listenAddFunc = () => { } } = {}) {

    class DraggableArea extends React.Component {
        constructor() {
            super();
            this.state = {
                tags: List([]),
            };

            // 缓存拖拽元素，绝对定位
            this.draggableTagEles = {};
            // 缓存拖拽元素的定位父元素
            this.tagEles = {};
            // 所有tag定位父元素的位置信息
            this.positions = [];
            // 临时存放dom节点
            this.tagsElesWhichBindedDrag = new WeakSet();
        }

        componentDidMount() {
            if (this.props.initialTags) {
                this.setTags(List(this.props.initialTags));
            } else {
                this.setTags(List(this.props.tags));
            }

            listenAddFunc(this.container, this.addTag.bind(this));
            this.props.getAddTagFunc && this.props.getAddTagFunc(this.addTag.bind(this));
        }

        componentDidUpdate(prevProps) {
            if (!this.props.tags) {
                return;
            }
            if (prevProps.tags.length !== this.props.tags.length ||
                prevProps.tags.some((tag, i) => !this.props.tags[i] || tag.id !== this.props.tags[i].id)) {
                this.setTags(List(this.props.tags));
            }
        }

        // 获取tag的index序号
        getTagIndex = (id) => {
            let index;
            this.positions.forEach((p, i) => {
                if (p.id === id) index = i;
            });
            return index;
        }

        // 获取事件对象的位置
        getEventPosition = (e) => {
            e = e || window.event;
            return {
                x: isTouch() ? e.touches[0].clientX : e.clientX,
                y: isTouch() ? e.touches[0].clientY : e.clientY
            };
        }

        // 获取最外层的可拖拽元素
        getDragElement = (dragEle) => {
            let dragParent = dragEle.parentElement;
            while (dragParent && !dragParent.classList.contains('DraggableTags-tag-drag')) {
                dragParent = dragParent.parentElement;
            }
            return dragParent;
        }

        // 获取tag的位置
        getTagPosition = (tag) => {
            return {
                tagX: tag.offsetLeft + tag.offsetWidth / 2,
                tagY: tag.offsetTop + tag.offsetHeight / 2
            };
        }

        // 实时获取当前

        dragElement(elmnt, id, parent) {
            // 是否属于列表拖拽
            const isList = this.props.isList;

            // 拖拽之前的信息
            let preInfo = {
                // 事件触发位置
                prevX: 0,
                prevY: 0,
                zIndex: 2
            };

            // 拖拽开始事件
            const dragStart = (e) => {
                // 移动设备拖动会导致奇怪的问题
                e.type === 'touchmove' && e.preventDefault();
                // 判断是否禁止拖拽
                if (this.props.forbidDrag) {
                    // closest: 触发点的最近的含该类名的祖先元素
                    const canDrag = e.target.closest(`.${styles[dragClassName]}`);
                    const notDrag = e.target.closest(`.${styles[excludedInDragClassName]}`);

                    if (!canDrag) return;
                    if (canDrag.contains(notDrag)) return;
                }

                // 拖拽限制
                if (window.dragMouseDown) return;
                window.dragMouseDown = true;

                // 事件对象的触发位置
                preInfo.prevX = this.getEventPosition(e).x;
                preInfo.prevY = this.getEventPosition(e).y;

                // 增加拖拽元素的层级
                elmnt.style.zIndex = preInfo.zIndex;
                const dragParent = this.getDragElement(elmnt);
                if (dragParent) dragParent.style.zIndex = preInfo.zIndex;

                // 拖拽结束
                document.addEventListener("mouseup", closeDragElement, false);
                // 拖拽过程中
                document.addEventListener("mousemove", elementDrag, false);
                // 触摸结束
                elmnt.addEventListener("touchend", closeDragElement, false);
                // 触摸取消
                elmnt.addEventListener("touchcancel", closeDragElement, false);
                // 触摸移动过程中
                elmnt.addEventListener("touchmove", elementDrag, false);
            };

            // 拖拽过程中
            const elementDrag = (e) => {
                if (isTouch()) this.container.style.overflowY = 'visible';
                // 阻止默认行为
                e.type === 'touchmove' && e.preventDefault();

                // 计算拖拽元素的移动距离
                let nowX = this.getEventPosition(e).x;
                let nowY = this.getEventPosition(e).y;
                let movedX = nowX - preInfo.prevX;
                let movedY = nowY - preInfo.prevY;
                // 重新赋值
                preInfo.prevX = nowX;
                preInfo.prevY = nowY;

                // 拖拽元素实时定位位置
                let dragTop = elmnt.offsetTop + movedY;
                let dragLeft = elmnt.offsetLeft + movedX;
                elmnt.style.top = dragTop + "px";
                elmnt.style.left = dragLeft + "px";

                // tag中心点定位位置
                let ctop = this.getTagPosition(parent).tagY + dragTop;
                let cleft = this.getTagPosition(parent).tagX + dragLeft;

                // Check if the tag could be put into a new position
                for (let i = 0; i < this.positions.length - 1; i++) {
                    const p1 = this.positions[i];
                    const p2 = this.positions[i + 1];

                    let isHead = false;
                    let isTail = false;
                    let between2Tags = false;
                    let endOfLine = false;
                    let startOfLine = false;
                    // 缝隙的宽度
                    const space = 8;

                    if (!isList) {
                        // 非列表组件
                        if (
                            // 当在序号第一的目标的左上时
                            i === 0 &&
                            ctop > p1.top &&
                            ctop < p1.bottom &&
                            cleft < p1.left + space
                        ) isHead = true;

                        if (
                            // 当在尾部目标的左上时
                            i === this.positions.length - 2 && ((
                                ctop > p2.top &&
                                cleft > p2.left - space) || ctop > p2.bottom)
                        ) isTail = true;

                        if (
                            // 当在两个目标左右中间时
                            ctop > p1.top &&
                            ctop < p1.bottom &&
                            cleft > p1.right - 8 &&
                            cleft < p2.left + 8
                        ) between2Tags = true;

                        if (
                            // 当在两个目标的上下中间偏左时
                            ctop > p2.top &&
                            ctop < p2.bottom &&
                            cleft < p2.left + 8 &&
                            p1.top < p2.top
                        ) startOfLine = true;

                        if (
                            // 当在两个目标的上下中间偏右时
                            ctop > p1.top &&
                            ctop < p1.bottom &&
                            cleft > p1.right - 8 &&
                            p1.top < p2.top
                        ) endOfLine = true;
                    } else {
                        // 列表组件
                        if (
                            // 在上下两个中间
                            ctop > p1.bottom - 4 &&
                            ctop < p2.top + 4
                        ) between2Tags = true;

                        if (
                            // 在最上面
                            i === 0 &&
                            ctop < p1.top + 4
                        ) isHead = true;

                        if (
                            // 在最下面
                            i === this.positions.length - 2 &&
                            ctop > p2.bottom - 4
                        ) isTail = true;
                    }

                    // 如果满足上述位置要求, 则
                    if (
                        (!isList && (isHead || isTail || between2Tags || startOfLine || endOfLine))
                        ||
                        (isList && (isHead || isTail || between2Tags))
                    ) {
                        // 当前拖拽元素
                        let index = this.getTagIndex(id);
                        let cur = this.state.tags.get(index);
                        // 将当前拖拽元素删除, 返回剩余的元素(这里的splice和原生方法不一样)
                        let tags = this.state.tags.splice(index, 1);

                        // 如果序号在前面,则将拖拽元素放到前面
                        if ((index < i || isHead) && !isTail) {
                            tags = tags.splice(i, 0, cur);
                            index = i;
                            // 否则将拖拽元素添加到后面
                        } else {
                            tags = tags.splice(i + 1, 0, cur);
                            index = i + 1;
                        }

                        // 重置positions
                        this.positions = [];
                        // 没有重新排列tags之前的位置
                        const prevBaseTop = this.tagEles[cur.id].offsetTop;
                        const prevBaseLeft = this.tagEles[cur.id].offsetLeft;

                        // 重新计算定位父元素
                        this.setState({ tags }, () => {
                            let curBaseTop;
                            let curBaseLeft;
                            tags.forEach((item, i) => {
                                const tag = this.tagEles[item.id];
                                if (i === index) {
                                    // 重新排列tags之后的位置
                                    curBaseLeft = tag.offsetLeft;
                                    curBaseTop = tag.offsetTop;
                                }
                                this.positions.push({
                                    id: item.id,
                                    top: tag.offsetTop,
                                    left: tag.offsetLeft,
                                    bottom: tag.offsetTop + tag.offsetHeight,
                                    right: tag.offsetLeft + tag.offsetWidth,
                                    width: tag.offsetWidth,
                                    height: tag.offsetHeight,
                                });
                            });
                            // 重新计算拖拽元素相对于定位父元素位置 = 当前相对于拖拽父元素定位位置 - (重新排列之后的位置 - 重新排列之前的位置)
                            elmnt.style.left = `${dragLeft - (curBaseLeft - prevBaseLeft)}px`;
                            elmnt.style.top = `${dragTop - (curBaseTop - prevBaseTop)}px`;
                        });
                        break;
                    }
                }
            };

            // 拖拽结束后
            const closeDragElement = (e) => {
                if (isTouch()) this.container.style.overflowY = 'auto';

                document.removeEventListener("mouseup", closeDragElement, false);
                document.removeEventListener("mousemove", elementDrag, false);
                elmnt.removeEventListener("touchend", closeDragElement, false);
                elmnt.removeEventListener("touchcancel", closeDragElement, false);
                elmnt.removeEventListener("touchmove", elementDrag, false);

                const dragParent = this.getDragElement(elmnt);
                if (dragParent) dragParent.style.zIndex = 1;

                let eRect = elmnt.getBoundingClientRect();
                // 最外层的盒子的可视位置
                const areaPosition = this.container.getBoundingClientRect();
                const index = this.getTagIndex(id);
                let x = eRect.left + eRect.width / 2;
                let y = eRect.top + eRect.height / 2;
                if (x < areaPosition.left || x > areaPosition.right || y < areaPosition.top || y > areaPosition.bottom) {
                    // 存在接收的目标
                    const result = triggerAddFunc(elmnt.getBoundingClientRect(), this.state.tags.get(index), e);
                    if (result && result.isIn) {
                        this.positions.splice(index, 1);
                        const tagDraggedOut = this.state.tags.get(index);
                        this.setState({ tags: this.state.tags.splice(index, 1) }, () => {
                            this.props.onChange && this.props.onChange(this.state.tags.toJS(), this.buildOnChangeObj({
                                toArea: {
                                    id: result.id,
                                    tag: tagDraggedOut
                                }
                            }));
                        });
                        return;
                    }
                }
                // 重置
                window.dragMouseDown = false;
                elmnt.style.top = 0;
                elmnt.style.left = 0;
                elmnt.style.zIndex = 1;
                this.props.onChange && this.props.onChange(this.state.tags.toJS(), this.buildOnChangeObj());
            };

            elmnt.removeEventListener("mousedown", dragStart);
            elmnt.removeEventListener("touchstart", dragStart);

            elmnt.addEventListener("mousedown", dragStart, false);
            elmnt.addEventListener("touchstart", dragStart, false);
        }

        // 设置tags的排列
        setTags(tags, callback) {
            this.setState({ tags }, () => {
                callback && callback();
                // 清空位置信息
                this.positions = [];
                this.state.tags.forEach((item, i) => {
                    // 可拖拽元素的定位父元素
                    const tag = this.tagEles[item.id];
                    // 定位父元素的四条边的定位位置
                    this.positions.push({
                        id: item.id,
                        top: tag.offsetTop,
                        left: tag.offsetLeft,
                        bottom: tag.offsetTop + tag.offsetHeight,
                        right: tag.offsetLeft + tag.offsetWidth,
                        width: tag.offsetWidth,
                        height: tag.offsetHeight,
                    });
                    // 如果模块是可拖拽的
                    if (!item.undraggable) {
                        const draggableTag = this.draggableTagEles[item.id];
                        if (this.tagsElesWhichBindedDrag.has(draggableTag)) return;
                        this.tagsElesWhichBindedDrag.add(draggableTag);
                        // 每个元素绑定拖拽事件
                        this.dragElement(draggableTag, item.id, tag);
                    }
                });
            });
        }

        addTag({ tag, fromAreaId, x, y, e }) {
            const areaPosition = this.container.getBoundingClientRect();
            // tag中心点在盒子内部的位置
            let ctop = y - areaPosition.top;
            let cleft = x - areaPosition.left;
            let i; // safari 10 bug

            let isHead = false;
            let isTail = false;
            let between2Tags = false;
            let endOfLine = false;
            let startOfLine = false;

            // Check if the tag could be put into a new position
            for (i = 0; i < this.positions.length - 1; i++) {
                // 相邻两个元素的中心位置
                const p1 = this.positions[i];
                const p1Ctop = p1.top + p1.height / 2;
                const p1Cleft = p1.left + p1.width / 2;
                const p2 = this.positions[i + 1];
                const p2Ctop = p2.top + p2.height / 2;
                const p2Cleft = p2.left + p2.width / 2;

                isHead = false;
                isTail = false;
                between2Tags = false;
                endOfLine = false;
                startOfLine = false;

                if (!this.props.isList) {
                    // 在列表最前面
                    if (
                        // Head of tag list
                        i === 0 &&
                        ctop > p1.top &&
                        ctop < p1.bottom &&
                        cleft < p1Cleft
                    ) isHead = true;


                    if (
                        // 当在两个目标左右中间时
                        ctop > p1.top &&
                        ctop < p1.bottom &&
                        cleft > p1Cleft &&
                        cleft < p2Cleft
                    ) between2Tags = true;

                    if (
                        // 当在两个目标的上下中间偏左时
                        ctop > p2.top &&
                        ctop < p2.bottom &&
                        cleft < p2Cleft &&
                        p1.top < p2.top
                    ) startOfLine = true;

                    if (
                        // 当在两个目标的上下中间偏右时
                        ctop > p1.top &&
                        ctop < p1.bottom &&
                        cleft > p1Cleft &&
                        p1.top < p2.top
                    ) endOfLine = true;

                    if (
                        // 当在尾部时
                        i === this.positions.length - 2 &&
                        !(isHead || between2Tags || startOfLine || endOfLine)
                    ) isTail = true;

                    if (isHead || isTail || between2Tags || startOfLine || endOfLine) break;

                } else {
                    // 竖直列表
                    if (
                        // Between two tags
                        ctop > p1Ctop &&
                        ctop < p2Ctop
                    ) between2Tags = true;

                    if (
                        // Head of tag list
                        i === 0 &&
                        ctop < p1Ctop
                    ) isHead = true;

                    if (
                        // Tail of tag list
                        i === this.positions.length - 2 &&
                        !(between2Tags || isHead)
                    ) isTail = true;

                    if (isHead || isTail || between2Tags) break;
                }
            }

            let tags = this.state.tags;
            if (isTail) {
                tags = tags.push(tag);
            } else if (isHead) {
                tags = tags.unshift(tag);
            } else {
                tags = tags.splice(i + 1, 0, tag);
            }
            // 重置positions
            this.positions = [];

            this.setState({ tags }, () => {
                this.props.onChange && this.props.onChange(this.state.tags.toJS(), this.buildOnChangeObj({
                    fromArea: {
                        id: fromAreaId,
                        tag,
                    }
                }));
            });
        }

        // 删除指定tag
        buildDeleteTagFunc(tag) {
            return () => {
                const tags = this.state.tags.filter(t => tag.id !== t.id);
                this.setTags(tags, () => {
                    this.props.onChange && this.props.onChange(this.state.tags.toJS(), this.buildOnChangeObj());
                });
            };
        }

        buildOnChangeObj({ fromArea = {}, toArea = {} } = {}) {
            return {
                fromArea,
                toArea
            };
        }


        render() {
            let { render, style, className, isList, tagStyle, forbidDrag } = this.props;
            const tags = this.state.tags.toJS().map((tag, index) => (
                <div
                    key={tag.id}
                    className={`${styles['DraggableTags-tag']} ${(tag.undraggable || forbidDrag) ? styles[excludedInDragClassName] : styles[dragClassName]}`}
                    ref={(target) => {
                        this.tagEles[tag.id] = target;
                    }}
                    style={isList ? { display: 'block', ...tagStyle } : tagStyle}
                >
                    <div
                        className={styles["DraggableTags-tag-drag"]}
                        ref={(target) => this.draggableTagEles[tag.id] = target}
                    >
                        {render({ tag, index, deleteThis: this.buildDeleteTagFunc(tag) })}
                    </div>
                    <div style={{ opacity: 0, overflow: 'hidden' }}>
                        {render({ tag, index, deleteThis: this.buildDeleteTagFunc(tag) })}
                    </div>
                </div>
            ));
            return (
                <div
                    ref={r => this.container = r}
                    className={`${styles['DraggableTags']} ${className || ''}`}
                    style={isTouch() ? { overflowY: 'auto', ...style } : style}
                >
                    {
                        // 高度设置超出是为了防止拖拽时滚动
                        isTouch() ? (<div style={{ height: '101%' }}>{tags}</div>) : tags
                    }
                </div>
            );
        }
    }

    return DraggableArea;
} 
