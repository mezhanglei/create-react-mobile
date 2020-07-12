import React, { Component, useState, useEffect } from 'react';
import "./index.less";
import { Button } from "antd-mobile";
import http from "@/http/request.js";
import { urlDelQuery, getUrlQuery } from "@/utils/url-utils";
import { connect } from "react-redux";

class Home extends React.Component {
    constructor(props) {
        super(props);
    }
    static defaultProps = {
        type: '首页'
    }
    componentDidMount() {
    }
    render() {
        return (
            <div>
                <div className="home">首页

                </div>
            </div>
        );
    }
};

export default Home;
