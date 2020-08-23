import React from 'react';
import buildDraggableArea from './DraggableAreaBuilder';

/**
 * 拖拽的容器组件
 * 使用：
 * 1. 实例化const group = new DraggableAreasGroup();
 * 2. 通过实例的方法：group.addArea(key)生成一个区域，区域里的元素可以拖拽
 *                  同个group实例生成的区域，可以互相往各区域内拖拽元素，每个区域，样式独立
 */
export default class DraggableTagsGroup {
    constructor() {
        this.isInAreas = [];
    }

    addArea(areaId) {
        return buildDraggableArea({
            // 拖拽结束后如果拖拽到盒子外面, 则会触发事件池里的所有方法
            isInAnotherArea: (tagRect, tag) => {
                let x = tagRect.left + tagRect.width / 2;
                let y = tagRect.top + tagRect.height / 2;

                let result = { isIn: false };
                this.isInAreas.forEach(isInArea => {
                    const r = isInArea({ tag, x, y, areaId });
                    if (r.isIn) {
                        result = r;
                    }
                });

                console.log(result);

                return result;
            },
            // 初始化时会将添加事件到事件池
            passAddFunc: (ele, addTag) => {
                this.isInAreas.push(function ({ tag, x, y, areaId: fromAreaId }) {

                    // 将拖拽进来的tag添加进来
                    const rect = ele.getBoundingClientRect();
                    if (x > rect.left && x < rect.right && y > rect.top && y < rect.bottom) {
                        addTag({ tag, fromAreaId, x, y });
                        return {
                            isIn: true,
                            id: areaId
                        };
                    }

                    return {
                        isIn: false,
                    };
                });
            }
        });
    }
}
