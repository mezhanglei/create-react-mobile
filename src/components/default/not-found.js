import Result from "@/components/result/result";
import { useEffect } from "react";
import { Toast } from "antd-mobile";

// 404页面
export default function NotFound(props) {
    const title = "页面不存在";
    useEffect(() => {
        document.title = title;
        Toast.fail(title);
    });
    return <Result height="100vh" title={title} />;
} 
