
import "./top.less";


/**
 * 回到顶部组件
 * 参数：scrollDom：默认为body，也可以指定目标Dom，作为滚动的根节点，但需要设置overflow:auto
 */
export default class ToTop extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // 是否展示
            isShow: false
        };
    }

    static defaultProps = {
        scrollDom: document.body // 滚动的根节点，默认为body
    }

    componentDidMount() {
        this.init();
    }

    componentDidUpdate(preProps) {
        // 异步更新的字段
        const changeProps = ["scrollDom"];
        changeProps.map(item => {
            if (preProps[item]?.toString() != this.props[item]?.toString()) {
                this.init();
            }
        });
    }

    componentWillUnmount() {
        const { scrollDom } = this.props;
        if (scrollDom) {
            scrollDom.removeEventListener("scroll", this.scrollChange);
        }
        clearInterval(this.timer);
    }

    // 返回顶点
    returnTop = () => {
        const { scrollDom } = this.props;
        this.timer = setInterval(() => {
            if (scrollDom) {
                let topInstance = scrollDom.scrollTop;
                let speed = Math.ceil(topInstance / 5);
                scrollDom.scrollTop = topInstance - speed;
                if (topInstance <= 0) {
                    clearInterval(this.timer);
                }
            }
        }, 20);
    }

    // 监听滚动的根节点
    init() {
        // 滚动节点
        const { scrollDom } = this.props;
        if (scrollDom) {
            // 只有目标设置为auto才能监听滚动
            scrollDom.style.overflowY = "auto";
            scrollDom.addEventListener("scroll", this.scrollChange, false);
        }
    }

    // 页面滚动过程中
    scrollChange = () => {
        const { scrollDom } = this.props;
        if (scrollDom.scrollTop > 100) {
            this.setState({
                isShow: true
            });
        } else if (scrollDom.scrollTop < 100) {
            this.setState({
                isShow: false
            });
        }
    }

    render() {
        const { isShow } = this.state;
        return (
            isShow &&
            <div className="page-component-up-top" onClick={this.returnTop}>
                <img className="top_icon" src={require("static/images/top.png")} />
            </div>
        );
    }
}
