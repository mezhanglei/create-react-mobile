// 1. path.join('字段1','字段2'....) 使用平台特定的分隔符把所有的片段链接生成相对路径,遇到..和../时会进行相对路径计算
// 2. path.resolve('字段1','字段2'....) 从右到左解析路径片段, 当遇到/时表示根路径,遇到../表示上一个目录, 如果还不是完整路径则自动添加当前绝对路径
const path = require("path");
const fs = require('fs');
// 根据目标字符串自动匹配来动态扫描目标文件返回符合要求的文件路径数组,glob只能扫描一个,如果要同时扫描多个路径请使用glob-all
// 匹配规则: 1. * 在单个路径中间匹配一个目录/文件, /* 则表示一个或多个子目录/文件 2. ** 在单个路径中间匹配部分0个或多个目录/文件
const glob = require("glob");
// 返回运行当前脚本的工作目录的路径。
const appRoot = fs.realpathSync(process.cwd());
// 加载根目录下面的其他目录
const resolveApp = relativePath => path.resolve(appRoot, relativePath);
// 打包入口
const srcPath = resolveApp('src');
// 静态资源所在目录
const staticPath = resolveApp('static');
// 全局less所在目录
const lessPath = resolveApp('less');
// 输出目录
const outputPath = resolveApp('dist');
// node_modules的目录
const nodeModulesPath = resolveApp('node_modules');
// 预编译文件输出目录
const dllOutputPath = path.join(staticPath, 'dll');
// 页面模板
const appHtml = path.join(srcPath, 'pages/index.html');
// 引入配置
const configs = require('./configs.js');
const isDev = configs.isDev;
// 合并为一个对象输出
module.exports = {
  appRoot,
  srcPath,
  staticPath,
  lessPath,
  outputPath,
  nodeModulesPath,
  dllOutputPath,
  appHtml,
  // 资源访问的公共绝对路径, 并且访问路由会加上对应的路径字符串， 默认为/不能为空(格式如: /publicPath/)
  publicPath: isDev ? '/' : './',
  manifestPathArr: glob.sync(path.join(dllOutputPath, '*.json')),
  babelrcPath: path.join(appRoot, './.babelrc'),
  eslintrcPath: path.join(appRoot, "./.eslintrc.{js,ts}"),
  stylelintrcPath: path.join(appRoot, "./.stylelintrc.js"),
  assetsPath: '../',
  checkStylePath: ["src/**/*.{css,sass,scss,less}"],
  mockPath: path.join(srcPath, 'mock'),
  // favicon: path.join(staticPath, '')
};