import React from 'react';
import ReactDOM from 'react-dom';
import { Prompt } from 'react-router';
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom';
const MyComponent1 = () => (
    <div>组件一</div>
);
const MyComponent2 = () => (
    <div>组件二</div>
);
class MyComponent extends React.Component {
    render() {
        const getConfirmation = (message, callback) => {
            const ConFirmComponent = () => (
                <div>
                    {message}
                    <button onClick={() => { callback(true); ReactDOM.unmountComponentAtNode(document.getElementById('root')); }}>确定</button>
                    <button onClick={() => { callback(false); ReactDOM.unmountComponentAtNode(document.getElementById('root')); }}>取消</button>
                </div>
            );
            ReactDOM.render(
                <ConFirmComponent />,
                document.getElementById('root')
            );
        };
        return (
            <Router getUserConfirmation={getConfirmation}>
                <div>
                    <Prompt message="Are you sure you want to leave?" />
                    <Link to="/a">跳转组件二</Link>
                    <Route component={MyComponent1} />
                    <Route exact path="/a" component={MyComponent2} />
                </div>
            </Router>
        );
    }
}

ReactDOM.render(
    <MyComponent />,
    document.getElementById('root')
);
