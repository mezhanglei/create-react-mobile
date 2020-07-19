import React, { Component, useState, useEffect } from 'react';
import styles from "./index.less";
import { Button } from "antd-mobile";
import http from "@/http/request.js";
import { urlDelQuery, getUrlQuery } from "@/utils/url-utils";
import { connect } from "react-redux";
import SendVerifyCode from "@/components/sendCode/sendcode";
import Loaders from "@/components/loader/index"

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isSend: false
        };
    }
    static defaultProps = {
        type: '首页'
    }
    componentDidMount() {
        // Loaders.start()
        http({
            method: "get",
            url: "/list"
        }).then(() => {
            // Loaders.end()
        })
    }

    handle = () => {
        this.setState({
            isSend: true
        });
    }

    render() {
        return (
            <div>
                <div className={styles["home"]}>首页
                    <SendVerifyCode handle={this.handle} count={this.state.count} isSend={this.state.isSend} />
                </div>
            </div>
        );
    }
};

export default Home;
