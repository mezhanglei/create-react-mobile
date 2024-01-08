const path = require("path");
const fs = require('fs');
// 返回运行当前脚本的工作目录的路径。
const appRoot = fs.realpathSync(process.cwd());
// 加载根目录下面的其他目录
const resolveApp = relativePath => path.resolve(appRoot, relativePath);
// 打包入口
const srcPath = resolveApp('src');
// node_modules的目录
const nodeModulesPath = resolveApp('node_modules');
// 引入配置
const configs = require('./configs.js');
// 是否为开发环境
const isDev = configs.isDev;
// 打包入口
const appEntry = path.join(srcPath, 'index');
// 应用html模板
const appHtml = path.join(srcPath, 'index.html');
// 输出目录
const outputPath = resolveApp('dist');
// 合并为一个对象输出
module.exports = {
  appRoot,
  srcPath,
  nodeModulesPath,
  appEntry,
  appHtml,
  outputPath,
  // 资源访问的公共绝对路径, 并且访问路由会加上对应的路径字符串， 默认为/不能为空(格式如: /publicPath/)
  publicPath: isDev ? '/' : './',
  babelrcPath: path.join(appRoot, './.babelrc'),
  mockPath: path.join(srcPath, 'mock'),
  // favicon: path.join(staticPath, '')
};
