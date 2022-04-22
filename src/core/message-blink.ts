/**
 * 闪烁消息
 * 使用:
 *   启动：message.showMessage(msg)
 *   停止: message.stopMessage()
 */
 export const message = {
  timeout: null,
  oldTitle: document.title,
  time: 0,
  // 开始闪烁消息
  showMessage(msg: string) {
    message.timeout = setInterval(function () {
      message.time++;
      let title = '';
      if (message.time % 2 === 0) {
        title = '固定标题';
      } else {
        title = msg;
      }
      document.title = title;
    }, 600);

  },
  // 停止闪烁消息
  stopMessage() {
    document.title = message.oldTitle;
    clearTimeout(message.timeout);
  }
};