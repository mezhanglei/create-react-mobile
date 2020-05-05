import Notification from './notification.js';

/**
 * Toast组件核心就是将Notification容器中的方法暴露出来
 */

let newNotification;

// 获得一个Notification
const getNewNotification = () => {
  // 保证只有一个容器
  if (!newNotification) {
    newNotification = Notification.reWrite();
  }
  return newNotification;
};

// 调用notification里的方法增加notice组件
const renderNotice = (type, content, duration, onClose) => {
  let notificationInstance = getNewNotification();
  notificationInstance.notice({
    type,
    content,
    duration,
    onClose: function () {
      if (onClose) {
        onClose();
      }
    }
  });
};

export default {
  // 默认位置在页面上方
  info: (content, duration, onClose) => (renderNotice('info', content, duration, onClose)),
  // 默认位置在页面右半部分中间
  right: (content, duration, onClose) => (renderNotice('right', content, duration, onClose)),
  // 默认位置在页面左半部分中间
  left: (content, duration, onClose) => (renderNotice('left', content, duration, onClose)),
  // 默认位置在页面正中间
  center: (content, duration, onClose) => (renderNotice('center', content, duration, onClose)),
  // 销毁
  hide() {
    if (newNotification) {
      newNotification.destory();
      newNotification = null;
    }
  }
}