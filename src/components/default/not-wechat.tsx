import Result from "@/components/result/result";
import { useEffect } from "react";
import { Toast } from "antd-mobile";
import React from "react";

// 非微信提示页面
export default function NotWechat(props) {
  const title = "请在微信客户端打开链接";
  const imgUrl = require('src/assets/fail.png');

  useEffect(() => {
    document.title = title;
    Toast.show(title);
  });
  return <Result height="100vh" imgUrl={imgUrl} title={title} />;
} 
