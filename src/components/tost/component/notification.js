import React from 'react';
import ReactDOM from 'react-dom';
import Notice from './notice.js';

/**
 * notice组件的容器 用于保存页面中添加的notice组件,并提供notice组件的添加和移除的实例方法
 * 和js操作组件实例化的重写方法
 */
// 一个notice计数 用于生成唯一id
let noticeNumber = 0;
// 生成唯一id
const getUuid = () => {
    return 'notification-' + new Date().getTime() + '-' + noticeNumber++;
};

class Notification extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // 存储添加进来的notice
            notices: []
        };
    };

    // 添加一个notice组件
    add(notice) {
        let { notices } = this.state;
        // 不重复的key
        let key = notice.key ? notice.key : notice.key = getUuid();
        // 如果有重复的key则返回过滤之后的数组
        let temp = notices.filter((item, index) => {
            return item.key === key;
        });
        // 不存在重复的则添加
        if (!temp || temp.length < 1) {
            notices.push(notice);
            this.setState({
                notices: notices
            });
        }
    };

    // 根据key移除notice
    remove(key) {
        let { notices } = this.state;
        notices.filter((item, index) => {
            return item.key !== key;
        });
        this.setState({
            notices: arr
        });
    };

    // 依次渲染notices中的notice组件
    getNoticeDOM() {
        let { notices } = this.state;
        let result = [];
        notices.forEach((item, index) => {
            //关闭的回调函数
            let closeCallback = () => {
                this.remove(item.key);
                if (item.onClose) {
                    item.onClose();
                }
            };
            result.push(<Notice key={item.key} {...item} onClose={closeCallback} />);
        });
        return result;
    };

    render() {
        return (
            <div>
                {this.getNoticeDOM()}
            </div>
        );
    }
}

// 用闭包给Notification增加一个静态方法用于js实例化Notification组件
// 在销毁Notice之前多次调用可以保持Notification组件的状态

Notification.reWrite = function (properties) {
    const { ...props } = properties || {};
    //创建插入的根节点
    let div = document.createElement('div');
    document.body.appendChild(div);

    // 闭包存储Notification组件实例 这是一个异步操作
    const notification = async () => {
        // 将notification组件插入到节点从而实例化
        await ReactDOM.render(<Notification {...props} ref={(dom) => this.element = dom} />, div);
        return this.element;
    };

    return {
        notice(noticeProps) {
            notification().then(res => {
                res.add(noticeProps);
            });
        },
        removeNotice(key) {
            notification().then(res => {
                res.remove(noticeProps);
            });
        },
        destroy() {
            // 销毁指定容器(DOM)的所有react节点
            ReactDOM.unmountComponentAtNode(div);
            // 从dom树移除节点
            document.body.removeChild(div);
        }
    };
};
export default Notification;


// KmcDialog.showInstance = function (properties) {
//     if (!document.getElementById('KmcDialog')) {
//         let props = properties || {};
//         let div = document.createElement('div');
//         div.setAttribute('id', 'KmcDialog');
//         document.body.appendChild(div);
//         ReactDOM.render(React.createElement(KmcDialog, props), div);
//     }
// };

// //
// KmcDialog.removeInstance = function () {
//     if (document.getElementById('KmcDialog')) {
//         document.getElementById('KmcDialog').remove();
//     }
// };
