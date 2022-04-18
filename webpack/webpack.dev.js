"use strict";

const merge = require('webpack-merge');
const base = require('./webpack.base.js');
const fs = require('fs');
// 1. path.join('字段1','字段2'....) 使用平台特定的分隔符把所有的片段链接生成相对路径,遇到..和../时会进行相对路径计算
// 2. path.resolve('字段1','字段2'....) 从右到左拼接路径片段,返回一个相对于当前工作目录的绝对路径,当遇到/时表示根路径,遇到../表示上一个目录, 如果还不是完整路径则自动添加当前绝对路径
const path = require("path");
// 引入配置
const configs = require('./configs.js');

module.exports = merge(base, {
  // mode一共可设置三种环境production development none 分别表示生产环境还是开发环境还是什么都不做
  // mode设置的作用主要是根据当前环境进行一些优化工作
  // development 开启NamedChunksPlugin 和 NameModulesPlugin
  // production开启FlagDependencyUsagePlugin, FlagIncludedChunksPlugin, ModuleConcatenationPlugin(减少声明和闭包引起的内存开销,但对引入多次的模块无效), NoEmitOnErrorsPlugin, occurrenceOrderPlugin, SideEffectsFlagPlugin, TerserWebpackPlugin(统一提取js和css)
  mode: "development",
  // 开启source-map 用途是为了在开发环境中便于调试错误 因为打包过后的代码和源代码不一样很难阅读 source map一般只在开发环境运行 生产环境还是保持混乱的状态防止逻辑暴露
  devtool: "source-map",
  // 开发服务器配置
  // 配置webpack的开发服务器
  devServer: {
    // 在html引入静态资源时的根目录(默认为项目根目录)
    contentBase: configs.root,
    // 首次启动页面的html位置(相对于output目录)
    index: configs.indexHtml,
    // 在哪个url路径下首次访问启动页
    openPage: configs.openPage,
    // 有时无法访问可能是端口被占用
    port: 8033,
    // 启动webpack-dev-server时的host(设置为0.0.0.0无论是本机ip或127.0.0.1或localhost都会响应请求)
    host: configs.getNetworkIp(),
    // 开启热更新
    hot: true,
    // true启动时和每次保存之后，那些显示的 webpack 包(bundle)信息将被隐藏。错误和警告仍然会显示, 和stats不能一起使用。
    // noInfo: true,
    // inline模式, 默认true在控制台中显示编译打包重新构建的状态
    inline: true,
    // 一切服务都启用gzip 压缩(也可以通过webpack-dev-server --compress启动)
    compress: true,
    // 当使用 HTML5 History API 时，任意的 404 响应都需要重定向对应的html页面
    historyApiFallback: {
      // 重定向
      rewrites: {
        // 正则匹配路由
        from: new RegExp(".*"),
        // 重定向的目标页面(必须/开头)
        to: (configs.publicPath + '/').replace(/\/+/g, '/') + 'index.html'
      }
    },
    // webpack 使用文件系统(file system)获取文件改动的通知, 但是当在远程进行操作时有可能会出问题,所以需要轮询
    watchOptions: {
      // 重建之前的延迟在此时间段内的改动将被一起聚合在一块重建
      aggregateTimeout: 300,
      // 打开轮询并设置周期
      poll: 1000,
      // 忽视的文件夹,多个文件夹使用这种形式['files/**/*.js', 'node_modules/**']
      ignored: /node_modules/,
    },
    // true启用https，false不启用
    https: false,
    // webpack启动或保存时命令行的信息,当配置了quiet或noInfo时，该配置不起作用
    stats: "errors-only",
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
    // overlay: {
    //   // 显示警告信息
    //   warnings: false,
    //   // 显示错误信息
    //   errors: false
    // },
    before: function (app, server) {
      if (process.env.MOCK) {
        app.get('/mock/*', handleRequest);
        app.post('/mock/*', handleRequest);
      }
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
  let fileUrl = path.join(configs.mock, reqPath.replace(/\/mock/ig, "") + '.json');
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
