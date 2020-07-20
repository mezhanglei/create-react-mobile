
import styles from "./loader.less";

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

    // 初始化加载条
    init() {
        this.content.style.transform = `translate3d(${-100}%,0,0)`;
        this.box.style.opacity = '1';
        clearInterval(this.steps);
    }

    // 开始加载
    start() {
        this.init();
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
        this.init();
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
        const { height, bgColor } = this.props;
        return (
            <div ref={node => this.box = node} className={styles["loader-fixed"]} style={{ height: height + 'px' }}>
                <span ref={node => this.content = node} className={styles["steps"]} style={{ backgroundColor: bgColor }}></span>
            </div>
        );
    }
}


// 静态方法
Loader.showInstance = function (props) {
    let div = document.createElement('div');
    document.body.appendChild(div);

    // 实例化容器并利用闭包存储
    const instance = ReactDOM.render(<Loader {...props} />, div);
    return {
        init() {
            if (instance) {
                instance.init();
            }

        },
        start() {
            if (instance) {
                instance.start();
            }
        },
        end() {
            if (instance) {
                instance.end();
            }
        },
        destory() {
            // 销毁指定容器(DOM)的所有react节点
            ReactDOM.unmountComponentAtNode(div);
            // 从dom树移除节点
            document.body.removeChild(div);
        }
    };
};

export default Loader;
