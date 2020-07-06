import React, { useState, useEffect, useRef } from 'react';
import { IsDOM, IsNodeList } from '@/utils/dom-utils.js';

// 监听的事件类别
// const EVENTS = [
//     'resize',
//     'scroll',
//     'touchstart',
//     'touchmove',
//     'touchend',
//     'pageshow',
//     'load'
// ];

const EVENTS = [
    'scroll'
];

/**
 * 吸顶组件(任意指定滚动的根节点和目标的dom，实现目标的吸顶效果)
 * @param {*} props
 * 必填参数：root 滚动的根节点
 *          target 要吸顶的目标节点 [HTMLElement] | HTMLElement | NodeList DOM数组及伪数组或者单个DOM
 *          initDistance 目标节点距离滚动根节点的初始距离 Number类型
 * 非必填参数:
 *          topDistance 目标距离滚动根节点多少距离开始吸顶
 * 
 *  使用: <EasySticky root={} target={}></EasySticky>
 */
export default function EasySticky(props) {
    // 要操作的dom数组
    const target = (props.target instanceof Array) ? props.target : (IsNodeList(props.target) ? [...props.target] : [props.target]);
    // 要吸顶的根节点
    const root = IsDOM(props.root) ? props.root : null;
    // 绑定事件
    const addEvent = () => {
        EVENTS.map((event) => {
            root.addEventListener(event, (e) => handleEvent(e), false);
        });
    };

    // 卸载事件
    const unInstall = () => {
        EVENTS.map((event) => {
            root.removeEventListener(event, (e) => handleEvent(e), false);
        });
    };

    // 事件处理函数
    const handleEvent = (e) => {
        try {
            if (IsDOM(root)) {
                target.map((dom) => {
                    if (IsDOM(dom)) {
                        // 距离滚动根节点的初始距离
                        const initDistance = props.initDistance || 0;
                        // 距离滚动根节点多少开始吸顶
                        const topDistance = props.topDistance || 0;
                        // 根节点滚动的距离
                        const rootScrollTop = root.scrollTop;
                        // 要向下滚动的高度 = 根节点的scrollTop - (目标距离滚动根节点初始距离 - topDistance)
                        const transform = `translateY(${rootScrollTop - (initDistance - topDistance)}px)`;
                        const elStyles = [
                            `transform:${transform}`,
                            `-ms-transform:${transform}`,
                            `-moz-transform:${transform}`,
                            `-webkit-transform:${transform}`,
                            `-o-transform:${transform}`
                        ];

                        // 当正常情况时
                        if (rootScrollTop - initDistance < topDistance) {
                            // console.log(rootScrollTop, '上');
                            // dom.style.cssText = '';
                            dom.style.transform = 'translateY(0)';
                        } else {
                            // console.log(rootScrollTop, '下');
                            dom.style.cssText = (elStyles.join(';'));
                        }
                    }
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        addEvent();
        return () => {
            unInstall();
        };
    });

    return props.children;
}

