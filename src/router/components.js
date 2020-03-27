/**
 * 导出组件
 * 通过React的lazy组件实现代码分割组件,注释为分割的模块名, 同一个模块名打包最终会被打包到一起
 */

import React from "react"
// ==========首页========== //
export const Home = React.lazy(() => import(/* webpackChunkName: "home" */ '@/views/home/index.js'));
//  export const NotFound = React.lazy(() => import(/* webpackChunkName: "home" */ '@/views/home/404.js'));

// ==========分类========== //
export const Category = React.lazy(() => import(/* webpackChunkName: "category" */ '@/views/category/index.js'));

// ==========购物车========== //
export const Cart = React.lazy(() => import(/* webpackChunkName: "cart" */ '@/views/cart/index.js'));

// ==========个人中心========== //
export const Personal = React.lazy(() => import(/* webpackChunkName: "personal" */ '@/views/personal/index.js'));