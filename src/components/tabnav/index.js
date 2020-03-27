import React, { Component, useState } from 'react';
import { TabBar } from 'antd-mobile';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { navList } from "@/configs/commondata.js";
function FooterNav(props) {
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
              {/* 利用props.children接收FooterNav组件innerHTML位置的内容 */}
              {props.children}
            </TabBar.Item>
          )
        })
      }
    </TabBar>
  )
}

const mapStateToProps = state => {
  return {
    userInfo: state.userModule.userInfo
  }
}

export default withRouter(connect(mapStateToProps)(FooterNav));
