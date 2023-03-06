import './result.less';
import React from "react";
import { isEmpty } from "@/utils/type";
import EmptyImage from 'static/images/no-data.png';

/**
 * 结果页面
 */
export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  static defaultProps = {
    imgUrl: EmptyImage,
    title: "暂无数据",
    subTitle: "",
    width: "100%",
    height: "100%"
  }

  render() {
    const { imgUrl, title, subTitle, width, height } = this.props;
    return (
      <div style={{ width: width, height: height }} className='page-result'>
        <div className="content">
          <div className='page-image' style={{ backgroundImage: `url(${imgUrl})` }}>
          </div>
          {!isEmpty(title) && <div className='main-title'>{title}</div>}
          {!isEmpty(subTitle) && <div className='second-text'>{subTitle}</div>}
        </div>
      </div>
    );
  }
}
