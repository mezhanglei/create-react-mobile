import Result from "@/components/result/result-mobile";
import { useEffect } from "react";
import { message } from "antd";

// 非微信提示页面
export default function NotWechat(props) {
    const title = "请在微信客户端打开链接";
    const imgUrl = require('static/images/fail.png');

    useEffect(() => {
        document.title = title;
        message.info(title);
    });
    return <Result imgUrl={imgUrl} title={title} />;
} 
