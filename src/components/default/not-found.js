import Result from "@/components/result/result-mobile";
import { useEffect } from "react";
import { message } from "antd";

// 404页面
export default function NotFound(props) {
    const title = "页面不存在";
    useEffect(() => {
        document.title = title;
        message.error(title);
    });
    return <Result title={title} />;
} 
