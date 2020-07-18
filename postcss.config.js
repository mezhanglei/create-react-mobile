module.exports = {
    plugins: [
        require('autoprefixer'),
        require("postcss-px-to-viewport")({
            viewportWidth: 375, // 视窗宽度
            unitPrecision: 5, // 转换成视窗单位小数位数
            viewportUnit: 'vw', // 指定需要转换成的视窗单位
            fontViewportUnit: 'vw', // 字体的单位
            selectorBlackList: [], // 指定不转换为视窗单位的类名， 建议定义全局通用的类名
            minPixelValue: 1, // 最小的转换px
            mediaQuery: false, // true允许在媒体查询中转换`px`，现在是不允许
            exclude: [], // 忽略转换的文件
            landscape: false, // 是否添加根据 landscapeWidth 生成的媒体查询条件 @media (orientation: landscape)
            landscapeUnit: 'vw', // 横屏时使用的单位
            landscapeWidth: 1334 // 横屏时使用的视口宽度
        })
    ]
};
