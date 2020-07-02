import styles from './styles.less';
import { Button, message } from 'antd';
import DownMask from '../../../components/mask/down-mask';
import { isIOS, isAndroid, isInWeChat, isQQ } from '@/utils/zhanglei-utils';
import { GetLiuXiLinkByAndroid } from './service';

class LiuxiDownload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showMask: false
        };
    }

    componentDidMount() {
    }
    /**
     * 1.判断iOS和Android
     * 2.iOS判断是否在微信中，
     *   -是，无论是否已有APP都直接跳转到App Store
     *   -否，直接打开APP或跳转到App Store
     * 3.Android判断是否在微信中，
     *   -是，提示用户用浏览器打开页面，再直接打开APP或跳转下载页面
     *   -否，直接打开APP或跳转下载页面
     */
    downLoad = () => {
        // 判断是安卓还是ios
        if (isAndroid()) {
            if (isInWeChat() || isQQ()) {
                // 引导用户在浏览器中打开
                this.setState({
                    showMask: true
                });
                return;
            }
            // Android, 尝试打开app或下载页面
            this.openApp('msfacepay://');
        } else if (isIOS()) {
            window.location.href = 'itms-apps://itunes.apple.com/cn/app/id1515056060?mt=8';
            // if (isInWeChat() || isQQ()) {
            //     window.location.href = 'itms-apps://itunes.apple.com/cn/app/id1515056060?mt=8';
            //     return;
            // }
            // //iOS不支持iframe打开APP, 使用window.location.href
            // window.location.href = 'msfacepay://';
            // window.setTimeout(() => {
            //     //打开app应用商店，由app开发人员提供
            //     window.location.href = 'itms-apps://itunes.apple.com/cn/app/id1515056060?mt=8';
            // }, 2000);
        }
    }

    // 安卓通过iframe的方式试图打开APP，如果能正常打开，会直接切换到APP，并自动阻止a标签的默认行为, 如果没有则会继续执行后续代码打开下载地址
    openApp(src) {
        let ifr = document.createElement('iframe');
        ifr.src = src;
        ifr.style.display = 'none';
        document.body.appendChild(ifr);
        window.setTimeout(() => {
            document.body.removeChild(ifr);
            GetLiuXiLinkByAndroid().then((res) => {
                const url = res.fileUrl;
                // 安卓下载地址
                window.location.href = url;
            });
        }, 2000);
    }

    render() {
        return (
            <React.Fragment>
                {
                    <div className={styles.liuxiDownload}>
                        <header>
                            <img className={styles.logoImg} src={require('../../common/assets/liuxi_logo.png')} />
                        </header>
                        <main>
                            <img className={styles.phoneImg} src={require('../../common/assets/liuxi_phone.png')}></img>
                        </main>
                        <footer>
                            <Button onClick={this.downLoad}>立即下载流溪APP</Button>
                        </footer>
                    </div>
                }
                {this.state.showMask && <DownMask />}
            </React.Fragment>
        );
    }
}

ReactDOM.render(<LiuxiDownload />, document.getElementById('merry'));