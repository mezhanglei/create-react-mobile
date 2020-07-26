import React, { Component } from 'react';
import { Button } from 'antd';
// import PropTypes from 'prop-types';


/**
 * 验证码倒计时组件：
 * 参数： isSend：用来控制是否启用倒计时,(单向流动)
 *        count: 用来控制每次倒计时的总数，单位秒
 *        handle：funtion() {}, 点击验证码按钮的触发事件，可在此更改isSend的值
 */
class SendVerifyCode extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // true为正在倒计时，false为结束倒计时
            counting: false
        };
    }

    static defaultProps = {
        // 是否开启倒计时，true开启，false关闭
        isSend: false,
        // 倒计时的总数
        count: 5
    }

    componentWillUnmount() {
        this.clear();
    }

    componentDidMount() {
        this.send(this.props.isSend);
    }

    componentWillReceiveProps(nextProps) {
        //根据父组件传过来的验证结果，判断是否启用倒计时
        this.send(nextProps.isSend);
    }

    // 设置定时器
    setTime = () => {
        this.timer = setInterval(this.countDown, 1000);
    }

    // 计数
    countDown = () => {
        const { count } = this.state;
        if (count <= 1) {
            this.clear();
            this.setState({ counting: false });
        } else {
            this.setState({ counting: true, count: count - 1 });
        }
    }

    // 定时器
    clear = () => {
        clearInterval(this.timer);
    }

    // 发送验证码，并启动倒计时
    send = (isSend) => {
        if (isSend) {
            this.setState({ counting: true, count: this.props.count });
            this.setTime();
        }
    }

    // 点击按钮时的执行方法
    handle = () => {
        this.props.handle && this.props.handle();
    }
    render() {
        let { count, counting } = this.state;
        return (
            <Button
                disabled={counting}
                onClick={this.handle}
            >{counting ? `${count}秒后重发` : '获取验证码'}</Button>
        );

    }
}

// SendVerifyCode.propTypes = {
//     isSend: PropTypes.bool.isRequired,
//     onhandlePhone: PropTypes.func.isRequired,
//     onSuccessSend: PropTypes.func.isRequired
// }

export default SendVerifyCode;
