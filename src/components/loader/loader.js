
import "./loader.less";

class Loader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    static defaultProps = {
        // 背景颜色
        bgColor: "blue",
        // 加载条高度
        height: 3
    }

    // 重置
    reset() {
        this.content.style.transform = `translate3d(${-100}%,0,0)`;
        this.box.style.opacity = '1';
        clearInterval(this.steps);
    }

    // 开始加载
    start() {
        this.reset();
        let that = this;
        let step = 1;
        that.steps = setInterval(() => {
            if (step >= 95) {
                clearInterval(that.steps);
            }
            step++;
            that.content.style.transform = `translate3d(${-100 + step}%,0,0)`;
        }, 100);
    }

    // 结束加载
    end() {
        this.reset();
        let that = this;
        clearInterval(that.steps);
        that.content.style.transform = `translate3d(${-100 + 100}%,0,0)`;
        // 动画完成后隐藏外围容器
        let finishTimeout = setTimeout(() => {
            that.box.style.opacity = '0';
            that.box.style.transition = 'transform .4s ease 0s';
            clearTimeout(finishTimeout);
        }, 300);
    }

    render() {
        // 通过createPortal可以将组件挂载到父组件以外的任意节点
        return ReactDOM.createPortal(
            this.renderLoader(),
            document.body,
        );
    }

    renderLoader() {
        const { height, bgColor } = this.props;
        return (
            <div ref={node => this.box = node} className="loader-fixed" style={{ height: height + 'px' }}>
                <span ref={node => this.content = node} className="steps" style={{ backgroundColor: bgColor }}></span>
            </div>
        );
    }
}

export default function showInstance(props) {
    let div = document.createElement('div');
    document.body.appendChild(div);

    let instance = ReactDOM.render(<Loader {...props} />, div);

    // 开始
    const start = () => {
        instance && instance.start();
    };

    // 结束
    const end = () => {
        instance && instance.end();
    };

    // 销毁
    const destroy = () => {
        // 销毁节点并移除插入节点
        const unmountResult = ReactDOM.unmountComponentAtNode(div);
        if (unmountResult && div.parentNode) {
            div.parentNode.removeChild(div);
        }
    };

    return { start, end, destroy };
}
