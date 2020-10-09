import * as React from "react";
import * as ReactDOM from "react-dom";
import { DarkColors, LightColors } from "./DefaultColors";
import styles from "./ToastsContainer.less";
import classNames from 'classnames';

// toast的位置
const ToastsPosition = {
    BOTTOM_CENTER: "bottom_center",
    BOTTOM_LEFT: "bottom_left",
    BOTTOM_RIGHT: "bottom_right",
    TOP_CENTER: "top_center",
    MIDDLE_CENTER: "middle_center",
    TOP_LEFT: "top_left",
    TOP_RIGHT: "top_right",
};

// toast容器组件
class ToastsContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // 样式
            styles: {},
            // toast池
            toasts: []
        };
        this.deleteList = [];
    }

    static defaultProps = {
        prefixCls: "mine-toast",
        position: ToastsPosition.MIDDLE_CENTER,
        timer: 3000,
        lightBackground: false,
        className: ""
    }

    componentDidMount() {
        this.getPosition();
    }

    componentWillUnmount() {
        this.clearTime();
    }

    // 根据传入的position参数决定位置
    getPosition = () => {
        const styles = {};
        switch (this.props.position) {
            case ToastsPosition.TOP_LEFT:
                styles.top = 10;
                styles.left = 10;
                break;
            case ToastsPosition.TOP_RIGHT:
                styles.top = 10;
                styles.right = 10;
                break;
            case ToastsPosition.TOP_CENTER:
                styles.top = 10;
                styles.left = "50%";
                styles.transform = "translateX(-50%)";
                break;
            case ToastsPosition.MIDDLE_CENTER:
                styles.top = '50%';
                styles.left = "50%";
                styles.transform = "translateX(-50%) translateY(-50%)";
                break;
            case ToastsPosition.BOTTOM_LEFT:
                styles.bottom = 10;
                styles.left = 10;
                break;
            case ToastsPosition.BOTTOM_RIGHT:
                styles.bottom = 10;
                styles.right = 10;
                break;
            case ToastsPosition.BOTTOM_CENTER:
                styles.bottom = 10;
                styles.left = "50%";
                styles.transform = "translateX(-50%)";
                break;
            default:
                styles.bottom = 10;
                styles.right = 10;
                break;
        }
        this.setState({ styles });
    }

    // 添加toast事件
    AddToast = async () => {
        await this.clear();
        // 添加一个toast
        const toast = { ...this.props, id: Math.random() };
        this.setState({ toasts: [toast].concat(this.state.toasts) });
        // 一段时间后删除该toast
        this.deleteList.push(setTimeout(() => {
            this.setState({ toasts: this.state.toasts.filter((t) => t.id !== toast.id) });
        }, this.props.timer));
    }

    // 清空定时器
    clearTime = () => {
        this.deleteList.forEach(clearTimeout);
    }

    // 清空Toast事件
    clear = () => {
        this.setState({
            toasts: []
        });
    }

    render() {
        // 通过createPortal可以将组件挂载到父组件以外的任意节点
        return ReactDOM.createPortal(
            this._renderContainer(),
            document.body,
        );
    }

    getToastCls = (toast) => {
        const baseCls = `${this.props.prefixCls}-child`;
        const toastClass = classNames(styles[baseCls], toast.className, {
            [styles[`${baseCls}-${toast.status}`]]: toast.status
        });
        return toastClass;
    }

    _renderContainer() {
        const { className, prefixCls } = this.props;

        const style = this.props.lightBackground ? LightColors : DarkColors;

        const groupClass = classNames(styles[prefixCls], className);

        return (
            <div style={this.state.styles} className={groupClass}>
                {
                    this.state.toasts.map((toast) => {
                        return (
                            <div key={toast.id}
                                className={this.getToastCls(toast)}
                                style={style[toast.status]}>
                                {toast.message}
                            </div>
                        );
                    })
                }
            </div>
        );
    }
}

export default function showInstance(props) {
    let div = document.createElement('div');
    document.body.appendChild(div);

    // 实例化容器并利用闭包存储
    const instance = ReactDOM.render(<ToastsContainer {...props} />, div);

    // 展示
    const show = () => {
        instance && instance.AddToast();
    };

    // 清空
    const clear = () => {
        instance && instance.clear();
    };

    // 销毁
    const destroy = () => {
        // 销毁节点并移除插入节点
        const unmountResult = ReactDOM.unmountComponentAtNode(div);
        if (unmountResult && div.parentNode) {
            div.parentNode.removeChild(div);
        }
    };

    return { show, clear, destroy };
};
