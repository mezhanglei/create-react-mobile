import styles from './mask.less';

// 引导蒙层
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
                <img className={styles['shareArrow']} src={require('static/images/arrow.png')} />
                <img className={styles['instruction']} src={require('static/images/instruction.png')} />
            </div>
        );
    }
}
