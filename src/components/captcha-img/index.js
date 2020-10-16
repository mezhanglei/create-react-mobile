import './index.less';
import React from "react";
import { isArray } from "@/utils/type";

/**
 * 拖拽图形验证码
 * 参数: imgUrl:  string | Array 图片的路径
 *       cw,ch:  number 裁剪的宽高
 *       precision: number 允许重合误差
 *       width,height: number 区域图片的宽高
 * 事件:
 *     onSuccess: 成功事件
 *     onError: 失败事件
 */
class CaptchaImg extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            eventinfo: {
                flag: false,
                sliderLeft: 0,
                clipleft: 0,
                preEventX: 0
            }
        };
    }
    static defaultProps = {
        imgUrl: [require('./images/bg/demo.jpeg'), require('./images/bg/demo1.jpeg'), require('./images/bg/demo2.jpg'), require('./images/bg/demo3.jpg')],
        cw: 66,
        ch: 66,
        precision: 5,
        width: 500,
        height: 400
    }

    componentDidMount() {
        this.initData();
    }

    createCanvas(w, h) {
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        return canvas;
    }

    // 随机位置
    randomNum(min, max) {
        const rangeNum = max - min;
        const num = min + Math.round(Math.random() * rangeNum);
        return num;
    }

    // 获得裁剪的位置
    getClipPoint(w, h) {
        const padding = 10;
        const startw = this.props.cw + padding;
        const starth = this.props.ch + padding;
        if (w < startw * 2 || h < starth) return;

        const startPoint = {
            clipX: this.randomNum(startw, w - startw),
            clipY: this.randomNum(padding, h - starth)
        };
        return startPoint;
    }

    // 绘画裁剪区域
    clipPath(ctx, clipX, clipY) {
        clipX = clipX + 0.2;
        clipY = clipY + 0.2;

        const subw = parseInt((this.props.cw - 1) / 6);
        const subh = parseInt((this.props.ch - 1) / 6);
        const radius = Math.min(subw, subh);
        const clipw = subw * 5 + 0.5;
        const cliph = subh * 5 + 0.5;

        ctx.beginPath();
        ctx.moveTo(clipX, clipY);
        ctx.lineTo(clipX + clipw, clipY);
        ctx.lineTo(clipX + clipw, clipY + parseInt(cliph / 2) - radius);
        ctx.arc(clipX + clipw, clipY + parseInt(cliph / 2), radius, -Math.PI / 2, Math.PI / 2, false);
        ctx.lineTo(clipX + clipw, clipY + cliph);
        ctx.lineTo(clipX + clipw - (parseInt(clipw / 2) - radius), clipY + cliph);
        ctx.arc(clipX + parseInt(clipw / 2), clipY + cliph, radius, 0, Math.PI, false);
        ctx.lineTo(clipX, clipY + cliph);
        ctx.lineTo(clipX, clipY);
        ctx.closePath();
    }

    // 填充裁剪区域
    fillClip(canvas, clipX, clipY, alpha) {
        const ctx = canvas.getContext('2d');
        this.clipPath(ctx, clipX, clipY);
        ctx.fillStyle = "rgba(0,0,0, " + alpha + ")";
        ctx.fill();
    }

    strokeClip(canvas, clipX, clipY) {
        const ctx = canvas.getContext('2d');
        this.clipPath(ctx, clipX, clipY);
        ctx.strokeStyle = "#fff";
        ctx.stroke();
    }

    // 事件监听
    eventInit(clipX) {
        const sliderBtn = this.sliderBtn;
        const clipcanvas = this.clipCanvas;
        const result = this.result;
        const resultClass = result.className;
        let { eventinfo } = this.state;
        const that = this;
        eventinfo.sliderLeft = parseFloat(getComputedStyle(sliderBtn, null).getPropertyValue('left'));
        eventinfo.clipleft = parseFloat(getComputedStyle(clipcanvas, null).getPropertyValue('left'));

        const reset = function () {
            const boxClassName = that.captchaBox.className;
            that.captchaBox.className += ' shake';

            setTimeout(function () {
                sliderBtn.style.left = "10px";
                clipcanvas.style.left = "20px";
                eventinfo.sliderLeft = 10;
                eventinfo.clipleft = 20;
            }, 500);

            setTimeout(function () {
                result.className = resultClass;
                that.captchaBox.className = boxClassName;
            }, 1500);
        };

        const moveStart = function (e) {
            eventinfo.flag = true;
            if (e.touches) {
                eventinfo.preEventX = e.touches[0].clientX;
            } else {
                eventinfo.preEventX = e.clientX;
            }
        };

        const move = function (e) {
            let disX;
            if (eventinfo.flag) {
                if (e.touches) {
                    disX = e.touches[0].clientX - eventinfo.preEventX;
                } else {
                    disX = e.clientX - eventinfo.preEventX;
                }
                sliderBtn.style.left = eventinfo.sliderLeft + disX + "px";
                clipcanvas.style.left = eventinfo.clipleft + disX + "px";

                if (e.preventDefault) e.preventDefault();
                return false;
            }
        };

        const moveEnd = function (e) {
            if (eventinfo.flag) {
                eventinfo.flag = false;
                eventinfo.sliderLeft = parseFloat(getComputedStyle(sliderBtn, null).getPropertyValue('left'));
                eventinfo.clipleft = parseFloat(getComputedStyle(clipcanvas, null).getPropertyValue('left'));

                if (Math.abs(clipX - eventinfo.sliderLeft) <= that.props.precision) {
                    result.innerHTML = '验证通过';
                    result.className = resultClass + ' success';
                    that.props.onSuccess && that.props.onSuccess();
                } else {
                    result.innerHTML = '拖动滑块将悬浮图像正确拼合';
                    result.className = resultClass + ' fail';
                    reset();
                    that.props.onError && that.props.onError();
                }
            }
        };

        sliderBtn.addEventListener("touchstart", moveStart, false);
        sliderBtn.addEventListener("mousedown", moveStart, false);
        document.addEventListener("touchmove", move, false);
        document.addEventListener("mousemove", move, false);
        document.addEventListener('touchend', moveEnd, false);
        document.addEventListener('mouseup', moveEnd, false);
    }

    initData = () => {
        // 实例化img,并最终渲染到canvas画布上进行操作
        const img = new Image();
        const imgUrl = isArray(this.props.imgUrl) ? this.props.imgUrl : [this.props.imgUrl];
        const urlIndex = Math.floor(Math.random() * imgUrl.length);
        img.src = imgUrl[urlIndex];
        const that = this;
        img.onload = function () {
            const w = that.imgCanvas.width;
            const h = that.imgCanvas.height;
            that.imgCanvas.getContext('2d').drawImage(img, 0, 0, w, h);

            // 图片裁剪的位置
            const startPoint = that.getClipPoint(w, h);
            if (!startPoint) {
                console.error("can not get the start point");
                return;
            }

            // 绘画并填充裁剪区域
            const clipX = startPoint.clipX;
            const clipY = startPoint.clipY;
            that.fillClip(that.imgCanvas, clipX, clipY, 0.7);

            // 创建画布(目标图像)
            const sourceCanvas = that.createCanvas(w, h);
            const sctx = sourceCanvas.getContext('2d');
            sctx.drawImage(img, 0, 0, w, h);
            // 只有源图像内的目标图像部分会被显示，源图像透明
            sctx.globalCompositeOperation = 'destination-in';

            // 创建裁剪区域(源图像)
            const destCanvas = that.createCanvas(that.props.cw, that.props.ch);
            that.fillClip(destCanvas, 0, 0, 1);
            sctx.drawImage(destCanvas, clipX, clipY);

            // 将图像画布中的指定位置大小的区域(裁剪区域)复制并放到新的画布上
            that.clipCanvas.getContext('2d').putImageData(sctx.getImageData(clipX, clipY, that.props.cw, that.props.ch), 0, 0);
            that.strokeClip(that.clipCanvas, 0, 0);
            that.clipCanvas.style.top = clipY + 'px';
            // 事件监听
            that.eventInit(clipX);
        };
    }

    render() {
        return (
            <div ref={node => this.captchaBox = node} className='captcha-box' style={{ width: this.props.width + 'px' }}>
                <div className='canvas-box'>
                    <canvas ref={node => this.imgCanvas = node} id="canvas" width={this.props.width} height={this.props.height} className='captcha-bg'></canvas>
                    <div id="captcha-result" ref={node => this.result = node} className='captcha-result'></div>
                </div>
                <div className='captcha-dragbar'>
                    <div className='drag-track'></div>
                    <div id="drag-slider" ref={node => this.sliderBtn = node} className='drag-slider'></div>
                    <div className='drag-btn'>
                        <i id="drag-btn-close" className='close' />
                        <i id="drag-btn-refresh" className='refresh' />
                    </div>
                </div>
                <canvas ref={node => this.clipCanvas = node} id="captcha-clipcanvas" className='captcha-clipcanvas' />
            </div>
        );
    }
}

export default CaptchaImg;
