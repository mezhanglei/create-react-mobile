

import React, { Component } from 'react';
import { useEffect, useState } from "react";
import { isString } from "@/utils/type";
import "./index.less";
import classNames from "classnames";

/**
 * 简易Button组件(用于一些自定义组件使用，脱离ui库的依赖)
 */

const reg = /^[\u4e00-\u9fa5]{2}$/;
const isTwoCNChar = reg.test.bind(reg);
const Button = (props) => {

    const {
        prefixCls = "mine-button",
        type = "primary", // string   primary: 默认实心, default: 空心边框按钮  dashed虚线
        htmlType = "button", // string  button: 默认按钮功能, submit: 提交表单功能, reset: 清空表单功能
        shape, // string  circle表示圆形按钮
        danger, // boolean  表示警告颜色的按钮
        size, // string  large表示大按钮 small表示小按钮
        disabled, // boolean 禁用状态
        onClick,
        className,
        ref,
        ...rest
    } = props;

    const classes = classNames(prefixCls, className, {
        [`${prefixCls}-${type}`]: type,
        [`${prefixCls}-${shape}`]: shape,
        [`${prefixCls}-dangerous`]: !!danger,
        [`${prefixCls}-${size}`]: size
    });

    const insertSpace = (child) => {
        // 汉字分隔
        if (isString(child)) {
            if (isTwoCNChar(child)) {
                child = child.split('').join(' ');
            }
            return <span>{child}</span>;
        }
        return child;
    };

    const handleClick = (e) => {
        onClick && onClick(e);
    };

    const buttonRef = ref || React.createRef();

    const kids = React.Children.map(props.children, insertSpace);
    return (
        <button
            {...rest}
            disabled={disabled}
            type={htmlType}
            className={classes}
            onClick={handleClick}
            ref={buttonRef}
        >
            {kids}
        </button>
    );
};

export default Button;
