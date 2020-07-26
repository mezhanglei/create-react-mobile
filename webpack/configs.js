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
// 预编译文件输出目录
const dllOutputPath = path.join(staticPath, 'dll');
// 单/多页面的入口所在目录
const pagesRoot = path.join(srcPath, 'pages');
// 资源访问的公共绝对路径(格式如: /publicPath/)
const publicPath = '';

// 公共配置(开发/生产均使用)
const baseConfig = {
    // css文件中静态资源的引用路径
    assetsPath: '../',
    // 引用入口配置,在项目中可以直接以键开头代替绝对路径引入
    resolve: {
        extensions: [".vue", ".js", ".json"],
        alias: {
            "@": `${srcPath}`,
            "src": `${srcPath}`,
            "static": `${staticPath}`,
            "less": `${lessPath}`
        }
    },
    // babel的配置文件路径
    babelPath: path.join(root, './.babelrc')
};

// 引入外部文件的基础路径
const commonBase = publicPath;
// script引入的公共js文件
const commonJs = [
    // 预编译文件
    // commonBase + 'static/dll/base_dll.js'
];
// link引入的公共css文件
const commonCSS = [
    // commonBase + `static/fonts/iconfont.css?time=${new Date().getTime()}`
];

// 项目全局自定义变量
const globalDefine = {
    'process.env': {
        // mock数据环境
        MOCK: process.env.MOCK,
        // 资源引用的公共路径字符串
        PUBLIC_PATH: JSON.stringify(publicPath),
    }
};

// 页面配置信息
const pages = [
    // name: src/pages下的页面目录名, 数组的第一个项为启动页，index目录不建议改名，其他目录可以任意命名
    // 访问多页面的方式： 域名 + 端口 + 入口的名.html
    { name: "index", title: "第一个页面", favicon: path.join(staticPath, "favicon.ico") },
    { name: "second", title: "第二个页面", favicon: path.join(staticPath, "favicon.ico") }
];


// 动态获取所有入口js文件返回对象(规则: 页面所在目录名作为入口js的键)
const entries = (function () {
    let obj = {};
    // 遍历路径数组用正则匹配页面所在的文件名
    pages.map((item) => {
        // 页面所在目录名作为入口的键
        obj[item.name] = [path.join(pagesRoot, 'index.js'), path.join(pagesRoot, item.name, 'index.js')];
    });
    return obj;
})();


// 动态生成单/多页面的html的配置数组(针对htmlwebpackplugin的配置)
const htmlConfigs = (function () {
    const pluginConfigs = pages.map((item, index) => {
        return {
            // title: '生成的html文档的标题',
            // 指定输出的html文档
            filename: `${item.name}.html`,
            // html模板所在的位置，默认支持html和ejs模板语法，处理文件后缀为html的模板会与html-loader冲突
            template: path.join(pagesRoot, 'index.html'),
            // 不能与template共存，也可以指定html字符串
            // templateContent: string|function,
            // 默认script一次性引用所有的chunk(chunk的name)
            chunks: ["vendors", "common", `runtime~${item.name}`, item.name],
            // 跳过一个块
            // excludeChunks: [],
            // 注入静态资源的位置:
            //    1. true或者body：所有JavaScript资源插入到body元素的底部
            //    2. head： 所有JavaScript资源插入到head元素中
            //    3. false：所有静态资源css和JavaScript都不会注入到模板文件中
            inject: true,
            // 图标的所在路径，最终会被打包到到输出目录
            favicon: item.favicon,
            // 注入meta标签，例如{viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no'}
            // meta: {},
            // 注入base标签。例如base: "https://example.com/path/page.html
            // base: false,
            minify: {
                // 根据html5规范输入 默认true
                html5: true,
                // 是否对大小写敏感 默认false
                caseSensitive: false,
                // 去除属性引用
                removeAttributeQuotes: process.env.NODE_ENV === "development" ? false : true,
                // 删除空格换行 默认false
                collapseWhitespace: process.env.NODE_ENV === "development" ? false : true,
                // 当标记之间的空格包含换行符时，始终折叠为1换行符（从不完全删除它）。collapseWhitespace=true, 默认false
                preserveLineBreaks: false,
                // 压缩link进来的本地css文件 默认false,需要和clean-css一起使用
                minifyCSS: false,
                // 压缩script内联的本地js文件 默认false,为true需要和teserwebpackplugin一起使用
                minifyJS: true,
                // 移除html中的注释 默认false
                removeComments: true
            },
            // 如果为true则为所有的script引入和css引入添加唯一的hash值
            // hash: false,
            // 错误详细信息将写入html
            // showErrors: true,
            commonJs: commonJs,
            commonCSS: commonCSS
        };
    });
    return pluginConfigs;
})();

// 开发环境配置
const devConfig = {
    // 是否使用eslint true表示使用
    useEslint: false,
    // 是否使用stylelint true表示使用
    useStylelint: true,
    // eslint的配置文件路径
    eslintPath: path.join(root, "./.stylelintrc.js"),
    // stylelint的配置文件
    stylelintPath: path.join(root, "./.stylelintrc.js"),
    // stylint的检查根目录
    checkStyleRoot: srcPath,
    // stylelint的检查匹配路径
    checkStylePath: ["src/**/*.{css,sass,scss,less}"],
    // 启动页的html位置(相对于ouput的路径, 默认为第一个页面)
    indexHtml: htmlConfigs[0] && htmlConfigs[0].filename,
    // url访问页面的启动页的公共路径(不能以'/'开头)
    openPage: /^\//.test(publicPath) ? publicPath.replace(/^\/+/, '') : publicPath,
    // mock文件夹位置
    mock: path.join(srcPath, 'mock')
};

// 生产环境配置
const prodConfig = {
    // 是否开启体积分析插件
    isAnalyz: false,
    // 如果启用css-treeshaking则设置目标文件
    treeShakingCssPath: globAll.sync([
        // 入口文件
        path.join(root, "src/**/*.js"),
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
    entries,
    globalDefine,
    htmlConfigs,
    root,
    srcPath,
    staticPath,
    outputPath,
    dllOutputPath,
    pagesRoot,
    publicPath,
    ...baseConfig,
    ...devConfig,
    ...prodConfig,
    ...dllConfig
};
