"use strict";

const merge = require('webpack-merge');
const base = require('./webpack.base.js');
// (构建过程优化)多进程/多实例压缩
const TerserWebpackPlugin = require("terser-webpack-plugin");
// (构建过程优化)webpack速度分析插件,在package.json中配置命令webpack --progress --config webpack.prod.js --json > stats.json,执行可以输出分析时间结果
const SpeedMeasureWebpackPlugin = require("speed-measure-webpack-plugin");

const webpackConfig = merge(base, {
  mode: "production",
  devtool: false,
  // 优化项
  optimization: {
    // 分割js代码块,目的是进行颗粒度更细的打包,将相同的模块提取出来打包这样可以减小包的体积(以前用CommonsChunkPlugin)
    // 1.基础类库：react，react-redux，react-router-dom等等
    // 2.UI库：antd，antd-icons
    // 3.公共组件库：自定义的公共组件
    // 4.页面(react和vue提供了分包策略,不需要这个)
    splitChunks: {
      // 打包的库或者文件必须大于这个字节才会进行拆分
      minSize: 0,
      // 一个入口最大的并行请求数
      maxAsyncRequests: 5,
      // 按需加载时候最大的并行请求数
      maxInitialRequests: 3,
      // 分包后的名称间隔符, 默认~
      // automaticNameDelimiter: "~",
      // 配置规则(里面选项自定义, 默认选项有vendors基础资源包和default(即output输出)资源包)
      cacheGroups: {
        // 重写vendors基础资源打包分组
        // vendors: {
        //     name: "vendors",
        //     test: /[\\/]node_modules[\\/]/,
        //     chunks: "initial",
        //     priority: 1,
        //     // 默认true时，该组复用引用的其他chunk，false时则不会复用而是重新创建一个新chunk
        //     reuseExistingChunk: false,
        // },
        // 不同的html公用的包
        common: {
          // 打包的chunks名，最终打包名称为${cacheGroup的key} ${automaticNameDelimiter} ${chunk的name},可以自定义
          name: "common",
          // 同时分割同步和异步代码，这里选择打包同步代码
          chunks: "initial",
          // 至少在两个html中引用过，默认为1
          minChunks: 2,
          // 提取的优先级顺序 一般基础包先提取 基础包提取完后再进行commons的提取 防止提取的区域重合
          priority: -10,
        },
      },
    },
    // 默认true，表示启用压缩代码
    minimize: true,
    // 默认启用 确定提供哪些导出
    providedExports: true,
    // 默认启用，确定每个模块的导出
    usedExports: true,
    // 默认false，为true时在tree shaking的时候，跳过package.json里的sideEffects选项中的模块
    sideEffects: true,
    // 从原js分割出来的包的模块信息和运行时打包出来，并需要htmlwebpackplugin里的chunks引入，目的是为了使分割出来的包和原js之间改动不会相互影响hash值
    runtimeChunk: {
      name: entrypoint => `runtime~${entrypoint.name}`
    },
    // (构建过程)多进程多实例并行压缩,(以前使用uglifyjs-webpack-plugin)
    minimizer: [
      new TerserWebpackPlugin({
        // 压缩包含
        // include: undefined,
        // 匹配文件
        // test: /\.m?js(\?.*)?$/i,
        // 排除文件
        // exclude: undefined,
        // 过滤所有的chunk, 返回true表示该块可以压缩，返回false表示不可以
        // chunkFilter: (chunk) => {
        //   // Exclude uglification for the `vendor` chunk
        //   if (chunk.name === 'vendor') {
        //     return false;
        //   }
        //   return true;
        // },

        // 默认true开启多进程，也可以设置数字表示进程数
        parallel: true,
        // 启用文件缓存，缓存目录的默认路径：node_modules/.cache/terser-webpack-plugin。也可以手动设置路径
        cache: true,
        // 去掉console.log
        terserOptions: {
          compress: {
            pure_funcs: ["console.log"]
          }
        }
      })
    ],
  }
});
// (构建过程优化)实例化一个速度分析对象(它的wrap方法用来包裹webpack配置)
const smp = new SpeedMeasureWebpackPlugin();
module.exports = smp.wrap(webpackConfig);