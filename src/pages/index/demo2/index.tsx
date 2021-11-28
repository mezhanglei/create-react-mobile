import React, { Component } from "react";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";

// mobile键盘
class Demo2 extends Component {
    state = {
        layoutName: "default",
        input: "",
        mergeDisplay: true, // 将合并diplay属性
        // 键盘布局(可以通过设置layoutName来改变布局)
        layout: {
            default: [
                "q w e r t y u i o p",
                "a s d f g h j k l",
                "{shift} z x c v b n m {backspace}",
                "{numbers} {space} {ent}"
            ],
            shift: [
                "Q W E R T Y U I O P",
                "A S D F G H J K L",
                "{shift} Z X C V B N M {backspace}",
                "{numbers} {space} {ent}"
            ],
            numbers: ["1 2 3", "4 5 6", "7 8 9", "{abc} 0 {backspace}"]
        },
        display: {
            "{numbers}": "123",
            "{ent}": "return",
            "{escape}": "esc ⎋",
            "{tab}": "tab ⇥",
            "{backspace}": "⌫",
            "{capslock}": "caps lock ⇪",
            "{shift}": "⇧",
            "{controlleft}": "ctrl ⌃",
            "{controlright}": "ctrl ⌃",
            "{altleft}": "alt ⌥",
            "{altright}": "alt ⌥",
            "{metaleft}": "cmd ⌘",
            "{metaright}": "cmd ⌘",
            "{abc}": "ABC"
        }
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
        if (button === "{numbers}" || button === "{abc}") this.handleNumbers();
    };

    handleShift = () => {
        const layoutName = this.state.layoutName;
        let shiftToggle = layoutName === "default" ? "shift" : "default";
        this.setState({
            layoutName: shiftToggle
        });
    };

    handleNumbers = () => {
        let layoutName = this.state.layoutName;
        let numbersToggle = layoutName !== "numbers" ? "numbers" : "default";
        this.setState({
            layoutName: numbersToggle
        });
    }

    onChangeInput = event => {
        const input = event.target.value;
        this.setState({ input });
        this.keyboard.setInput(input);
    };

    render() {
        return (
            <div style={{ position: 'fixed', bottom: '0' }}>
                demo2
                <input
                    value={this.state.input}
                    placeholder={"Tap on the virtual keyboard to start"}
                    onChange={this.onChangeInput}
                />
                <Keyboard
                    style={{ width: '100%' }}
                    layout={this.state.layout}
                    display={this.state.display}
                    mergeDisplay
                    keyboardRef={r => (this.keyboard = r)}
                    layoutName={this.state.layoutName}
                    onChange={this.onChange}
                    onKeyPress={this.onKeyPress}
                />
            </div>
        );
    }
};

export default Demo2;