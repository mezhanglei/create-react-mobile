import { fileToBase64 } from "./file";
import { isBase64 } from "./type";

// 根据图片路径转化为base64
export function imgUrlToBase64(url: string, options?: { width: number, quality?: number }): Promise<string> {
  return new Promise((resolve) => {
    if (isBase64(url)) {
      resolve(url);
      return;
    }
    const width = options?.width;
    const quality = options?.quality ?? 0.92;
    const image = new Image();
    image.setAttribute('crossOrigin', 'Anonymous');
    image.src = url + '?tamp=' + (new Date()).valueOf();
    image.onload = function () {
      const canvas = document.createElement('canvas');
      const scale = image.width / image.height;
      canvas.width = width ?? image.width;
      canvas.height = width ? Math.floor(width / scale) : image.height;
      const context = canvas.getContext('2d');
      context?.clearRect(0, 0, canvas.width, canvas.height);
      context?.drawImage(image, 0, 0, canvas.width, canvas.height);
      const ext = image.src.substring(image.src.lastIndexOf('.') + 1).toLowerCase();
      const result = canvas.toDataURL("image/" + ext, quality);
      resolve(result);
    };
  });
}

export interface PressImg {
  file: File; // 文件类型的数据
  width?: number; // 宽
  quality?: number; // 压缩图片程度, 默认0.92
}
// canvas压缩图片, 返回promise, 可以得到dataURL类型数据
export function pressImg(param: PressImg): Promise<string | null> {
  return new Promise(async (resolve, reject) => {
    const width = param?.width ?? -1;
    const quality = param?.quality ?? 0.92;
    const fileType = param?.file?.type;
    const file = param?.file;
    //如果file没定义返回null
    if (!file || fileType.indexOf("image") == -1) return resolve(null);
    try {
      // 转为base64
      const base64 = await fileToBase64(file);
      // 压缩base64
      const pressBase64 = await imgUrlToBase64(base64, { width, quality });
      resolve(pressBase64);
    } catch (error) {
      reject(error);
    }
  });
}

export function getImageWH(url?: string) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.setAttribute('crossOrigin', 'Anonymous');
    image.src = url + '?tamp=' + (new Date()).valueOf();
    image.onload = () => {
      resolve({ width: image.width, height: image.height });
    }
  })
}

