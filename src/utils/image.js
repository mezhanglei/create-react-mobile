import { dataURLtoFile, binaryToDataURL } from "./file";
/**
* canvas压缩图片, 返回promise, 可以得到dataURL类型数据
* @param {参数obj} param 
* @param {文件二进制流} param.file 必传
* @param {输出图片宽度} param.width 不传初始赋值-1
* @param {输出图片名称} param.fileName 不传初始赋值new Date().toString()时间字符串
* @param {压缩图片程度} param.quality 不传初始赋值0.92。值范围0~1
*/
export function pressImg(param) {
    return new Promise((resolve, reject) => {
        //如果file没定义返回null
        if (param.file == undefined) return resolve(null);
        param.width = param.hasOwnProperty("width") ? param.width : -1;
        param.fileName = param.hasOwnProperty("fileName") ? param.fileName : new Date().toString();
        param.quality = param.hasOwnProperty("quality") ? param.quality : 0.92;
        // 得到文件类型
        const fileType = param.file.type;
        if (fileType.indexOf("image") == -1) {
            console.error('请选择图片文件');
            return resolve(null);
        }
        // 读取file文件,得到的结果为base64位
        binaryToDataURL(param.file, function (base64) {
            if (base64) {
                let image = new Image();
                image.src = base64;
                image.onload = function () {
                    // 获得原始长宽比例
                    const scale = this.width / this.height;
                    //创建一个canvas
                    let canvas = document.createElement('canvas');
                    //获取上下文
                    let context = canvas.getContext('2d');
                    //获取压缩后的图片宽度,如果width为-1，默认原图宽度
                    canvas.width = param.width == -1 ? this.width : param.width;
                    //获取压缩后的图片高度,如果width为-1，默认原图高度
                    canvas.height = param.width == -1 ? this.height : parseInt(param.width / scale);
                    // 清除画布
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    //把图片绘制到canvas上面
                    context.drawImage(image, 0, 0, canvas.width, canvas.height);
                    //压缩图片，获取到新的base64 dataUrl
                    const newImageData = canvas.toDataURL(fileType, param.quality);
                    resolve({ data: newImageData });
                };
            }
        });
    })
}
