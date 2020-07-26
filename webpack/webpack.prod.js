"use strict";

// 根据目标字符串自动匹配来动态扫描目标文件返回符合要求的文件路径数组,glob只能扫描一个,如果要同时扫描多个路径请使用glob-all
// 匹配规则: 1. * 在单个路径中间匹配一个目录/文件(不会匹配路径分隔符/), /* 则表示一个或多个子目录/文件 2. ** 在单个路径中间匹配部分0个或多个目录/文件
const glob = require("glob");
const globAll = require("glob-all");
// 引入webpack
const webpack = require("webpack");
// 1. path.join('字段1','字段2'....) 使用平台特定的分隔符把所有的片段链接生成相对路径,遇到..和../时会进行相对路径计算
// 2. path.resolve('字段1','字段2'....) 从右到左拼接路径片段,返回一个相对于当前工作目录的绝对路径,当遇到/时表示根路径,遇到../表示上一个目录, 如果还不是完整路径则自动添加当前绝对路径
const path = require("path");
// css文件指纹插件提取css webpack4推荐 在这之前用extracttext 作用是缓存css并解决样式闪动问题 因为只在编译阶段作用 所以不适用于热更新 但在生产环境无需配置热更新也没多大问题
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// css文件压缩
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
// 1.为html文件中引入的外部资源如script、link动态添加每次compile后的hash，防止引用缓存的外部文件问题
// 2.打包时创建html入口文件，比如单页面可以生成一个html文件入口，配置N个html-webpack-plugin可以生成N个页面入口
const HtmlWebpackPlugin = require("html-webpack-plugin");
// 清理项目目录 目的是为了每次打包之前清理掉dist输出文件夹防止最后output的文件增加
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
// 对webpack打包的信息进行警告,错误的明显标识提示 可以选择使用或不使用
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
// (构建过程优化)webpack速度分析插件,在package.json中配置命令webpack --progress --config webpack.prod.js --json > stats.json,执行可以输出分析时间结果
const SpeedMeasureWebpackPlugin = require("speed-measure-webpack-plugin");
// (构建过程优化)webpack体积分析插件(会单独打开一个端口8888的页面显示体积构造图)
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
// (构建过程优化)多进程/多实例压缩
const TerserWebpackPlugin = require("terser-webpack-plugin");
// 实现css的treeshaking 将没有用到的css做擦除 需要和MiniCssExtractPlugin配合使用
// const PurgecssWebpackPlugin = require("purgecss-webpack-plugin");
// 通过CopyWebpackPlugin将目标文件夹里的静态资源拷贝到目标文件夹
const CopyWebpackPlugin = require("copy-webpack-plugin");
// 引入配置
const configs = require('./configs.js');


// === webpack的loader扩展 === //


// === webpack的plugins扩展(plugins中不允许空值存在) === //

// 生成html的plugin配置,返回HtmlWebpackPlugin数组
const HtmlPlugins = () => {
    return configs.htmlConfigs.map(item => {
        return new HtmlWebpackPlugin(item);
    });
};

// webpack从manifest文件中读取到已预编译的文件, 然后忽略对其的编辑打包(这里循环是为了当有多个dll文件时进行循环操作)
const dllArr = configs.manifestPathArr.map((path) => {
    return new webpack.DllReferencePlugin({
        // 上下文环境路径(与dllplugin在同一目录)
        context: configs.root,
        manifest: require(path),
    });
});

// 体积分析插件
const bundleAnalyze = configs.isAnalyz ? [new BundleAnalyzerPlugin()] : [];


