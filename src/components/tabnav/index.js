import React, { Component, useState } from 'react';
import { TabBar } from 'antd-mobile';

/**
 * 导航栏容器组件
 * @param {*} props 外界传过来的props
 */
function FooterNav(props) {
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
  }]

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
              onPress={() => { props.history.push(item.path) }}
            >
              {/* 利用props.children接收 */}
              {props.children}
            </TabBar.Item>
          )
        })
      }
    </TabBar>
  )
}

/**
 * 功能：将目标路由组件包裹起来变成有底部导航的页面
 * @param {*} ComponentModule 传入需要底部导航栏的页面组件
 * 使用方式：
 * 1. 先导入： import TabNav from "@/components/tabnav/index.js";
 * 2. 将目标组件包裹：TabNav(目标组件)
 * 3. 通过Route组件实例化(只要在@/router/routes.js中配置过路由的组件可以省略这一步)
 */
function TabNav(ComponentModule) {
  const Wrap = FooterNav;
  return (props) => (
    <Wrap {...props}>
      <ComponentModule {...props}></ComponentModule>
    </Wrap>
  );
};

export default TabNav;
