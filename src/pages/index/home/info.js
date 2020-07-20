import React, { Component, useState, useEffect } from 'react';

class HomeInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
    }

    render() {
        return (
            <div>
                {this.props.match.params.id}
            </div>
        );
    }
};

export default HomeInfo;
