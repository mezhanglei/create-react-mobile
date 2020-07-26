import { dataURLtoFile, blobToDataURL } from "./file";
/**
* canvas压缩图片, 返回file类型二进制文件流
* @param {参数obj} param 
* @param {文件二进制流} param.file 必传
* @param {目标压缩大小} param.targetSize 不传初始赋值-1
* @param {输出图片宽度} param.width 不传初始赋值-1
* @param {输出图片名称} param.fileName 不传初始赋值new Date().toString()时间字符串
* @param {压缩图片程度} param.quality 不传初始赋值0.92。值范围0~1
* @param {回调函数} param.succ 必传
*/
export function pressImg(param) {
    //如果没有回调函数就不执行
    if (param && param.succ) {
        //如果file没定义返回null
        if (param.file == undefined) return param.succ(null);
        //给参数附初始值
        param.targetSize = param.hasOwnProperty("targetSize") ? param.targetSize : -1;
        param.width = param.hasOwnProperty("width") ? param.width : -1;
        param.fileName = param.hasOwnProperty("fileName") ? param.fileName : new Date().toString();
        param.quality = param.hasOwnProperty("quality") ? param.quality : 0.92;
        // 得到文件类型
        const fileType = param.file.type;
        if (fileType.indexOf("image") == -1) {
            console.error('请选择图片文件');
            return param.succ(null);
        }
        // 如果当前size比目标size小，直接输出
        const size = param.file.size;
        if (param.targetSize > size) {
            return param.succ(param.file);
        }
        // 读取file文件,得到的结果为base64位
        blobToDataURL(param.file, function (base64) {
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
                    //将base64转化成file流以便获取size
                    const resultFile = dataURLtoFile(newImageData, param.fileName);
                    //判断如果targetSize有限制且压缩后的图片大小比目标大小大，就弹出错误
                    if (param.targetSize != -1 && param.targetSize < resultFile.size) {
                        console.error("图片上传尺寸太大，请手动压缩后重新上传^_^");
                        param.succ(null);
                    } else {
                        //返回文件流
                        param.succ(resultFile);
                    }
                };
            }
        });
    }
}
