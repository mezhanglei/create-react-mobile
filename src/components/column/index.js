import React from 'react';
import classnames from 'classnames';
import './styles.less';

/**
 * 详情列组件
 * 参数说明:
 * @param {Number} labelWidth lable的宽度
 * @param {Array} labelStyle lable样式的覆盖
 */

export default class ColumnDetail extends React.Component {
    static defaultProps = {
        isRequire: false
    }
    constructor(props) {
        super(props);
    }
    render() {
        const { labelWidth, labelHover } = this.props;

        const cls = classnames(
            'column-wrap',
            'column-in-detail',
            { 'mix-edit': this.props.isMixEdit },
            this.props.className
        );

        const labelCls = classnames(
            'column-prefix',
        );

        let labelStyle = {};
        labelWidth && (labelStyle.width = parseInt(labelWidth) + 'px');

        return (
            <div className={cls} style={{ width: this.props.width }}>
                {this.props.label
                    ? <label className={labelCls} style={labelStyle} title={labelHover && this.props.label} >{this.props.label}</label> : ''
                }
                {this.props.children && <span className="column-content">{this.props.children}</span>}
                {this.props.value && <span className="column-content">{this.props.value}</span>}
            </div>
        );
    }
}