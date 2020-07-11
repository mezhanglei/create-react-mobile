
import React, { useEffect } from 'react';
import styles from './row.less';

/**
 * 步骤条组件(横向)
 * 必填参数
 *    data：可以采取固定格式 [{
 *            middle: // 中间节点
 *            top:  // 上边节点
 *            bottom: // 下边节点
 *            }]
 *        也可以不用转换格式通过renderTop,renderBottom,renderMiddle自定义节点
 *  非必填参数:
 *    currentStatus： 当前点的状态，参考代码里面定义的映射关系
 *    currentIndex：当前进行的步骤的状态，默认第一位
 *    stop: 默认false，表示是否终止步骤条进行流转
 *    length: 具体数字或空 | flex  flex表示弹性布局，所有步骤均分父元素长度  具体数字或空则每个步骤有固定的长度
 *    renderTop: 类型function(item,index) | 数字或字符串 所有上边节点自定义（优先级最高）
 *    renderBottom: 类型function(item,index) | 数字或字符串 所有下边节点自定义（优先级最高）
 *    renderMiddle: 类型function(item,index) | 数字或字符串 所有中间节点自定义（优先级最高）
 */
export default class MySteps extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    // 默认的props参数
    static defaultProps = {
        // 当前正在进行的步骤在数组中的序号
        currentIndex: 3,
        // 当前正在进行的步骤的状态
        currentStatus: 'normal',
        // 是否终止, true时, 所有的点和线都不会高亮
        stop: false,
        // 具体数字或空 | flex  flex表示弹性布局，所有步骤均分父元素长度  具体数字或空则每个步骤有固定的长度
        length: '',
        // 步骤条的渲染数组
        data: [{
            top: '上区域1',
            middle: '1',
            bottom: '下区域'
        }, {
            top: '上区域2',
            middle: '2',
            bottom: '下区域'
        }, {
            top: '上区域3',
            middle: '3',
            bottom: '下区域'
        }, {
            top: '上区域4',
            middle: '4',
            bottom: '下区域'
        }, {
            top: '上区域5',
            middle: '5',
            bottom: '下区域'
        }],
        // 当前点的状态对应的自定义数组(可以自己添加状态对应的自定义内容)
        defineStatus: {
            wait: { // 等待状态
                middleColor: '#6057ee', // 已经过的中间节点颜色
                topColor: '', // 已经过的节点上边的颜色
                bottomColor: '', // 已经过的节点下边的颜色
                lineColor: '#6057ee', // 已经过的线的颜色
                nextLineColor: '', // 当前点下一步的线条颜色
                nextDahsed: true // 当前点下一步是否是dash线条样式
            },
            ok: { // 完成状态
                middleColor: '#6057ee',
                topColor: '',
                bottomColor: '',
                lineColor: '#6057ee',
                nextLineColor: '',
                nextDashed: true
            },
            normal: { // 普通状态
                middleColor: '#6057ee',
                topColor: '',
                bottomColor: '',
                lineColor: '#6057ee',
                nextLineColor: '',
                nextDashed: false
            }
        }
    }

    componentDidMount() {
    }

    // 中间节点上方
    topElement = (item, index) => {
        const { defineStatus, currentIndex, currentStatus, stop, renderTop } = this.props;
        // 点的状态信息
        const statusData = currentStatus ? defineStatus[currentStatus] : {};
        // 上方元素
        const propsTop = typeof renderTop == 'function' ? renderTop(item, index) : renderTop;
        const top = propsTop || item.top;
        // 默认颜色
        const lowColor = '#ccc';
        // 选中颜色
        const topColor = statusData.topColor || lowColor;
        // 当前颜色
        const currentColor = stop ? lowColor : (currentIndex >= index ? topColor : lowColor);
        return (
            <div style={{ color: currentColor }} className={styles['step-top-part']}>{top}</div>
        );
    }

    // 中间节点
    middleElement = (item, index) => {
        const { defineStatus, currentIndex, currentStatus, stop, renderMiddle } = this.props;
        // 点的状态信息
        const statusData = currentStatus ? defineStatus[currentStatus] : {};
        // 中间节点
        const propsMiddle = typeof renderMiddle == 'function' ? renderMiddle(item, index) : renderMiddle;
        const middle = propsMiddle || item.middle;
        // 默认颜色
        const lowColor = '#ccc';
        // 选中颜色
        const middleColor = statusData.middleColor || lowColor;
        // 当前颜色
        const currentColor = stop ? lowColor : (currentIndex >= index ? middleColor : lowColor);
        return (
            <React.Fragment>
                {middle && <div style={{ color: currentColor }} className={styles['step-middle-part']}>{middle}</div>}
                {!middle && <div style={{ background: currentColor, color: currentColor }} className={currentIndex >= index ? styles['big-circle'] : styles['small-circle']}></div>}
            </React.Fragment>
        );
    }

    // 节点下方组件
    bottomElement = (item, index) => {
        const { defineStatus, currentIndex, currentStatus, stop, renderBottom } = this.props;
        // 点的状态信息
        const statusData = currentStatus ? defineStatus[currentStatus] : {};
        // 下方元素
        const propsBottom = typeof renderBottom == 'function' ? renderBottom(item, index) : renderBottom;
        const bottom = propsBottom || item.bottom;
        // 默认颜色
        const lowColor = '#ccc';
        // 选中颜色
        const bottomColor = statusData.bottomColor || lowColor;
        // 当前颜色
        const currentColor = stop ? lowColor : (currentIndex >= index ? bottomColor : lowColor);
        return (
            <React.Fragment>
                <div style={{ color: currentColor }} className={styles['bottom-content']}>{bottom}</div>
            </React.Fragment>
        );
    }

    // 连接线样式
    lineElement = (item, index) => {
        const { defineStatus, currentIndex, currentStatus, stop, length } = this.props;
        // 点的状态信息
        const statusData = currentStatus ? defineStatus[currentStatus] : {};
        // 默认颜色
        const lowColor = '#ccc';
        // 选中颜色
        const lineColor = statusData.lineColor || lowColor;
        // 当前颜色
        const currentColor = stop ? lowColor : (currentIndex > index ? lineColor : (currentIndex == index ? (statusData.nextLineColor || lowColor) : lowColor));
        return (
            <React.Fragment>
                {<div style={{ borderColor: currentColor, minWidth: length ? length : 100 }} className={currentIndex > index ? styles['line-solid'] : (currentIndex === index && statusData.nextDashed ? styles['line-dashed'] : styles['line-solid'])}></div>}
            </React.Fragment>
        );
    };

    render() {
        const { data = [], length } = this.props;
        return (
            <div className={styles['step-box']}>
                {
                    data.map((item, index) => {
                        return (
                            <div key={index} className={length == 'flex' ? `${styles['step-item']} ${styles['flex-item']}` : styles['step-item']}>
                                <div className={styles['top-content']}>
                                    {this.topElement(item, index)}
                                    <div className={styles['step-middle']}>
                                        {this.middleElement(item, index)}
                                        {index < data.length - 1 && this.lineElement(item, index)}
                                    </div>
                                </div>
                                {this.bottomElement(item, index)}
                            </div>
                        );
                    })
                }
            </div>
        );
    }
}