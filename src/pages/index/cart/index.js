import React, { Component, useState } from 'react';
import "./index.less";
export default function Cart(props) {
    const onBack = () => {
        props.history.goBack();
    };
    return (<div className="cart-box" onClick={onBack}>购物车</div>);
}
