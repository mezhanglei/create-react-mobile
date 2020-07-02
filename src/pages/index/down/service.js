import Axios from 'axios';
import { message } from 'antd';

// 安卓环境下直接获取流溪App下载链接
export const GetLiuXiLinkByAndroid = async () => {
    let api = '/cmb-xt-api/ov-liuxi/appVersion/last/downloadUrl';
    if (process.env.NODE_ENV == 'sit') {
        api = 'http://150.129.193.16:1080/cmb-xt-api/ov-liuxi/appVersion/last/downloadUrl';
    }
    const res = await Axios.get(api);
    return res.data;
};