import React, { Component, useState } from 'react';
import "./index.less";

const HomeInfo = (props) => {
    const onBack = () => {
        props.history.goBack();
    };
    return (<div className="info-box" onClick={onBack}>详情</div>);
};
export default React.memo(HomeInfo);
