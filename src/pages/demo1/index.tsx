import React, { Component } from "react";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import layouts from "simple-keyboard-layouts/build/layouts/chinese";

// 中文键盘
class Demo1 extends Component {
    state = {
        layoutName: "default",
        input: ""
    };

    onChange = input => {
        this.setState({ input });
        console.log("Input changed", input);
    };

    onKeyPress = button => {
        console.log("Button pressed", button);

        /**
         * If you want to handle the shift and caps lock buttons
         */
        if (button === "{shift}" || button === "{lock}") this.handleShift();
    };

    handleShift = () => {
        const layoutName = this.state.layoutName;

        this.setState({
            layoutName: layoutName === "default" ? "shift" : "default"
        });
    };

    onChangeInput = event => {
        const input = event.target.value;
        this.setState({ input });
        this.keyboard.setInput(input);
    };

    render() {
        console.log(layouts, '外来插件')
        return (
            <div style={{position: 'fixed', bottom: '0'}}>
                <input
                    value={this.state.input}
                    placeholder={"Tap on the virtual keyboard to start"}
                    onChange={this.onChangeInput}
                />
                <Keyboard
                    style={{width: '100%'}}
                    layout={layouts.layout}
                    layoutCandidates={layouts.layoutCandidates}
                    keyboardRef={r => (this.keyboard = r)}
                    layoutName={this.state.layoutName}
                    onChange={this.onChange}
                    onKeyPress={this.onKeyPress}
                />
            </div>
        );
    }
};
export default Demo1;
