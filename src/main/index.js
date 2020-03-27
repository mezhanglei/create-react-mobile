import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import App from './App';
import store from '@/store/index.js'

// 引入全局样式
import "@/assets/css/base.scss"
// 处理点击移动端事件
import FastClick from 'fastclick';
FastClick.attach(document.body);
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>
  , document.getElementById('root'));

