import { message } from "antd";
import zhCN from 'antd/lib/locale/zh_CN';
import 'moment/locale/zh-cn';
import moment from 'moment';

export default {
    locale: zhCN,
    getPopupContainer: (node) => {
        if (node) {
            return node.parentNode;
        }
        return document.body;
    }
};

// 消息管理
message.config({
    maxCount: 1,
});

// 修改moment配置，注意请修改你正在使用的 locale 语言，比如 zh-cn
moment.locale('zh-cn', {
    week: {
        dow: 7 // sunday is the first day of the week.
    },
    weekdaysMin: ['日', '一', '二', '三', '四', '五', '六']
});
