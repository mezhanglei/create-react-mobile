import React from 'react';
import { List } from 'immutable';

import styles from './style.less';

const isMobile = (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);

const hotspotClassName = 'hotspot-9485743';
const excludedInHotspotClassName = 'excludedInHotspot-9485743';

// 高阶组件，返回内容可拖拽的组件盒子
export default function buildDraggableArea({ isInAnotherArea = () => { }, passAddFunc = () => { } } = {}) {
    const Hotspot = ({ children }) => (
        <div className={hotspotClassName}>
            {children}
        </div>
    );
    const ExcludedInHotspot = ({ children }) => (
        <div className={excludedInHotspotClassName}>
            {children}
        </div>
    );

    class DraggableArea extends React.Component {
        constructor() {
            super();
            this.state = {
                tags: List([]),
            };

            // 拖拽内容Dom，绝对定位
            this.draggableTagEles = {};
            // 拖拽外壳Dom，相对定位
            this.tagEles = {};
            this.positions = [];
            this.rect = {};
            this.dragStart = {};
            this.tagChanged = false;

            this.tagsElesWhichBindedDrag = new WeakSet();
        }

        componentDidMount() {
            if (this.props.initialTags) {
                this.setTags(List(this.props.initialTags));
            } else {
                this.setTags(List(this.props.tags));
            }

            passAddFunc(this.container, this.addTag.bind(this));
            this.props.getAddTagFunc && this.props.getAddTagFunc(this.addTag.bind(this));
        }

        componentWillReceiveProps({ tags }) {
            if (!tags) return;
            if ((
                tags.length !== this.props.tags.length ||
                tags.length !== this.state.tags.size ||
                tags.some((tag, i) => !this.state.tags.get(i) || tag.id !== this.state.tags.get(i).id)
            ) && !this.forbitSetTagsState
            ) {
                this.setTags(List(tags));
            }
        }

        componentDidUpdate(prevProps, { tags }) {
            this.tagChanged = this.tagChanged ||
                tags.size !== this.state.tags.size ||
                this.state.tags.some((tag, i) => !tags.get(i) || tag.id !== tags.get(i).id);
        }

        dragElement(elmnt, id, parent) {
            // 是否属于列表拖拽
            const isList = this.props.isList;
            // 事件触发位置
            let prevX = 0, prevY = 0;
            // 盒子的可视化位置
            let rect = {};

            // 初始化当前元素序号
            let index;
            this.positions.forEach((p, i) => {
                if (p.id === id) index = i;
            });

            // 拖拽开始
            const dragStart = (e) => {
                if (this.props.withHotspot) {
                    // 当前节点匹配类名最近的父元素
                    const closestHotspot = e.target.closest(`.${hotspotClassName}`);
                    const closestExcludedInHotspot = e.target.closest(`.${excludedInHotspotClassName}`);

                    if (!closestHotspot) return;
                    if (closestHotspot.contains(closestExcludedInHotspot)) return;
                }
                // e.preventDefault();
                // 初始化tag改变状态
                this.tagChanged = false;

                // 定义一个鼠标按下拖拽属性
                if (window.dragMouseDown) return;
                window.dragMouseDown = true;

                // 获取装着拖拽元素盒子的可视化位置
                rect = this.container.getBoundingClientRect();
                e = e || window.event;
                // 事件对象的触发位置
                prevX = e.clientX || e.touches[0].clientX;
                prevY = e.clientY || e.touches[0].clientY;
                // 增加拖拽元素的层级
                elmnt.style.zIndex = 2;

                // 循环找到拖拽元素的父元素看是否存在可拖拽的父元素
                window.parentDragTag = elmnt.parentElement;
                while (window.parentDragTag && !window.parentDragTag.classList.contains('DraggableTags-tag-drag')) {
                    window.parentDragTag = window.parentDragTag.parentElement;
                }
                // 如果存在可拖拽的父元素则也增加层级
                if (window.parentDragTag) window.parentDragTag.style.zIndex = 2;

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

                // 重新计算当前元素的序号
                this.positions.forEach((p, i) => {
                    if (p.id === id) index = i;
                });
            };

            // 拖拽过程中
            const elementDrag = (e) => {
                if (isMobile) this.container.style.overflowY = 'visible';
                // 拖拽过程中禁止scrolling等默认行为
                e.type === 'touchmove' && e.preventDefault();

                // 计算tag的新的位置信息
                e = e || window.event;
                // 计算移动距离
                let nowX = e.clientX || e.touches[0].clientX;
                let nowY = e.clientY || e.touches[0].clientY;
                let movedX = nowX - prevX;
                let movedY = nowY - prevY;
                prevX = nowX;
                prevY = nowY;
                // 拖拽元素的坐标位置并移动拖拽元素
                let t = elmnt.offsetTop + movedY;
                let l = elmnt.offsetLeft + movedX;
                elmnt.style.top = t + "px";
                elmnt.style.left = l + "px";
                // 移动后的拖拽元素的定位中心
                let baseCenterTop = parent.offsetTop + elmnt.offsetHeight / 2;
                let baseCenterLeft = parent.offsetLeft + elmnt.offsetWidth / 2;
                let ctop = baseCenterTop + t;
                let cleft = baseCenterLeft + l;

                let i; // safari 10 bug
                // Check if the tag could be put into a new position
                for (i = 0; i < this.positions.length - 1; i++) {
                    // 当前元素序号改变或者元素序号没有改但变成最后一位
                    if ((index !== i || (index === this.positions.length - 2 && i === this.positions.length - 2)) && !(index - 1 === i && i !== 0)) {
                        const p1 = this.positions[i];
                        const p2 = this.positions[i + 1];

                        let isHead = false;
                        let isTail = false;
                        let between2Tags = false;
                        let endOfLine = false;
                        let startOfLine = false;

                        if (!isList) {
                            // Is not "list view"
                            if (
                                // Head of tag list
                                i === 0 &&
                                ctop > p1.top &&
                                ctop < p1.bottom &&
                                cleft < p1.left + 8
                            ) isHead = true;

                            if (
                                // Tail of tag list
                                i === this.positions.length - 2 && ((
                                    ctop > p2.top &&
                                    cleft > p2.left - 8) || ctop > p2.bottom)
                            ) isTail = true;

                            if (
                                // Between two tags
                                ctop > p1.top &&
                                ctop < p1.bottom &&
                                cleft > p1.right - 8 &&
                                cleft < p2.left + 8
                            ) between2Tags = true;

                            if (
                                // Start of line
                                ctop > p2.top &&
                                ctop < p2.bottom &&
                                cleft < p2.left + 8 &&
                                p1.top < p2.top
                            ) startOfLine = true;

                            if (
                                // End of line
                                ctop > p1.top &&
                                ctop < p1.bottom &&
                                cleft > p1.right - 8 &&
                                p1.top < p2.top
                            ) endOfLine = true;
                        } else {
                            // Is "list view"
                            if (
                                // Between two tags
                                ctop > p1.bottom - 4 &&
                                ctop < p2.top + 4
                            ) between2Tags = true;

                            if (
                                // Head of tag list
                                i === 0 &&
                                ctop < p1.top + 4
                            ) isHead = true;

                            if (
                                // Tail of tag list
                                i === this.positions.length - 2 &&
                                ctop > p2.bottom - 4
                            ) isTail = true;
                        }

                        if (
                            (!isList && (isHead || isTail || between2Tags || startOfLine || endOfLine))
                            ||
                            (isList && (isHead || isTail || between2Tags))
                        ) {
                            let cur = this.state.tags.get(index);
                            let tags = this.state.tags.splice(index, 1);
                            if ((index < i || isHead) && !isTail) {
                                tags = tags.splice(i, 0, cur);
                                index = i;
                            } else {
                                tags = tags.splice(i + 1, 0, cur);
                                index = i + 1;
                            }
                            this.positions = [];
                            const prevBaseTop = this.tagEles[cur.id].offsetTop;
                            const prevBaseLeft = this.tagEles[cur.id].offsetLeft;

                            this.setState({ tags }, () => {
                                let curBaseTop;
                                let curBaseLeft;
                                tags.forEach((t, i) => {
                                    const tag = this.tagEles[t.id];
                                    if (i === index) {
                                        curBaseLeft = tag.offsetLeft;
                                        curBaseTop = tag.offsetTop;
                                    }
                                    this.positions.push({
                                        id: t.id,
                                        top: tag.offsetTop,
                                        left: tag.offsetLeft,
                                        bottom: tag.offsetTop + tag.offsetHeight,
                                        right: tag.offsetLeft + tag.offsetWidth,
                                        width: tag.offsetWidth,
                                        height: tag.offsetHeight,
                                    });
                                });

                                // 根据不同情况计算移动后的坐标
                                if (curBaseLeft > prevBaseLeft) {
                                    elmnt.style.left = `${l - (curBaseLeft - prevBaseLeft)}px`;
                                } else {
                                    elmnt.style.left = `${l + (prevBaseLeft - curBaseLeft)}px`;
                                }
                                if (prevBaseTop > curBaseTop) {
                                    elmnt.style.top = `${t + (prevBaseTop - curBaseTop)}px`;
                                } else {
                                    elmnt.style.top = `${t - (curBaseTop - prevBaseTop)}px`;
                                }
                            });
                            break;
                        }
                    }
                }
            };


            const closeDragElement = (e) => {
                if (isMobile) this.container.style.overflowY = 'auto';

                window.dragMouseDown = false;

                document.removeEventListener("mouseup", closeDragElement, false);
                document.removeEventListener("mousemove", elementDrag, false);
                elmnt.removeEventListener("touchend", closeDragElement, false);
                elmnt.removeEventListener("touchcancel", closeDragElement, false);
                elmnt.removeEventListener("touchmove", elementDrag, false);

                if (window.parentDragTag) window.parentDragTag.style.zIndex = 1;

                let eRect = elmnt.getBoundingClientRect();
                let x = eRect.left + eRect.width / 2;
                let y = eRect.top + eRect.height / 2;
                if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
                    this.forbitSetTagsState = true;
                    const result = isInAnotherArea(elmnt.getBoundingClientRect(), this.state.tags.get(index));
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
                            this.forbitSetTagsState = false;
                        });
                        return;
                    } else {
                        this.forbitSetTagsState = false;
                    }
                }
                elmnt.style.top = 0;
                elmnt.style.left = 0;
                elmnt.style.zIndex = 1;
                if (this.tagChanged && this.props.onChange) {
                    this.tagChanged = false;
                    this.props.onChange(this.state.tags.toJS(), this.buildOnChangeObj());
                }
            };

            elmnt.removeEventListener("mousedown", dragStart);
            elmnt.removeEventListener("touchstart", dragStart);

            elmnt.addEventListener("mousedown", dragStart, false);
            elmnt.addEventListener("touchstart", dragStart, false);
        }

        // 根据tags数组来设置新的tags
        setTags(tags, callback) {
            this.setState({ tags }, () => {
                callback && callback();
                // 清空位置信息
                this.positions = [];
                this.state.tags.forEach((t, i) => {
                    // 拖拽内容
                    const draggableTag = this.draggableTagEles[t.id];
                    // 拖拽外壳
                    const tag = this.tagEles[t.id];
                    // 目标dom的位置和形状描述
                    this.positions.push({
                        id: t.id,
                        top: tag.offsetTop,
                        left: tag.offsetLeft,
                        bottom: tag.offsetTop + tag.offsetHeight,
                        right: tag.offsetLeft + tag.offsetWidth,
                        width: tag.offsetWidth,
                        height: tag.offsetHeight,
                    });
                    // 如果模块是可拖拽的，则判断是否属于拖拽过的
                    if (!t.undraggable) {
                        if (this.tagsElesWhichBindedDrag.has(draggableTag)) return;
                        this.tagsElesWhichBindedDrag.add(draggableTag);
                        // 进行拖拽
                        this.dragElement(draggableTag, t.id, tag);
                    }
                });
            });
        }

        addTag({ tag, fromAreaId, x, y }) {
            const rect = this.container.getBoundingClientRect();
            // The center position of the tag
            let ctop = y - rect.top;
            let cleft = x - rect.left;
            let i; // safari 10 bug

            let isHead = false;
            let isTail = false;
            let between2Tags = false;
            let endOfLine = false;
            let startOfLine = false;

            // Check if the tag could be put into a new position
            for (i = 0; i < this.positions.length - 1; i++) {
                // Do not check its left-side space and right-side space
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
                    // Is not "list view"
                    if (
                        // Head of tag list
                        i === 0 &&
                        ctop > p1.top &&
                        ctop < p1.bottom &&
                        cleft < p1Cleft
                    ) isHead = true;


                    if (
                        // Between two tags
                        ctop > p1.top &&
                        ctop < p1.bottom &&
                        cleft > p1Cleft &&
                        cleft < p2Cleft
                    ) between2Tags = true;

                    if (
                        // Start of line
                        ctop > p2.top &&
                        ctop < p2.bottom &&
                        cleft < p2Cleft &&
                        p1.top < p2.top
                    ) startOfLine = true;

                    if (
                        // End of line
                        ctop > p1.top &&
                        ctop < p1.bottom &&
                        cleft > p1Cleft &&
                        p1.top < p2.top
                    ) endOfLine = true;

                    if (
                        // Tail of tag list
                        i === this.positions.length - 2 &&
                        !(isHead || between2Tags || startOfLine || endOfLine)
                    ) isTail = true;

                    if (isHead || isTail || between2Tags || startOfLine || endOfLine) break;

                } else {
                    // Is "list view"
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
            let { render, build, style, className, isList, tagMargin = '5px', tagStyle, withHotspot } = this.props;
            if (!render) render = build;
            const tags = this.state.tags.toJS().map((tag, index) => (
                <div
                    key={tag.id}
                    className={`DraggableTags-tag ${tag.undraggable ? 'DraggableTags-undraggable' : ''} ${!withHotspot ? hotspotClassName : ''}`}
                    ref={(target) => {
                        this.tagEles[tag.id] = target;
                    }}
                    style={isList ? { display: 'block', ...tagStyle } : tagStyle}
                >
                    <div
                        className="DraggableTags-tag-drag"
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
                    className={`DraggableTags ${className || ''}`}
                    style={isMobile ? { overflowY: 'auto', ...style } : style}
                >
                    {
                        // 高度设置超出是为了防止拖拽时滚动
                        isMobile ? (<div style={{ height: '101%' }}>{tags}</div>) : tags
                    }
                </div>
            );
        }
    }

    DraggableArea.Hotspot = Hotspot;
    DraggableArea.ExcludedInHotspot = ExcludedInHotspot;

    return DraggableArea;
} 
