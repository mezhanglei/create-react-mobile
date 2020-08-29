
import React from 'react';
import styles from './column.less';
import moment from 'moment';

/**
 * 步骤条组件(纵向)
 * 必填参数
 *    data： 可以采取固定格式 [{
 *            middle: // 中间节点
 *            left:  // 左边节点
 *            right: // 右边节点
 *            }]
 * 也可以不用转换格式通过renderLeft,renderRight,renderMiddle自定义节点
 * 非必填参数：
 *     currentStatus： 当前点的状态，参考代码里面定义的映射关系(可以去自定义关系)
 *     currentIndex：当前进行的步骤，默认第一位
 *    stop: 默认false，表示是否终止步骤条进行流转
 *    length: 具体数字或空 | flex  flex表示弹性布局，所有步骤均分父元素长度  具体数字或空则每个步骤有固定的长度
 *    renderLeft: 类型function(item,index) | 数字或字符串 所有左边节点自定义（优先级最高）
 *    renderRight: 类型function(item,index) | 数字或字符串 所有右边节点自定义（优先级最高）
 *    renderMiddle: 类型function(item,index) | 数字或字符串 所有中间节点自定义（优先级最高）
 */
export default class MySteps extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    // 默认的props参数
    static defaultProps = {
        // 当前正在进行的步骤在数组中的序号
        currentIndex: 0,
        // 当前正在进行的步骤的状态
        currentStatus: 'normal',
        // 是否终止, true时, 所有的点和线都不会高亮
        stop: false,
        // 步骤条的渲染数组
        data: [{
            // 中间节点
            middle: '',
            // 节点左边的区域
            left: '',
            // 节点右边的区域
            right: ''
        }, {
            middle: '',
            left: '',
            right: ''
        }, {
            middle: '',
            left: '',
            right: ''
        }, {
            middle: '',
            left: '',
            right: ''
        }, {
            middle: '',
            left: '',
            right: ''
        }],
        // 当前点的状态对应的自定义数组(可以自己添加状态对应的自定义内容)
        defineStatus: {
            wait: { // 等待状态
                middleColor: '#6057ee', // 已经过的中间节点颜色
                leftColor: '', // 已经过的节点左边的颜色
                rightColor: '', // 已经过的节点右边的颜色
                lineColor: '', // 已经过的线的颜色
                nextLineColor: '', // 当前点下一步的线条颜色
                nextDashed: true // 当前点下一步是否是dash线条样式
            },
            ok: { // 完成状态
                middleColor: '#6057ee',
                leftColor: '',
                rightColor: '',
                lineColor: '#6057ee',
                nextLineColor: '#6057ee',
                nextDashed: true
            },
            normal: { // 普通状态
                middleColor: '#1FB860',
                leftColor: '',
                rightColor: '',
                lineColor: '',
                nextLineColor: '',
                nextDashed: false
            }
        },
        renderMiddle: null, // 所有中间节点自定义(优先级最高)
        renderLeft: null, // 所有左边节点自定义(优先级最高)
        renderRight: null // 所有右边节点自定义(优先级最高)
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    // 节点左边
    leftElement = (item, index) => {
        const { defineStatus, currentIndex, currentStatus, stop, renderLeft } = this.props;
        // 点的状态信息
        const statusData = currentStatus ? defineStatus[currentStatus] : {};
        // 左边内容
        const propsLeft = typeof renderLeft == 'function' ? renderLeft(item, index) : renderLeft;
        const leftContent = propsLeft || item.left;
        // 默认颜色
        const lowColor = '#ccc';
        // 选中颜色
        const leftColor = statusData.leftColor || lowColor;
        // 当前颜色
        const currentColor = stop ? lowColor : (currentIndex >= index ? leftColor : lowColor);
        return (
            <React.Fragment>
                {<div style={{ color: currentColor }} className={styles['left-part']}>{leftContent}</div>}
            </React.Fragment>
        );
    }

    // 节点右边
    rightElement = (item, index) => {
        const { defineStatus, currentIndex, currentStatus, stop, renderRight } = this.props;
        // 点的状态信息
        const statusData = currentStatus ? defineStatus[currentStatus] : {};
        // 右边内容
        const propsRight = typeof renderRight == 'function' ? renderRight(item, index) : renderRight;
        const rightContent = propsRight || item.right;
        // 默认颜色
        const lowColor = '#ccc';
        // 选中颜色
        const rightColor = statusData.rightColor || lowColor;
        // 当前颜色
        const currentColor = stop ? lowColor : (currentIndex >= index ? rightColor : lowColor);
        return (
            <React.Fragment>
                {<div style={{ color: currentColor }} className={styles['right-content']}>{rightContent}</div>}
            </React.Fragment>
        );
    }

    // 中间节点
    middleDefine = (item, index) => {
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

    // 短连接线样式 statusItem: currentStatus对应的自定义数据
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
                {<div style={{ borderColor: currentColor, minHeight: length ? length : 100 }} className={currentIndex > index ? styles['line-solid'] : (currentIndex === index && statusData.nextDashed ? styles['line-dashed'] : styles['line-solid'])}></div>}
            </React.Fragment>
        );
    }

    // 渲染
    renderMain = (item, index) => {
        const { data = [], length } = this.props;
        return (
            <div key={index} className={length == 'flex' ? `${styles['step-item']} ${styles['flex-item']}` : styles['step-item']}>
                <div className={styles['left-content']}>
                    {this.leftElement(item, index)}
                    <div className={styles['step-middle']}>
                        {this.middleDefine(item, index)}
                        {index < data.length - 1 && this.lineElement(item, index)}
                    </div>
                </div>
                {this.rightElement(item, index)}
            </div>
        );
    }

    render() {
        const { data } = this.props;
        return (
            <div className={
                styles['step-box']}
            >
                {
                    data.map((item, index) => {
                        return this.renderMain(item, index);
                    })
                }
            </div>
        );
    }
}
