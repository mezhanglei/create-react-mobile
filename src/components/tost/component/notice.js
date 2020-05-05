import React from 'react';
import './notice.less';

/**
 * Notice是最底层的组件 用来展示内容和样式 显示和隐藏受到父组件的严格控制
 */
class Notice extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // 是否开启或关闭动画
      shouldClose: false
    };
  };

  componentDidCatch() {
    let { duration } = this.state;
    duration = duration || 3000;
    // 如果持续时间大于0 则开始定时器延迟隐藏组件
    if (duration > 0) {
      this.closeTimer = setTimeout(() => {
        this.close();
        // 减掉动画的300毫秒
      }, duration - 300);
    }
  };

  componentWillUnmount() {
    // 当意外关闭组件时
    this.clearCloseTimer();
  };

  // 清除定时器
  clearCloseTimer() {
    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
      this.closeTimer = null;
    }
  };

  // 关闭组件 如果有回调则执行回调
  close() {
    // 清除定时器
    this.clearCloseTimer();
    // 开启动画
    this.setState({
      shouldClose: true
    });

    //等待动画结束 执行回调
    this.timer = setTimeout(() => {
      if (this.props.onClose) {
        this.props.onClose();
      }
      clearTimeout(this.timer);
    }, 300);
  };

  render() {
    const {shouldClose} = this.state;
    let {prefixCls, type, content} = this.props;
    prefixCls = prefixCls || 'notice-prefix';
    type = type || 'info';
    return (
      <div className={shouldClose ? `${prefixCls}-${type} ${prefixCls}-transition` : `${prefixCls}-${type}`}>
        <span className={`${prefixCls}-content`}>{content}</span>
      </div>
    );
  }
}

// 传值的类型检查(需要安装prop-types插件)
// Notice.propTypes = {
//   // 数字类型的props
//   duration: PropTypes.number,
//   // 前缀字符串类型
//   prefixCls: PropTypes.string,
//   // 接受指定的字符串
//   type: PropTypes.oneOf(['info', 'right', 'left', 'center']),
//   // 内容
//   content: PropTypes.any,
//   // 回调函数
//   onClose: PropTypes.func
// }

//默认的props的值
// Notice.defaultProps = {
//   prefixCls: 'notice-prefix',
//   type: 'info',
//   duration: 3000,
//   onClose: undefined
// }
export default Notice;