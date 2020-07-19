import Loader from "./loader";

let container;
// 实例化容器
const getContainer = (props) => {
    // 保证只有一个容器
    if (!container) {
        container = Loader.showInstance(props);
    }
    return container;
};

export default {
    init: (props) => {
        const instance = getContainer(props);
        instance.init(props)
    },
    start: (props) => {
        const instance = getContainer(props);
        instance.start(props)
    },
    end: (props) => {
        const instance = getContainer(props);
        instance.end(props)
    }
}