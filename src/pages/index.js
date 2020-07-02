// 在多页面中需要全局引入的文件可以放在这里(非npm包引入在配置文件中配置路径)

import VConsole from 'vconsole';
if(process.env.NODE_ENV === 'development'){
    new VConsole();
}