//  === webpack配置内容 === //
const webpackConfig = {
    // 对象语法： 1. 当有多条数据，则会打包生成多个依赖分离的入口js文件
    // 2. 对象中的值为路径字符串数组或路径字符串，会被打包到该条数据对应生成的入口js文件
    entry: configs.entries,
    // 解析的起点, 默认为项目的根目录
    context: configs.root,
    // 输出(默认只能打包js文件,如果需要打包其他文件,需要借助相对应的loader)
    output: {
        path: configs.outputPath,
        // chunkhash 基于entery生成hash值 一个文件改动不会影响另一个
        // contenthash 通过MiniCssExtractPlugin提供 基于css文件内容生成 css内容不会影响js文件的hash值生成
        // hash是基于项目 只要项目内容改变就会影响hash值,一般用于开发环境
        // hash值的用处是当改变时浏览器则不会再使用该缓存
        filename: "js/[name]_[chunkhash:8].js",
        // chunkFilename用来打包require.ensure方法中引入的模块,如果该方法中没有引入任何模块则不会生成任何chunk块文件
        // chunkFilename: 'js/[name]_[chunkhash:8].js'
        // 所有静态资源引用的公共绝对路径
        publicPath: configs.publicPath,
    },
    // 让项目中通过es6等模块规范引入的文件不打包到最终的包里, 而是通过script标签引入(与这个有相同功能的就是dll)
    // 其中键为在使用时引入的变量名, 值为npm包名或者绝对路径
    // externals: {
    //   jquery: 'jQuery'
    // },
    // process.env会返回用户的环境变量 process.env.NODE_ENV用来设置当前构建脚本是开发阶段还是生产阶段
    // mode一共可设置三种环境production development none 分别表示生产环境还是开发环境还是什么都不做
    // mode设置的作用主要是根据当前环境进行一些优化工作
    // development 开启NamedChunksPlugin 和 NameModulesPlugin
    // production开启FlagDependencyUsagePlugin, FlagIncludedChunksPlugin, ModuleConcatenationPlugin(减少声明和闭包引起的内存开销,但对引入多次的模块无效), NoEmitOnErrorsPlugin, occurrenceOrderPlugin, SideEffectsFlagPlugin, TerserWebpackPlugin(统一提取js和css)
    mode: "production",
    // 用来指定loaders的匹配规则和指定使用的loaders名称
    module: {
        rules: [
            {
                test: /\.(ts|tsx|js|jsx)$/,
                // 指定必须处理的文件
                // include: ,
                // 忽略第三方
                exclude: /node_modules/,
                use: [
                    {
                        // 多进程打包,必须放在处理js的loader之前
                        loader: "thread-loader",
                        options: {
                            workers: 3,
                        },
                    },
                    {
                        loader: "babel-loader",
                        options: {
                            // 不使用默认的配置路径
                            babelrc: false,
                            // 配置新的babelrc路径
                            extends: configs.babelPath,
                            // 开启babel-loader缓存的参数
                            cacheDirectory: true
                        }
                    }
                ],
            },
            {
                test: /\.css$/,
                // 这里需要遵循一定的顺序 因为是compose函数方式先解析数组后面的css-loader然后插入到style-loader
                use: [
                    // 不能和style-loader一起使用,会互斥
                    // 把 js 中 import 导入的样式文件代码，打包成一个实际的 css 文件，结合 html-webpack-plugin，在 dist/index.html 中以 link 插入 css 文件；默认将 js 中 import 的多个 css 文件，打包时合成一个
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            // 修改css文件中静态资源的引用相对路径
                            publicPath: configs.assetsPath,
                        },
                    },
                    // style-loader 把 js 中 import 导入的样式文件代码，打包到 js 文件中，运行 js 文件时，将样式自动插入到<style>标签中
                    // 'style-loader',
                    // css-loader解析几个css之间的关系 最终把几个css文件打包成一个css文件
                    "css-loader",
                ],
            },
            {
                test: /\.less$/,
                exclude: [configs.srcPath],
                use: [
                    // "style-loader",
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: configs.assetsPath,
                        },
                    },
                    "css-loader",
                    "postcss-loader",
                    {
                        loader: "less-loader",
                        options: {
                            // modifyVars: {
                            //   "@brand-primary": "red"
                            // },
                            modifyVars: {
                                // 引入antd 主题颜色覆盖文件
                                hack: `true; @import "${path.join(
                                    configs.root,
                                    "less/base/theme.less"
                                )}";`,
                            },
                            javascriptEnabled: true,
                        },
                    },
                ]
            },
            {
                test: /\.less$/,
                include: [configs.srcPath],
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: configs.assetsPath,
                        },
                    },
                    // 'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                mode: 'local',
                                localIdentName: '[path][name]__[local]--[hash:base64:5]',
                                context: configs.srcPath
                            },
                            importLoaders: 3,
                            localsConvention: 'camelCase'
                        } //css modules
                    },
                    // 提供一种用js来处理css方法,抽象成语法树结构,一般不单独使用
                    // 1. 在postcss.config.js导出autoprefixer用来自动添加前缀,在cssloader之后执行
                    // 2. 然后在package.json里设置borowserslist选项来设置浏览器兼容版本
                    "postcss-loader",
                    "less-loader"
                ],
            },
            // {
            // 	test: /\.scss$/,
            // 	use: [
            // 		{
            // 			loader: MiniCssExtractPlugin.loader,
            // 			options: {
            // 				publicPath: configs.assetsPath,
            // 			},
            // 		},
            // 		// 'style-loader',
            // 		"css-loader",
            // 		// 提供一种用js来处理css方法,抽象成语法树结构,一般不单独使用
            // 		// 1. 在postcss.config.js导出autoprefixer用来自动添加前缀,在cssloader之后执行
            // 		// 2. 然后在package.json里设置borowserslist选项来设置浏览器兼容版本
            // 		"postcss-loader",
            // 		"sass-loader",
            // 	],
            // },
            // 使用url-loader也可以进行图片和字体的打包 并且可以设置一定大小以下的图片转换成base64编码
            {
                test: /\.(png|svg|jpg|gif|jpeg|ico)$/i,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            // 图片和字体都使用hash值
                            name: "img/[name]_[hash:8].[ext]",
                            // 小于20k全部打包成base64进入页面
                            limit: 20 * 1024,
                            // 默认超出后file-loader
                            fallback: "file-loader"
                        },
                    },
                    // {
                    //     // yarn官方镜像依赖丢失不可用，淘宝镜像正常
                    //     loader: "image-webpack-loader",
                    //     options: {
                    //         mozjpeg: {
                    //             progressive: true,
                    //             quality: 65,
                    //         },
                    //         optipng: {
                    //             enabled: false,
                    //         },
                    //         pngquant: {
                    //             quality: [0.65, 0.9],
                    //             speed: 4,
                    //         },
                    //         gifsicle: {
                    //             interlaced: false,
                    //         },
                    //         webp: {
                    //             quality: 75,
                    //         },
                    //     },
                    // }
                ],
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            // 图片和字体都使用hash值
                            name: "font/[name]_[hash:8].[ext]",
                        },
                    },
                ],
            },
        ],
    },
    // 插件
    plugins: [
        // 暴露模块为全局模块，在全局都可以使用，而不必使用时import或require
        // 如果加载的模块没有使用，则不会被打包
        new webpack.ProvidePlugin({
            React: "react",
            ReactDOM: "react-dom",
            ReactRouter: "react-router",
        }),
        // 设置项目的全局变量,String类型, 如果值是个字符串会被当成一个代码片段来使用, 如果不是,它会被转化为字符串(包括函数)
        new webpack.DefinePlugin(configs.globalDefine),
        // 清理dsit目录
        new CleanWebpackPlugin(),
        // 统计信息提示插件(比如错误或者警告会用带颜色的字体来显示,更加友好)
        new FriendlyErrorsWebpackPlugin(),
        // css文件指纹 使用contenthash 只要css文件不变则contenthash不变
        new MiniCssExtractPlugin({
            filename: "css/[name]_[contenthash:8].css",
        }),
        // css实现treeshaking(删除无用的css, 不适用css modules模式) 需要和MiniCssExtractPlugin配合使用
        // new PurgecssWebpackPlugin({
        //     paths: configs.treeShakingCssPath,
        //     // whitelist白名单不清除哪些类名, whitelistPatternsChildren白名单选项设置不清除某某开头的类或标签类及子类包裹的样式
        //     whitelist: ["html"],
        // }),
        // css文件压缩(只会对解析后的css文件进行压缩)
        new OptimizeCSSAssetsPlugin({
            assetNameRegExp: /\.css$/g,
            // 依赖于cssnano, 但cssnano和css-loader都会将scale3d(1,1,1)转换为scalex(1) 可以通过js来设置style规避问题
            cssProcessor: require("cssnano"),
            cssProcessorOptions: {
                // 避免cssnano重新计算css
                safe: true,
            }
        }),
        // 将目标目录里的文件直接拷贝到输出dist目录
        new CopyWebpackPlugin([
            {
                from: configs.staticPath,
                to: configs.staticOutPath
                // 忽略文件名
                // ignore: ['.*']
            },
        ]),
        ...HtmlPlugins(),
        ...dllArr,
        ...bundleAnalyze
    ],
    // require 引用入口配置
    resolve: configs.resolve,
    // 当只有发生错误时打印webpack统计信息
    // stats: 'errors-only',
    // 优化项
    optimization: {
        // 分割js代码块,目的是进行颗粒度更细的打包,将相同的模块提取出来打包这样可以减小包的体积(以前用CommonsChunkPlugin)
        // 1.基础类库：react，react-redux，react-router等等
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
                vendors: {
                    name: "vendors",
                    test: /[\\/]node_modules[\\/]/,
                    chunks: "initial",
                    priority: 1,
                    // 默认true时，该组复用引用的其他chunk，false时则不会复用而是重新创建一个新chunk
                    reuseExistingChunk: false,
                },
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
            })
        ],
    },
};
// (构建过程优化)实例化一个速度分析对象(它的wrap方法用来包裹webpack配置)
const smp = new SpeedMeasureWebpackPlugin();
module.exports = smp.wrap(webpackConfig);
