import React, { useState, useEffect } from 'react';
import { IsDOM, IsNodeList } from '@/utils/dom.js';
/**
 * 功能：对于启用了scroll的目标提供鼠标点击拖拽滚动区域横向滑动的功能
 * @param {*} props
 * 必填参数：
 *   target: [HTMLElement] | HTMLElement | NodeList DOM组成的数组及伪数组或者单个DOM
 * 使用:
 *   1. 首先确认要滚动的目标dom都设置了：overflow:scroll属性
 *   2. 实例化并包裹目标所在的组件：
 *      <ScrollTableWrapper target={[HTMLElement]}>
 *         子组件
 *      </ScrollTableWrapper>
 */

export default function ScrollTableWrapper(props) {
    const [isScroll, setIsScroll] = useState(false);
    const [downPositionX, setDownPositionX] = useState(0);
    // 要操作的dom数组
    const target = (props.target instanceof Array) ? props.target : (IsNodeList(props.target) ? [...props.target] : [props.target]);
    const doms = target.map((item) => {
        if (IsDOM(item)) {
            return item;
        }
    });

    // 鼠标按下事件
    const doDown = (e, dom) => {
        if (dom) {
            setIsScroll(true);
            setDownPositionX(e.clientX);
            dom.style.cursor = 'move';
        }
    };

    // 鼠标移动事件
    const doMove = (e, dom) => {
        if (isScroll && dom) {
            dom.style.cursor = 'move';
            const step = 15;
            if (e.clientX < downPositionX) {
                dom.scrollLeft += step;
                setDownPositionX(e.clientX);
            } else {
                dom.scrollLeft -= step;
                setDownPositionX(e.clientX);
            }
        }
    };

    // 鼠标弹起事件
    const doUp = (e, dom) => {
        if (dom) {
            setIsScroll(false);
            dom.style.cursor = 'default';
        }
    };

    // 鼠标拖拽行为发生
    const doOver = () => {
        setIsScroll(false);
    };

    // 添加事件，addEventListener会影响
    const addEvent = () => {
        doms.map((dom) => {
            if (dom) {
                // 鼠标按下事件
                dom.onmousedown = (e) => doDown(e, dom);
                // 鼠标移动事件
                dom.onmousemove = (e) => doMove(e, dom);
                // 鼠标弹起事件
                dom.onmouseup = (e) => doUp(e, dom);
                // 鼠标拖拽事件（当发生拖拽行为时关掉）
                dom.ondragover = () => doOver();
                // addEventListener会触发同个事件的所有效果
                // dom.addEventListener('mousedown', (e) => doDown(e, dom), true);
                // dom.addEventListener('mousemove', (e) => doMove(e, dom), true);
                // dom.addEventListener('mouseup', (e) => doUp(e, dom), true);
                // dom.addEventListener('dragover', (e) => doOver(e, dom), true);
            }
        });
    };

    const unintall = () => {
        doms.map((dom) => {
            if (dom) {
                dom.onmousemove = null;
                dom.onmouseup = null;
                dom.onmousedown = null;
                dom.ondragover = null;
                // dom.removeEventListener('mousedown', (e) => doDown(e, dom), true);
                // dom.removeEventListener('mousemove', (e) => doMove(e, dom), true);
                // dom.removeEventListener('mouseup', (e) => doUp(e, dom), true);
                // dom.removeEventListener('dragover', (e) => doOver(e, dom), true);
            }
        });
    };

    useEffect(() => {
        addEvent();
        return () => {
            unintall();
        };
    });

    return props.children;
}
