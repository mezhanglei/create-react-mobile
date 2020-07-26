import styles from './result-mobile.less';
import React from "react";
import { isEmpty } from "@/utils/type";

/**
 * 移动端notFound页面
 * 高度固定为屏幕高度
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
        text: ""
    }

    render() {
        const { imgUrl, title, text } = this.props;
        return (
            <div className={styles['page-result']}>
                <div className={styles["page-result"]}>
                    <div className={styles['page-image']} style={{ backgroundImage: `url(${imgUrl})` }}>
                    </div>
                    {!isEmpty(title) && <div className={styles['main-title']}>{title}</div>}
                    {!isEmpty(text) && <div className={styles['second-text']}>{text}</div>}
                </div>
            </div>
        );
    }
}
