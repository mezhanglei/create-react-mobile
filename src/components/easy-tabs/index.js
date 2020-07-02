import React, { useState, useEffect, useRef } from 'react';
import styles from './index.less';


/**
 * 简易组件tabs组件
 * @param {*} props 
 */
export default function EasyTabs(props) {
    const { data = [] } = props;
    let [current, setCurrent] = useState(0);
    let tabParent = useRef();
    let [currentDom, setCurrentDom] = useState();

    // 点击tab组件时
    const selectItem = (item, index) => {
        setCurrent(index);
        // 点击的回调传给父组件
        props.callback(item, index);
    };

    useEffect(() => {
        // 设置当前选中的dom元素
        setCurrentDom(tabParent.current.children[current]);
    });
    return (
        <div className={styles['easy-tabs']}>
            <div className={styles['easy-tabs-container']}>
                <div className={styles['easy-tabs-content']}>
                    <ul ref={tabParent} className={styles['easy-tabs-list']}>
                        {
                            data && data.map((item, index) => {
                                return (
                                    <li
                                        key={index}
                                        className={current == index ? `${styles['tab-item']} ${styles['tab-item-active']}` : `${styles['tab-item']}`}
                                        onClick={() => selectItem(item, index)}
                                    >
                                        {item.label}
                                    </li>
                                );
                            })
                        }
                    </ul>
                    <div style={{ transform: `translate3d(${currentDom && currentDom.offsetLeft}px, 0px, 0px)`, display: 'block', width: currentDom && currentDom.getBoundingClientRect().width + 'px' }} className={styles['tabs-line']}></div>
                </div>
            </div>
        </div>
    );
}