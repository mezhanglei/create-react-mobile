import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss'
class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Text: 'react-h5空脚手架'
    }
  }
  // 想支持动态懒加载需要安装@babel/plugin-syntax-dynamic-import这个babel插件来实现
  loadComponenment() {
    // import ('./common.js').then((res) => {
    //   console.log(res);
    //   this.setState({
    //     Text: res.default
    //   })
    // })
  }
  render() {
    let { Text } = this.state;
    return (
      <div className="v-main">
        <div>{this.state.Text}</div>
        <div className="v-son"></div>
      </div>
    );
  }
}

ReactDOM.render(
  <Search />,
  document.getElementById('root')
);