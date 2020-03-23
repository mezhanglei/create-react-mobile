
import React from 'react';
import "./index.css";

//步骤条组件
// 1.支持主动终止当前步骤
// 2.支持等待,拒绝,未开始,已开始四种点状态
// 3.支持上方展示状态文字(支持一个状态多个名字),下方展示步骤的名称
export default class extends React.Component {
  constructor(props) {
    super(props);

    //大圆点的Dom
    this.bigCircle = React.createRef();
    //小圆点的Dom
    this.smallCircle = React.createRef();
  }

  state = {
    //步骤条的渲染数组的格式
    stepArr: ['需求提交', '需求接收', '需求确认', '需求立项'],
    //状态的渲染数组的格式
    statusArr: [{
      nameArr: ['开发者已接受'], //当前状态的名字数组,包含当前状态的所有名字,一般是一个,但是有时一个状态涉及重新操作则会需要增加一个名字用来描述当前点状态
      status: '03', //状态的数字字符串
      color: 'green', //字体的颜色
      wait: false, //是否为等待 false为否
      refuse: false, //是否为拒绝, false为否,
      stepIndex: 2 //状态属于步骤条上的哪一个点 默认在第一个
    }]
  };

  componentDidMount() {
    this.setState({
      //当前点的状态数字字符串
      status: this.props.status || '',
      //是否在当前点进行终止操作 默认false
      stop: this.props.stop || false,
      //当前状态的名字在名字数组中的序号 默认为0
      nameIndex: this.props.nameIndex || 0
    })
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({
      //当前点的状态数字字符串
      status: nextProps.status || '',
      //当前点是否为终止操作 默认false
      stop: nextProps.stop || false,
      //当前状态的名字在名字数组中的序号 默认为0
      nameIndex: nextProps.nameIndex || 0
    })
  };

  //在步骤条中每个状态数组中找到当前进度状态匹配的信息
  getStatusTotal = (key, value, arr, total) => {
    for (let i = 0; i < arr.length; i++) {
      let obj = arr[i];
      if (obj[key] === value) {
        return obj[total]
        break;
      };
    }
    return '';
  }

  render() {
    return (
      <div className="step-box">
        {this.renderStep()}
      </div>
    );
  };

  renderStep() {
    let { status, stop, nameIndex, stepArr, statusArr } = this.state;
    let html = null;
    //获取当前状态的字体颜色
    let color = this.getStatusTotal("status", status, statusArr, "color");
    //获取当前状态的字体名称
    let statusName = this.getStatusTotal("status", status, statusArr, 'nameArr') && this.getStatusTotal("status", status, statusArr, 'nameArr')[nameIndex];
    //获取当前状态所在的步骤序号
    let stepIndex = this.getStatusTotal("status", status, statusArr, "stepIndex");
    //获取当前状态的refuse值
    let refuse = this.getStatusTotal("status", status, statusArr, "refuse");
    //获取当前状态的wait值
    let wait = this.getStatusTotal("status", status, statusArr, "wait");
    //大圆点的宽度
    let bigCircleWidth = this.bigCircle.current && this.bigCircle.current.offsetWidth;
    //小圆点的宽度
    let smallCircleWidth = this.smallCircle.current && this.smallCircle.current.offsetWidth;

    if (stepArr.length >= 2) {
      html = stepArr && stepArr.map((item, index) => {
        return (
          <div className={index === stepArr.length - 1 ? "step-item-last" : "step-item"}>
            {/* 头上字体样式 */}
            <div style={{ color: stop || refuse ? "red" : (color ? color : "#3477f4"), left: stepIndex >= index ? (bigCircleWidth/2 + 'px') : (smallCircleWidth/2 + 'px') }} className="step-top-text">
              {stepIndex === index ? (stop ? '已终止' : statusName) : ''}
            </div>
            <div className="step-middle">
              {/* 圆点 */}
              <div ref={stepIndex >= index ? this.bigCircle : this.smallCircle} className={stepIndex >= index ? (stop || refuse ? "big-circle-gray" : "big-circle-blue") : "step-circle"}></div>
              {/* 连接线的样式 */}
              {index === stepArr.length - 1 ? "" : <div className={stepIndex > index ? (stop || refuse ? "line-solid-gray" : "line-solid-blue") : (stepIndex === index ? (wait ? (stop || refuse ? "line-dashed-gray" : "line-dashed-blue") : (stop || refuse ? "line-solid-gray" : "line-solid-blue")) : "line-solid-gray")}></div>}
            </div>
            {/* 底部字体样式 */}
            <div className="step-bottom-text" style={{ color: stepIndex >= index ? "#4a4a4a" : "#ccc", left: stepIndex >= index ? (bigCircleWidth/2 + 'px') : (smallCircleWidth/2 + 'px') }}>{item}</div>
          </div>
        );
      })
    }
    return html;
  }
}

// 使用组件
/**
 * status 当前状态
 * stop 终止当前操作
 * nameIndex 当前状态的名字序号
 * <StepModel status={} stop={} nameIndex={} />
 */