import React from 'react';
import styles from './index.less';
import { pressImg } from '@/utils/image';
import { isTouch } from "@/utils/reg";

/**
 * 上传截图组件(简易版)
 */
export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    };

    static defaultProps = {
        // 尺寸限制: M
        size: 5,
        // 图片展示窗口大小
        imgWidth: 300,
        imgHeight: 280,
        // 裁剪窗口大小
        clipWidth: 100,
        clipHeight: 100
    }

    componentDidMount() {
        this.dragEle.addEventListener('mousedown', this.onDown, false);
        this.dragEle.addEventListener('touchstart', this.onDown, false);
    }

    // 获取事件对象的位置
    getEventPosition = (e) => {
        e = e || window.event;
        return {
            x: isTouch() ? e.touches[0].clientX : e.clientX,
            y: isTouch() ? e.touches[0].clientY : e.clientY
        };
    }

    // 按下
    onDown = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const { clipLeft, clipTop } = this.state;
        this.setState({
            preEventX: this.getEventPosition(e).x,
            preEventY: this.getEventPosition(e).y,
            preClipLeft: clipLeft,
            preClipTop: clipTop
        });
        document.addEventListener('mousemove', this.onMove, false);
        document.addEventListener('touchmove', this.onMove, false);
        document.addEventListener('mouseup', this.onUp, false);
        document.addEventListener('touchcancel', this.onUp, false);
        document.addEventListener('touchend', this.onUp, false);
    }

    // 移动
    onMove = (e) => {
        e.preventDefault();
        let { imgW, imgH, canvasWidth, canvasHeight, preEventX, preEventY, preClipLeft, preClipTop } = this.state;
        const nowX = this.getEventPosition(e).x;
        const nowY = this.getEventPosition(e).y;
        const moveX = nowX - preEventX;
        const moveY = nowY - preEventY;
        let nowClipLeft = moveX + preClipLeft;
        let nowClipTop = moveY + preClipTop;

        // 移动限制
        if (nowClipLeft < 0) {
            nowClipLeft = 0;
            return;
        } else if (nowClipLeft > imgW - canvasWidth) {
            nowClipLeft = imgW - canvasWidth;
        }

        if (nowClipTop < 0) {
            nowClipTop = 0;
            return;
        } else if (nowClipTop > imgH - canvasHeight) {
            nowClipTop = imgH - canvasHeight;
        }

        this.setState({
            clipLeft: nowClipLeft,
            clipTop: nowClipTop
        });
    }

    onUp = (e) => {
        e.preventDefault();
        this.removeEvent();
        this.dragEle.addEventListener('mousedown', this.onDown, false);
        this.dragEle.addEventListener('touchstart', this.onDown, false);
    }

    removeEvent = () => {
        document.removeEventListener("touchend", this.onUp, false);
        document.removeEventListener("touchcancel", this.onUp, false);
        document.removeEventListener("touchmove", this.onMove, false);
        document.removeEventListener("mousemove", this.onMove, false);
        this.dragEle.removeEventListener("mousedown", this.onDown, false);
        this.dragEle.removeEventListener("touchstart", this.onDown, false);
        document.removeEventListener("mouseup", this.onUp, false);
    }

    // 初始化img的样式及裁剪的样式
    initImg = () => {
        let imgW = this.completeImg.width;
        let imgH = this.completeImg.height;
        if (imgW > imgH) {
            this.completeImg.width = this.props.imgWidth;
        } else {
            this.completeImg.height = this.props.imgHeight;
        }
    }

    // 上传后的回调函数
    uploading = async () => {
        const that = this;
        const { size } = this.props;
        const file = this.inputBtn.files[0];
        const { data } = await pressImg({ file: file });
        const dataURL = data;
        const dataLength = dataURL.length;
        let fileLength = parseInt(dataLength - (dataLength / 8) * 2) / 1024 / 1024;
        //判断如果targetSize有限制且压缩后的图片大小比目标大小大，就弹出错误
        if (size < fileLength) {
            console.error("图片上传尺寸太大，请手动压缩后重新上传^_^");
            resolve(null);
        }
        that.initImg();
        // 显示弹窗
        that.setState({
            modalVisible: true
        });
        // 上传后的图片预览
        that.completeImg.src = dataURL;
        // 当图片加载完成初始化canvas和背景图片
        that.completeImg.onload = () => {
            // 实例化一个canvas画布和img
            let ctx = that.canvasImg.getContext("2d");
            let img = new Image();
            // 原始图片的宽高
            let imgW = that.completeImg.width;
            let imgH = that.completeImg.height;
            // 初始化裁剪区域的宽高及位置
            let clipLeft, clipTop, canvasWidth, canvasHeight;
            if (imgH > imgW) {
                const len = that.props.clipWidth || imgW;
                canvasWidth = len;
                canvasHeight = len;
                // 位置设置在中间
                clipLeft = imgW / 2 - len / 2;
                clipTop = imgH / 2 - len / 2;

            } else {
                const len = that.props.clipHeight || imgH;
                canvasWidth = len;
                canvasHeight = len;
                // 位置设置在中间
                clipLeft = imgW / 2 - len / 2;
                clipTop = imgH / 2 - len / 2;
            }

            // 初始化裁剪区域及canvas
            that.setState({
                ctx,
                img,
                clipLeft,
                clipTop,
                dataURL,
                imgW,
                imgH,
                canvasWidth,
                canvasHeight
            });
        }
    };

    // 点击确定时最终要裁切的canvas图片
    drawCanvas() {
        let { ctx, img, clipLeft, clipTop, dataURL, imgW, imgH, canvasWidth, canvasHeight } = this.state;
        // 清空画布
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        // 给img设置src
        img.src = dataURL;
        // 设置canvas的宽度
        this.canvasImg.width = canvasWidth;
        this.canvasImg.height = canvasHeight;
        // 填充画布 输入参数为图片在canvas内的位置和原始宽高
        ctx.drawImage(img, -clipLeft, -clipTop, imgW, imgH);
        // 确定之后的图片赋值
        this.resultImg.src = this.canvasImg.toDataURL("image/png");
        // 解决同一张照片不能重复上传
        this.inputBtn.value = '';
        this.closeModal();
    };

    closeModal() {
        this.setState({
            modalVisible: false,
            img: null
        });
    }

    render() {
        return (
            <div>
                <div className={styles["head-img"]}>
                    <img ref={ref => this.resultImg = ref} className={styles["my-img"]} alt="" />
                    <input ref={ref => this.inputBtn = ref} onChange={() => this.uploading()} type="file" className={styles["upload-btn"]} accept="image/*" multiple=""></input>
                </div>
                {this.renderModal()}
            </div>
        );
    };

    // 渲染弹窗
    renderModal() {
        const { clipLeft, clipTop, dataURL, imgW, canvasWidth, canvasHeight, modalVisible } = this.state;
        // 背景图片展示移动过程中的图片样式
        const style = {
            width: canvasWidth + 'px',
            height: canvasHeight + 'px',
            left: clipLeft + 'px',
            top: clipTop + 'px',
            background: `url(${dataURL}) -${clipLeft}px -${clipTop}px / ${imgW}px`
        }

        return (
            <div style={{ display: modalVisible ? 'block' : 'none' }} className={styles["pictrue-clip-modal"]}>
                <div className={styles["show-pictrue"]}>
                    <div className={styles["mask-pictrue"]}></div>
                    <img ref={ref => this.completeImg = ref} className={styles["complete-img"]} src="" alt="" />
                    <canvas style={{ display: 'none' }} ref={ref => this.canvasImg = ref}></canvas>
                    <div ref={node => this.dragEle = node} style={style} className={styles["clip-img"]}></div>
                </div>
                <div className={styles["pictrue-footer"]}>
                    <div onClick={() => this.closeModal()} className={styles["pictrue-footer-cancel"]}>取消</div>
                    <div onClick={() => this.drawCanvas()} className={styles["pictrue-footer-confirm"]}>确定</div>
                </div>
            </div>
        );
    }
}

