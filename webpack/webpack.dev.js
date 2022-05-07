"use strict";

const { merge } = require('webpack-merge');
const base = require('./webpack.base.js');
const fs = require('fs');
// 1. path.join('字段1','字段2'....) 使用平台特定的分隔符把所有的片段链接生成相对路径,遇到..和../时会进行相对路径计算
// 2. path.resolve('字段1','字段2'....) 从右到左拼接路径片段,返回一个相对于当前工作目录的绝对路径,当遇到/时表示根路径,遇到../表示上一个目录, 如果还不是完整路径则自动添加当前绝对路径
const path = require("path");
// 引入配置
const configs = require('./configs.js');
// 引入路径
const paths = require('./paths.js');

module.exports = merge(base, {
  // mode一共可设置三种环境production development none 分别表示生产环境还是开发环境还是什么都不做
  // mode设置的作用主要是根据当前环境进行一些优化工作
  // development 开启NamedChunksPlugin 和 NameModulesPlugin
  // production开启FlagDependencyUsagePlugin, FlagIncludedChunksPlugin, ModuleConcatenationPlugin(减少声明和闭包引起的内存开销,但对引入多次的模块无效), NoEmitOnErrorsPlugin, occurrenceOrderPlugin, SideEffectsFlagPlugin, TerserWebpackPlugin(统一提取js和css)
  mode: "development",
  // eval(构建快，重建最快, 但是开发报错寻址不详细)eval-cheap-module-source-map(构建慢，重建快)
  devtool: "eval-cheap-module-source-map",
  // 在初始构建之后，webpack 将继续监听任何已解析文件的更改
  watch: true,
  // webpack 使用文件系统(file system)获取文件改动的通知, 但是当在远程进行操作时有可能会出问题,所以需要轮询
  watchOptions: {
    // 重建之前的延迟在此时间段内的改动将被一起聚合在一块重建
    aggregateTimeout: 500,
    // 打开轮询并设置周期
    poll: 1000,
    // 忽视的文件夹,多个文件夹使用这种形式['files/**/*.js', 'node_modules/**']
    ignored: /node_modules/,
  },
  // 开发服务器配置
  // 配置webpack的开发服务器
  devServer: {
    // 启动时打开浏览器
    open: true,
    // 有时无法访问可能是端口被占用n
    port: 8034,
    // 启动webpack-dev-server时的host(设置为0.0.0.0无论是本机ip或127.0.0.1或localhost都会响应请求)
    host: configs.getNetworkIp(),
    // 开启热更新
    hot: true,
    // 一切服务都启用gzip 压缩(也可以通过webpack-dev-server --compress启动)
    compress: true,
    // 当使用 HTML5 History API 时，任意的 404 响应都需要重定向对应的html页面
    historyApiFallback: {
      // 重定向
      rewrites: [{
        // 正则匹配路由
        from: new RegExp(".*"),
        // 重定向的目标页面(必须/开头)
        to: (paths.publicPath + '/').replace(/\/+/g, '/') + 'index.html'
      }]
    },
    // 默认http
    // server: 'https',
    // 中间件
    devMiddleware: {
      stats: 'errors-only',
    },
    // 开发环境接口域名代理
    proxy: [
      {
        // 当以context里的任意一个字符串开头的接口都会通过本地代理访问目标接口域名下
        context: ["/api"],
        // 要代理访问的目标接口域名
        target: "http://localhost:3000",
        // 允许代理 websockets 协议
        ws: true,
        // true不接受运行在 HTTPS 上，且使用了无效证书的后端服务, false关闭安全检测
        secure: false,
        // 需要虚拟托管的站点要设为true，开发时大部分情况都是虚拟托管的站点
        changeOrigin: true,
        // 实际请求中不存在代理字段则重写接口路径把api字符串去掉
        pathRewrite: {
          "^/api": "",
        }
      },
    ],
    // 将错误或警告覆盖显示在浏览器屏幕上
    client: {
      // 全屏覆盖
      overlay: {
        errors: true,
        warnings: false,
      },
      logging: 'error' // 控制台只显示warn以上信息
    },
    setupMiddlewares: (middlewares, devServer) => {
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined');
      }

      devServer.app.get('/mock/*', handleRequest);
      devServer.app.post('/mock/*', handleRequest);
      return middlewares;
    }
  }
});

// 拦截请求
function handleRequest(req, res) {
  let data = "";
  // 接口路径req.originalUrl或req.path
  let reqPath = req.path.replace(/\/\//g, '/');
  // 接口路径上的query参数
  let reqQuery = req.query;
  // 协议
  let protocol = req.protocol;
  // 方法
  let method = reqQuery['method'];
  // mock数据存放的文件路径作为mock请求的接口路径
  let fileUrl = path.join(paths.mockPath, reqPath.replace(/\/mock/ig, "") + '.json');
  if (!fileUrl) {
    res.json({
      code: '-1',
      msg: '接口不存在'
    });
    res.end();
    return;
  }
  try {
    data = fs.readFileSync(fileUrl, { encoding: 'utf-8' });
    new Promise(function (resolve) {
      setTimeout(function () {
        resolve();
        res.json(JSON.parse(data));
      }, Math.random() * 3000);
    });
  } catch (e) {
    console.error(e);
  }
}
