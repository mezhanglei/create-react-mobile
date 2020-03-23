'use strict';

// glob用来动态扫描目标文件
// 例如glob.sync(path.join(__dirname, './src/*/index.js'))扫描该路径返回符合要求的文件路径数组
// 匹配规则: 1. * 在单个路径中间匹配一个目录/文件, /* 则表示一个或多个子目录/文件 2. ** 在单个路径中间匹配部分0个或多个目录/文件
const glob = require('glob');
// 引入webpack
const webpack = require('webpack');
// 1. path.join('字段1','字段2'....) 使用平台特定的分隔符把所有的片段链接生成相对路径,遇到..和../时会进行相对路径计算
// 2. path.resolve('字段1','字段2'....) 从右到左拼接路径片段,返回一个相对于当前工作目录的绝对路径,当遇到/时表示根路径,遇到../表示上一个目录, 如果还不是完整路径则自动添加当前绝对路径
const path = require('path');
// css文件指纹插件提取css webpack4推荐 在这之前用extracttext 作用是缓存css并解决样式闪动问题 因为只在编译阶段作用 所以不适用于热更新 但在生产环境无需配置热更新也没多大问题
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// css文件压缩
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
// 1.为html文件中引入的外部资源如script、link动态添加每次compile后的hash，防止引用缓存的外部文件问题
// 2.打包时创建html入口文件，比如单页面可以生成一个html文件入口，配置N个html-webpack-plugin可以生成N个页面入口
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 清理项目目录 目的是为了每次打包之前清理掉dist输出文件夹防止最后output的文件增加
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// 对webpack打包的信息进行警告,错误的明显标识提示 可以选择使用或不使用
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
// (构建过程优化)webpack速度分析插件,在package.json中配置命令webpack --progress --config webpack.prod.js --json > stats.json,执行可以得到分析时间结果
const SpeedMeasureWebpackPlugin = require('speed-measure-webpack-plugin');
// (构建过程优化)webpack体积分析插件(会单独打开一个端口8888的页面显示体积构造图)
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
// (构建过程优化)多进程/多实例压缩
const TerserWebpackPlugin = require('terser-webpack-plugin');
// 实现css的treeshaking 将没有用到的css做擦除 需要和MiniCssExtractPlugin配合使用
const PurgecssWebpackPlugin = require('purgecss-webpack-plugin');
// 通过CopyWebpackPlugin将目标文件夹里的静态资源拷贝到目标文件夹(不经过webpack的处理, 但需要手动引入)
const CopyWebpackPlugin = require('copy-webpack-plugin');
// 引入dll预编译webpack文件
const webpackDll = require("./webpack.dll.js");
// 整个项目的根目录
const root = path.join(__dirname);
// 生产环境包的配置
const configs = {
  // 扫描预编译js文件对应的manifest(JSON文件)数组
  manifestPathArr: glob.sync(path.join(webpackDll.output.path, '*.json')),
  // 入口文件路径(暂时只支持单页面打包)
  entryPath: path.join(root, 'src/main/index.js'),
  // 打包文件的输出目录
  outputPath: path.join(root, 'dist'),
  // 用来treeshaking的css文件的路径(/**/* 表示src文件夹下的所有文件)
  cssPath: glob.sync(path.join(root, 'src/**/*'), { nodir: true }),
  // 仅能标签引入的静态资源所在的目录(目录名和在dist引入的目录名相同)
  staticFromPath: path.join(root, 'static'),
  // 仅能标签引入的静态资源被拷贝过去后的目录(目录名和静态资源所在的目录名相同)
  staticToPath: path.join(root, 'dist/static'),
  // 预编译js文件所在的目录(目录名和在dist引入的目录名相同)
  dllFromPath: path.join(root, 'js'),
  // 预编译js文件被拷贝过去后的目录(目录名和静态资源所在的目录名相同)
  dllToPath: path.join(root, 'dist/js'),
  // 引入资源路径的公共部分, 这里将所有打包后的相对路径都替换为绝对路径/.
  publicPath: '/'
}
// webpack配置内容
const webpackConfig = {
  // 入口
  entry: {
    // 1. 如果入口文件为一个对象且有多条数据,则会打包进入多个html文件
    // 2. 如果入口文件为一个对象且只有一条数据(数组或字符串)或者直接为数组/字符串时, 则打包后插入一个html
    // 入口文件路径
    index: [configs.entryPath]
  },
  // 查找解析入口文件entry所在的根目录文件夹, 默认为项目的根目录
  context: root,
  // 输出(默认只能打包js文件,如果需要打包其他文件,需要借助相对应的loader)
  output: {
    path: configs.outputPath,
    // chunkhash 基于entery生成hash值 一个文件改动不会影响另一个
    // contenthash 通过MiniCssExtractPlugin提供 基于css文件内容生成 css内容不会影响js文件的hash值生成
    // hash是基于项目 只要项目内容改变就会影响hash值,一般用于开发环境
    // hash值的用处是当改变时浏览器则不会再使用该缓存
    filename: 'js/[name]_[chunkhash:8].js',
    // chunkFilename用来打包require.ensure方法中引入的模块,如果该方法中没有引入任何模块则不会生成任何chunk块文件
    // chunkFilename: 'js/[name]_[chunkhash:8].js',
    // 引入资源路径的公共部分, 这里将所有打包后的相对路径都替换为绝对路径/.
    publicPath: configs.publicPath
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
  mode: 'production',
  // 用来指定loaders的匹配规则和指定使用的loaders名称
  module: {
    rules: [
      {
        test: /\.js$/,
        // 指定必须处理的文件
        // include: ,
        // 忽略第三方
        exclude: /node_modules/,
        use: [
          {
            // 多进程打包,必须放在处理js的loader之前
            loader: 'thread-loader',
            options: {
              workers: 3
            }
          },
          // ?后面表示开启babel-loader缓存的参数
          'babel-loader?cacheDirectory=true'
        ]
      },
      {
        test: /\.css$/,
        // 这里需要遵循一定的顺序 因为是compose函数方式先解析数组后面的css-loader然后插入到style-loader
        use: [
          // 不能和style-loader一起使用,会互斥
          // 把 js 中 import 导入的样式文件代码，打包成一个实际的 css 文件，结合 html-webpack-plugin，在 dist/index.html 中以 link 插入 css 文件；默认将 js 中 import 的多个 css 文件，打包时合成一个
          MiniCssExtractPlugin.loader,
          // style-loader 把 js 中 import 导入的样式文件代码，打包到 js 文件中，运行 js 文件时，将样式自动插入到<style>标签中
          // 'style-loader',
          // css-loader解析几个css之间的关系 最终把几个css文件打包成一个css文件
          'css-loader'
        ]
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          // 'style-loader',
          'css-loader',
          {
            // 需放到less-loader前面
            loader: 'px2rem-loader',
            options: {
              // 1rem等于多少px
              remUnit: 37.5,
              // 小数点位数
              remPrecision: 8
            }
          },
          'less-loader',
          // 提供一种用js来处理css方法 抽象成语法树结构一般不单独使用 autoprefixer用来自动添加前缀 建议放在cssloader之后也就是执行在前 然后在postcss.config.js引入 在package.json里设置borowserslist选项来设置浏览器兼容版本
          'postcss-loader'
        ]
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          // 'style-loader',
          'css-loader',
          {
            // 需放到sass-loader前面
            loader: 'px2rem-loader',
            options: {
              // 1rem等于多少px
              remUnit: 37.5,
              // 小数点位数
              remPrecision: 8
            }
          },
          'sass-loader',
          // 提供一种用js来处理css方法 抽象成语法树结构一般不单独使用
          // 1. 在postcss.config.js导出autoprefixer用来自动添加前缀,在cssloader之后执行
          // 2. 然后在package.json里设置borowserslist选项来设置浏览器兼容版本
          'postcss-loader'
        ]
      },
      // 使用url-loader也可以进行图片和字体的打包 并且可以设置一定大小以下的图片转换成base64编码
      {
        test: /\.(png|svg|jpg|gif|jpeg|ico)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              // 单位字节
              limit: 2000,
              // 图片和字体都使用hash值
              name: 'img/[name]_[hash:8].[ext]'
            }
          },
          {
            loader: 'image-webpack-loader',
            // 配置选项(图片优化器)
            options: {
              // mozjpeg压缩jpeg
              mozjpeg: {
                progressive: true,
                quality: 65
              },
              // 不通过optipng压缩png
              optipng: {
                enabled: false,
              },
              // 通过pngquant压缩png
              pngquant: {
                quality: [0.65, 0.90],
                speed: 4
              },
              // gif默认不隔行扫描(即图像是先模糊再清晰)
              gifsicle: {
                interlaced: false,
              },
              // 将JPG和PNG图像压缩为WEBP
              webp: {
                quality: 75
              }
            }
          }
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              // 图片和字体都使用hash值
              name: 'font/[name]_[hash:8].[ext]'
            }
          }
        ]
      }
    ]
  },
  // 插件
  plugins: [
    // css文件指纹 使用contenthash 只要css文件不变则contenthash不变
    new MiniCssExtractPlugin({
      filename: 'css/[name]_[contenthash:8].css'
    }),
    // css实现treeshaking(删除无用的css) 需要和MiniCssExtractPlugin配合使用
    new PurgecssWebpackPlugin({
      paths: configs.cssPath
    }),
    // css文件压缩(只会对解析后的css文件进行压缩)
    new OptimizeCSSAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      // 依赖于cssnano预处理器 但cssnano和css-loader都会将scale3d(1,1,1)转换为scalex(1) 可以通过js来设置style规避问题
      cssProcessor: require('cssnano'),
      // 避免cssnano重新计算css
      cssProcessorOptions: {
        safe: true
      }
    }),
    // 清理dsit目录
    new CleanWebpackPlugin(),
    // 统计信息提示插件(比如错误或者警告会用带颜色的字体来显示,更加友好)
    new FriendlyErrorsWebpackPlugin(),
    // webpack体积分析插件使用
    // new BundleAnalyzerPlugin(),
    // webpack从manifest文件中读取到已预编译的文件, 然后忽略对其的编辑打包(这里循环是为了当有多个dll文件时进行循环操作)
    ...configs.manifestPathArr.map(path => {
      return new webpack.DllReferencePlugin({
        // 上下文环境路径(与dllplugin在同一目录)
        context: root,
        manifest: require(path)
      });
    }),
    // 静态资源拷贝到dist目录, 现在我们定义静态资源目录为lib/static,然后在html里需要再引入才能使用
    new CopyWebpackPlugin([
      {
        from: configs.staticFromPath,
        to: configs.staticToPath
        // 忽略文件名
        // ignore: ['.*']
      }, {
        from: configs.dllFromPath,
        to: configs.dllToPath
        // 忽略文件名
        // ignore: ['.*']
      }
    ]),
    new HtmlWebpackPlugin({
      // html模板所在的位置(一般需要设置个指定文件夹,这里设置为任意一个文件夹)
      template: path.join(root, 'src/main/index.html'),
      // 指定输出的模板html名称(一般为index.html,这里是用html模板所在的文件夹名)
      filename: 'index.html',
      // 解决多入口文件时打包后输出的html指定要引用哪些js文件(这些是打包过程中产生的js文件)
      chunks: ['vendors', 'commons', 'index'],
      // body：script标签位于html文件的 body 底部（同 true）
      inject: true,
      minify: {
        // 根据html5规范输入 默认true
        html5: true,
        // 是否对大小写敏感 默认false
        caseSensitive: false,
        // 删除空格换行 默认false
        collapseWhitespace: true,
        // 当标记之间的空格包含换行符时，始终折叠为1换行符（从不完全删除它）。必须与collapseWhitespace一起使用 默认false
        preserveLineBreaks: false,
        // 压缩一开始就内联的css文件 默认false
        minifyCSS: true,
        // 压缩一开始就内联的js文件 默认false
        minifyJS: true,
        // 移除html中的注释 默认false
        removeComments: true
      }
    }),
    // 设置项目的全局变量, 如果值是个字符串会被当成一个代码片段来使用, 如果不是,它会被转化为字符串(包括函数)
    new webpack.DefinePlugin({
      "process.env.PUBLIC_PATH": JSON.stringify(configs.publicPath)
    })
  ],
  // require 引用入口配置
  resolve: {
    alias: {
      src: `${root}/src/`
    }
  },
  // 当只有发生错误时打印webpack统计信息
  // stats: 'errors-only',
  // 一些优化
  optimization: {
    // 分割js代码块,目的是进行颗粒度更细的打包,将相同的模块提取出来打包这样可以减小包的体积(以前用CommonsChunkPlugin)
    // 1.基础类库：react，react-redux，react-router等等
    // 2.UI库：antd，antd-icons
    // 3.公共组件库：自定义的公共组件
    // 4.其他业务代码(react和vue提供了分包策略,不需要这个)
    splitChunks: {
      // 最小提取文件大小为0kb
      minSize: 0,
      // 配置规则(里面选项自定义, 默认选项有vendors基础资源包和default输出资源包)
      cacheGroups: {
        // 将基础资源包打包在一个文件(默认选项)
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          chunks: "all",
          priority: 1
        },
        // 将至少引入两次及以上的打包在一个文件
        commons: {
          // 同时分割同步和异步代码
          chunks: 'all',
          // 公共包引入的最低次数
          minChunks: 2,
          // 提取的优先级顺序 一般基础包先提取 基础包提取完后再进行commons的提取 防止提取的区域重合
          priority: 0
        }
      }
    },
    // (构建过程)多进程多实例并行压缩,(以前使用uglifyjs-webpack-plugin)
    minimizer: [
      new TerserWebpackPlugin({
        // true开启多进程
        parallel: true,
        // 开启压缩缓存
        cache: true
      })
    ]
  }
}
// (构建过程优化)实例化一个速度分析对象(它的wrap方法用来包裹webpack配置)
const smp = new SpeedMeasureWebpackPlugin();
module.exports = smp.wrap(webpackConfig);