/**
 * webpack的配置管理文件
 */
// 根据目标字符串自动匹配来动态扫描目标文件返回符合要求的文件路径数组,glob只能扫描一个,如果要同时扫描多个路径请使用glob-all
// 匹配规则: 1. * 在单个路径中间匹配一个目录/文件, /* 则表示一个或多个子目录/文件 2. ** 在单个路径中间匹配部分0个或多个目录/文件
const glob = require("glob");
const globAll = require("glob-all");
// 1. path.join('字段1','字段2'....) 使用平台特定的分隔符把所有的片段链接生成相对路径,遇到..和../时会进行相对路径计算
// 2. path.resolve('字段1','字段2'....) 从右到左拼接路径片段,返回一个相对于当前工作目录的绝对路径,当遇到/时表示根路径,遇到../表示上一个目录, 如果还不是完整路径则自动添加当前绝对路径
const path = require("path");
// const versionShell = require('./version.js');

// 整个项目的根目录
const root = path.join(__dirname, '..');
// 打包的入口目录
const srcPath = path.join(root, 'src');
// 静态资源所在目录
const staticPath = path.join(root, 'static');
// 全局less所在目录
const lessPath = path.join(root, 'less');
// 项目输出dist目录
const outputPath = path.join(root, "dist");
// node_modules的目录
const nodemodules = path.join(root, 'node_modules');
// 预编译文件输出目录
const dllOutputPath = path.join(staticPath, 'dll');
// 页面模板所在的根目录
const htmlPages = path.join(srcPath, 'pages');
// 版本信息
// const versionInfo = versionShell.getBranchVersionInfo();
// 资源访问的公共绝对路径, 并且访问路由会加上对应的路径字符串， 默认为/不能为空(格式如: /publicPath/)
const defaultPath = process.env.NODE_ENV === "development" ? '/' : './';
const publicPath = defaultPath;
// 公共配置(开发/生产均使用)
const baseConfig = {
    // 修改打包后目录中css文件中静态资源的引用的相对路径
    assetsPath: '../',
    // 引用入口配置,在项目中可以直接以键开头代替绝对路径引入
    resolve: {
        // 后缀，引入时可以默认不写
        extensions: [".ts", ".tsx", ".js", "jsx", ".json", ".less"],
        alias: {
            "@": `${srcPath}`,
            "src": `${srcPath}`,
            "static": `${staticPath}`,
            "less": `${lessPath}`
        }
    },
    // 暴露的全局模块，如果加载的模块没有使用，则不会被打包
    providePlugin: {
        React: "react",
        ReactDOM: "react-dom",
        ReactRouterDOM: "react-router-dom",
    },
    // babel的配置文件路径
    babelPath: path.join(root, './.babelrc'),
    // 入口文件
    entry: {
        index: `${srcPath}/pages/index`
    },
    // mock入口
    mock: path.join(srcPath, 'mock')
};

// 开发环境配置
const devConfig = {
    // 是否使用eslint true表示使用
    useEslint: false,
    // 是否使用stylelint true表示使用
    useStylelint: true,
    // eslint的配置文件路径
    eslintPath: path.join(root, "./.stylelintrc.{js,ts}"),
    // stylelint的配置文件
    stylelintPath: path.join(root, "./.stylelintrc.{js,ts}"),
    // stylint的检查根目录
    checkStyleRoot: srcPath,
    // stylelint的检查匹配路径
    checkStylePath: ["src/**/*.{css,sass,scss,less}"],
    // 启动页的html位置(相对于ouput的路径, 默认为第一个页面)
    indexHtml: 'index.html',
    // url访问页面的启动页的公共路径(不能以'/'开头)
    openPage: /^\//.test(publicPath) ? publicPath.replace(/^\/+/, '') : publicPath,
};

// 生产环境配置
const prodConfig = {
    // 是否开启体积分析插件
    isAnalyz: false,
    // 如果启用css-treeshaking则设置目标文件
    treeShakingCssPath: globAll.sync([
        // 入口文件
        path.join(root, "src/**/*.{js,ts}"),
        // less文件
        path.join(root, "src/**/*.less")
    ]),
    // 打包时静态资源拷贝到目标目录
    staticOutPath: path.join(outputPath, 'static')
};

// 预编译文件配置
const dllConfig = {
    // 预编译之后输出的文件
    manifestPathArr: glob.sync(path.join(dllOutputPath, '*.json'))
};

// 合并为一个对象输出
module.exports = {
    root,
    htmlPages,
    srcPath,
    staticPath,
    outputPath,
    dllOutputPath,
    publicPath,
    nodemodules,
    ...baseConfig,
    ...devConfig,
    ...prodConfig,
    ...dllConfig
};
