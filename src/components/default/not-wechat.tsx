import Result from "@/components/result/result";
import { useEffect } from "react";
// import { message } from "antd-mobile";

// 非微信提示页面
export default function NotWechat(props) {
  const title = "请在微信客户端打开链接";
  const imgUrl = require('src/assets/fail.png');

  useEffect(() => {
    document.title = title;
    // message.info(title);
  });
  return <Result height="100vh" imgUrl={imgUrl} title={title} />;
} 
