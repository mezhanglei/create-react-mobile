import { dataURLtoFile, binaryToDataURL } from "./file";

export interface PressImg {
    file: File; // 文件类型的数据
    width?: number; // 宽
    fileName?: string; // 文件名
    quality?: number; // 压缩图片程度, 默认0.92
}
// canvas压缩图片, 返回promise, 可以得到dataURL类型数据
export function pressImg(param: PressImg): Promise<{data: string} | null> {
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
        binaryToDataURL(param.file, function (base64: string) {
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
