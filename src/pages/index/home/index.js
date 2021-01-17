import React, { Component, useState, useEffect } from 'react';
import styles from "./index.less";
import { Button } from "antd-mobile";
import http from "@/http/request.js";
import { connect } from "react-redux";
import { isNumber, isString, isUndefined } from "@/utils/type";
import { getDateFormat } from "@/utils/date/format";

class Home extends React.PureComponent {
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
        this.props.history.push({ pathname: `home/info/${item}`, search: 'name=张磊' });
    }
    show = () => {
        console.log(222222);
    }

    render() {
        const { current, arr } = this.state;
        return (
            <div>
                <div points="woshihaoren" className={styles["home"]}>首页{getDateFormat('2020-8-25 23:20:22')}</div>
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
