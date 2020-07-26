import React, { Component, useState } from 'react';
import { TabBar } from 'antd-mobile';

/**
 * 导航栏容器组件
 * @param {*} props 外界传过来的props
 */
function TabNav(props) {
    // 底部导航栏
    const navList = [{
        title: "首页",
        path: "/",
        icon: "iconfont iconhome",
        selectIcon: "iconfont iconhome",
        badge: 1,
        dot: false
    }, {
        title: "分类",
        path: "/category",
        icon: "iconfont icon-fenlei",
        selectIcon: "iconfont icon-fenlei",
        badge: "new",
        dot: false
    }, {
        title: "购物车",
        path: "/cart",
        icon: "iconfont icongouwuche1",
        selectIcon: "iconfont icongouwuche1",
        badge: 1,
        dot: false
    }, {
        title: "我的",
        path: "/personal",
        icon: "iconfont iconweibiaoti2fuzhi12",
        selectIcon: "iconfont iconweibiaoti2fuzhi12",
        badge: "",
        dot: true
    }];

    let [tabList] = useState(navList);
    return (
        <TabBar
            unselectedTintColor="#949494"
            tintColor="#33A3F4"
            barTintColor="white"
        >
            {
                tabList.map((item, index) => {
                    return (
                        <TabBar.Item
                            title={item.title}
                            key={index}
                            icon={<i className={item.icon}></i>}
                            selectedIcon={<i className={item.selectIcon} style={{ color: '#33A3F4' }}></i>}
                            selected={props.location.pathname === item.path}
                            onPress={() => { props.history.push(item.path); }}
                        >
                            {/* 利用props.children接收 */}
                            {props.children}
                        </TabBar.Item>
                    );
                })
            }
        </TabBar>
    );
}

/**
 * 接受一个组件返回另一个组件的高阶组件
 * @param {*} ParentComponent 容器父组件
 * @param {*} SubComponent 被包裹子组件
 * 使用： TabNav(目标组件)
 */
function TabNavHigh(SubComponent) {
    return (props) => (
        <TabNav {...props}>
            <SubComponent {...props}></SubComponent>
        </TabNav>
    );
}

export default TabNavHigh;
