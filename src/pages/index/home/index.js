import React, { Component, useState, useEffect } from 'react';
import styles from "./index.less";
import { Button } from "antd-mobile";
import http from "@/http/request.js";
import { urlDelQuery, getUrlQuery } from "@/utils/url";
import { connect } from "react-redux";
import SendVerifyCode from "@/components/sendCode/sendcode";
import Loaders from "@/components/loader/index";
import { isNumber, isString, isUndefined } from "@/utils/type";
import { getDateDiff } from "@/utils/date";

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isSend: false,
            arr: ['1111', '222222', '33333', '444444', '222222', '33333', '444444', '222222', '33333', '444444', '222222', '33333', '444444', '222222', '33333', '444444', '222222', '33333', '444444', '222222', '33333', '444444', '222222', '33333', '444444', '222222', '33333', '444444', '222222', '33333', '444444', '222222', '33333', '444444', '222222', '33333', '444444', '222222', '33333', '444444', '222222', '33333', '444444', '222222', '33333', '444444', '222222', '33333', '444444', '222222', '33333', '444444', '222222', '33333', '444444'],
            current: ""
        };
    }
    static defaultProps = {
        type: '首页'
    }

    componentDidMount() {
        http.get({
            url: '/list'
        }).then(res => {
            console.log(res);
        });
    }

    handle = () => {
        this.setState({
            isSend: true
        });
    }

    clickInfo = (item) => {
        this.props.history.push(`home/info/${item}`);
    }

    clickDom = (item) => {
        this.setState({
            current: item
        });
        setTimeout(() => {
            this.props.history.push(`home/info/${item}`);
        }, 1000);
    }
    show = () => {
        console.log(222222);
    }

    render() {
        const { current, arr } = this.state;
        return (
            <div>
                <div points="woshihaoren" className={styles["home"]}>首页{getDateDiff('2020-7-12', { key: 1 })}</div>
                <div event-name="handle-point" onClick={this.show}>当前：{current}</div>
                {
                    arr.map((item, index) => {
                        return <p onClick={() => this.clickDom(item)} style={{ fontSize: '30px' }} key={index}><a>{index + '-' + item}</a></p>;
                    })
                }
            </div>
        );
    }
};

export default Home;
