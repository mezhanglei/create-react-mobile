// 在多页面中需要全局引入的文件可以放在这里(非npm包引入在配置文件中配置路径)

// 只在开发环境中引入vconsole
if (process.env.NODE_ENV === 'development') {
    import("vconsole").then(module => {
        const Vconsole = module.default
        new Vconsole();
    })
}

