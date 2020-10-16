

import React, { Component } from 'react';
import { useEffect, useState } from "react";
import "./index.less";
import classNames from "classnames";

/**
 * 简易CheckBox组件(用于一些自定义组件使用，脱离ui库的依赖)
 * indeterminate: boolean true表示不完全选中状态
 * value: string checkbox的value属性
 * checked: boolean 选中状态
 * disabled: boolean 禁用状态
 * onChange: function(checked) {} 选中状态变化的函数
 */

const CheckBox = (props) => {

    const checkboxRef = ref || React.createRef();

    const {
        prefixCls = "mine-checkbox-wrapper",
        indeterminate,
        children,
        className,
        onChange,
        ref,
        ...rest
    } = props;

    let [value, setValue] = useState("");
    let [checked, setChecked] = useState(false);
    let [disabled, setDisabled] = useState(false);

    const valueChange = (ref, value) => {
        const checkbox = ref.current;
        if (checkbox) checkbox.value = value;
    };

    const checkedChange = (ref, checked) => {
        const checkbox = ref.current;
        if (checkbox) checkbox.checked = checked;
    };

    const disabledChange = (ref, disabled) => {
        const checkbox = ref.current;
        if (checkbox) checkbox.disabled = disabled;
    };

    useEffect(() => {
        setValue(props.value);
        valueChange(checkboxRef, props.value);
    }, [checkboxRef, props.value]);

    useEffect(() => {
        setChecked(props.checked);
        checkedChange(checkboxRef, props.checked);
    }, [props.checked]);

    useEffect(() => {
        setDisabled(props.disabled);
        disabledChange(checkboxRef, props.disabled);
    }, [checkboxRef, props.disabled]);

    const toggleOption = (e) => {
        setChecked(e.target.checked);
        checkedChange(checkboxRef, e.target.checked);
        onChange && onChange(e.target.checked);
    };

    const classString = classNames(prefixCls, className, {
        [`${prefixCls}-checked`]: !indeterminate && checked,
        [`${prefixCls}-disabled`]: disabled
    });

    const iconClass = classNames('check-icon', {
        [`check-icon-checked`]: !indeterminate && checked,
        [`check-icon-indeterminate`]: indeterminate
    });

    return (
        <label
            {...rest}
            className={classString}
        >
            <span className='check-box'>
                <input ref={checkboxRef} onChange={toggleOption} type="checkbox" />
                <span className={iconClass}></span>
            </span>
            {children !== undefined && <span>{children}</span>}
        </label>
    );
};

export default CheckBox;
