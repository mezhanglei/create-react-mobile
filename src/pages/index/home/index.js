import React, { Component, useState, useEffect } from 'react';
import "./index.less";
import { Button } from "antd";
import http from "@/http/request.js";
import { urlDelQuery, getUrlQuery } from "@/utils/url";
import { connect } from "react-redux";

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    static defaultProps = {
        type: '首页'
    }

    componentDidMount() {
    }

    onSubmit = () => {

    }

    render() {
        return (
            <div>
                <div className="home">首页
                    <Button type="primary" onClick={this.onSubmit}>保存</Button>
                </div>
            </div>
        );
    }
};

export default Home;
