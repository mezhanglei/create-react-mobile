import React, { Component, useState, useEffect } from 'react';
import "./index.scss";

export default class Home extends React.Component {
    constructor(props) {
        super(props);
    }
    static defaultProps = {
        type: '首页'
    }
    componentDidMount() { }
    render() {
        return (
            <div>
                <div className="home">{this.props.type}</div>
            </div>
        );
    }
};
