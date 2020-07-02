import styles from './down-mask.less';
import { Button } from 'antd';


// 下载引导蒙层
export default class DownLoadMask extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: true
        };
    }

    render() {
        const { visible } = this.state;
        return (
            <div className={styles['mask_box_pay']} style={{ display: visible ? '' : 'none' }}>
                <div className={styles['mask']}></div>
                <img className={styles['shareArrow']} src={require('@/assets/arrow.png')} />
                <img className={styles['instruction']} src={require('@/assets/instruction.png')} />
            </div>
        );
    }
}