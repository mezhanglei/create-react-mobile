import React, { Component, useState, useEffect } from 'react';

class HomeInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({
                title: this.props.match.params.id
            });
        }, 2000);
    }

    render() {
        const { title } = this.state;
        return (
            <div>
                {title}
            </div>
        );
    }
};

export default HomeInfo;
