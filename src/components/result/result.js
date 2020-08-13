import styles from './result.less';
import React from "react";
import { isEmpty } from "@/utils/type";

/**
 * 结果页面
 */
export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    static defaultProps = {
        // 图标
        imgUrl: require('static/images/no-data.png'),
        // 加重字体
        title: "暂无数据",
        // 描述性文本
        text: "",
        // 宽(自适应)
        width: "100%",
        // 高(自适应)
        height: "100%"
    }

    render() {
        const { imgUrl, title, text, width, height } = this.props;
        return (
            <div style={{ width: width, height: height }} className={styles['page-result']}>
                <div className={styles["content"]}>
                    <div className={styles['page-image']} style={{ backgroundImage: `url(${imgUrl})` }}>
                    </div>
                    {!isEmpty(title) && <div className={styles['main-title']}>{title}</div>}
                    {!isEmpty(text) && <div className={styles['second-text']}>{text}</div>}
                </div>
            </div>
        );
    }
}
