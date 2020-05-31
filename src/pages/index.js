// 在多页面中需要全局引入的文件可以放在这里

import VConsole from 'vconsole';
const isDev = process.env.NODE_ENV.includes('dev');
if (isDev) new VConsole();

