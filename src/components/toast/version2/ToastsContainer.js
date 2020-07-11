import * as React from "react";
import * as ReactDOM from "react-dom";
import { ToastsStore } from "./utils";
import { DarkColors, LightColors } from "./DefaultColors";
import less from "./ToastsContainer.less";

// toast的位置
const ToastsPosition = {
    BOTTOM_CENTER: "bottom_center",
    BOTTOM_LEFT: "bottom_left",
    BOTTOM_RIGHT: "bottom_right",
    TOP_CENTER: "top_center",
    TOP_LEFT: "top_left",
    TOP_RIGHT: "top_right",
};

// toast组件
export class ToastsContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // 样式
            styles: {},
            // toast池
            toasts: []
        };

        this.storeSubscriptionId = -1;
        this.timeoutArray = [];
    }

    static defaultProps = {
        position: ToastsPosition.TOP_CENTER,
        store: ToastsStore,
        timer: 3000,
        lightBackground: false,
        className: ""
    }

    componentDidMount() {
        // 监听添加事件获取到toast数据，外部触发事件传递数据
        this.storeSubscriptionId = this.props.store.watch((data) => this.AddToast(data));
        this.getPosition();
    }

    componentWillUnmount() {
        this.props.store.unwatch(this.storeSubscriptionId);
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
    AddToast = async (data) => {
        await this.clear();
        // 添加一个toast
        const toast = { ...data, id: Math.random() };
        this.setState({ toasts: [toast].concat(this.state.toasts) });
        // 一段时间后删除该toast
        this.timeoutArray.push(setTimeout(() => {
            this.setState({ toasts: this.state.toasts.filter((t) => t.id !== toast.id) });
        }, data.timer || 3000));
    }

    // 清空定时器
    clearTime = () => {
        this.timeoutArray.forEach(clearTimeout);
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

    _renderContainer() {
        const style = this.props.lightBackground ? LightColors : DarkColors;
        return (
            <div style={this.state.styles} className={less["toasts-container"] + " " + (this.props.className || "")}>
                {
                    this.state.toasts.map((toast) => {
                        return (
                            <div key={toast.id}
                                className={less["toast"] + " " + less["toast-" + toast.status] + " " + toast.classNames}
                                style={style[toast.status]}>
                                {toast.message}
                            </div>
                        );
                    })
                }
            </div>
        );
    }
};
