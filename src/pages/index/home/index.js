import React, { Component, useState, useEffect } from 'react';
import "./index.less";
import { Button } from "antd-mobile";
import http from "@/http/request.js";
import { urlDelQuery, getUrlQuery } from "@/utils/url-utils";
export default class Home extends React.Component {
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
                <div className="home">{this.props.type}</div>
            </div>
        );
    }
};
