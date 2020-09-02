import React from 'react';
import buildDraggableArea from './DraggableAreaBuilder';

/**
 * 拖拽容器组件，可以实例化一组拖拽组件
 * 使用：
 *   实例化： const DraggableAreaGroup = new DraggableTagsGroup();
 *   const DraggableArea = DraggableAreaGroup.addArea(areaId)
 */
export default class DraggableTagsGroup {
    constructor() {
        this.isInAreas = [];
    }

    addArea(areaId) {
        return buildDraggableArea({
            // 触发所有绑定事件， 如果存在添加进新tag的area，返回该area信息
            triggerAddFunc: (tagRect, tag, e) => {
                let x = tagRect.left + tagRect.width / 2;
                let y = tagRect.top + tagRect.height / 2;

                let result = {};
                this.isInAreas.forEach(isInArea => {
                    const r = isInArea({ tag, x, y, areaId, e });
                    if (r.isIn) {
                        result = r;
                    }
                });

                return result;
            },
            // 实例化时给每个区域绑定一个事件
            listenAddFunc: (ele, addTag) => {
                this.isInAreas.push(function ({ tag, x, y, areaId: fromAreaId, e }) {

                    // 将拖拽进来的tag添加进来
                    const rect = ele.getBoundingClientRect();
                    if (x > rect.left && x < rect.right && y > rect.top && y < rect.bottom) {
                        addTag({ tag, fromAreaId, x, y, e });
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
