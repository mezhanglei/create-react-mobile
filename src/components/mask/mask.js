import './mask.less';

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
            <div className='mask_box_pay' style={{ display: visible ? '' : 'none' }}>
                <div className='mask'></div>
                <img className='shareArrow' src={require('static/images/arrow.png')} />
                <img className='instruction' src={require('static/images/instruction.png')} />
            </div>
        );
    }
}
