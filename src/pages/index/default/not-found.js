import Empty from "@/components/empty/empty-mobile";
import { useEffect } from "react";
import { Toast } from "antd-mobile";

// 404页面
export default function NotFound(props) {
    const title = "页面不存在";
    useEffect(() => {
        document.title = title;
        Toast.fail(title);
    });
    return <Empty title={title} />;
} 
