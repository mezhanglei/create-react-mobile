import { formatNumber, getPower } from "./number";
import { isBlob, isArrayBuffer } from "./type";
import { saveAs } from 'file-saver';

// === 格式转换 ===

// base64转Arraybuffer
export function base64ToArrayBuffer(data: string) {
  if (!data) return;
  const stringBase64 = data.split(',')[1];
  // 解码
  let byteString;
  if (typeof window !== 'undefined') {
    byteString = window.atob(stringBase64);
  } else {
    // arrayBuffer视图
    byteString = new Buffer(stringBase64, 'base64').toString('binary');
  }
  // 生成内存的视图，通过TypeArray对象操作二进制
  const len = byteString.length;
  const bytes = new Uint8Array(len);
  // 遍历二进制数据通过typeArray对象将数据存储到arrayBuffer对象中
  for (let i = 0; i < len; i++) {
    bytes[i] = byteString.charCodeAt(i);
  }
  return bytes.buffer;
};

// base64转Blob
export function base64ToBlob(data: string) {
  if (!data) return;
  const arrayBuffer = base64ToArrayBuffer(data);
  //获取MIME类型
  const mime = data.split(',')[0].split(':')[1].split(';')[0];
  if (arrayBuffer) {
    return new Blob([arrayBuffer], { type: mime });
  }
}

// base64转File
export function base64ToFile(data: string, filename: string) {
  if (!data) return;
  const arrayBuffer = base64ToArrayBuffer(data);
  //获取MIME类型
  const mime = data.split(',')[0].split(':')[1].split(';')[0];
  if (arrayBuffer) {
    return new File([arrayBuffer], filename, { type: mime });
  }
}

// blob/file转base64
export function fileToBase64(data: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      resolve(<string>e?.target?.result);
    };
    // readAsDataURL
    fileReader.readAsDataURL(data);
    fileReader.onerror = () => {
      reject(new Error('file to Base64 error'));
    };
  });
}

/**
 * arraybuffer转换为字符串
 * @param {*} data arrayBuffer类型
 * Unicode：编码统一所有语言编码，但是存储运输不方便
 * utf-8：将Unicode编码转换为可变长编码，利如传输存储
 */
export function arraybufferToString(data: ArrayBuffer) {
  if (!isArrayBuffer(data)) return;
  // 从arrayBuffer中处理中文乱码
  if ('TextDecoder' in window) {
    // utf-8解码
    const enc = new TextDecoder('utf-8');
    return enc.decode(new Uint8Array(data));
  } else {
    // Unicode解码
    const result = new Uint8Array(data);
    return String.fromCharCode(...result);
  }
}

// === 文件导出 ==

/**
* 表单方式方式（post请求）导出文件的方法
* 1. 无法知道进度
* 2. 无法直接下载浏览器可直接预览的文件类型(如txt、png、jpg、gif等)
* 3. 兼容性好，不会出现URL长度限制问题
* @param {string} url 请求接口
* @param {object} params 请求参数 (需要看前后端的参数约定)
*/
export function formExportFile(url: string, params = {}) {
  //创建隐藏的表单
  let form = document.createElement('form');
  form.style.display = 'none';
  form.action = url;
  form.method = 'post';
  document.body.appendChild(form);
  //创建隐藏的控件
  for (let key of Object.keys(params)) {
    let input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    input.value = params[key];
    form.appendChild(input);
  }
  //提交表单
  form.submit();
  //移除表单
  form.remove();
}


/**
 * 下载二进制文件流(ajax请求需设置responseType: "blob"或"arraybuffer")
 * @param {Blob} data 二进制数据 必填
 * @param {string} 文件名及后缀
 */
export function saveAsBinary(data: Blob, filename: string) {
  if (!filename) {
    console.error("please set file name");
  }

  const blob = isBlob(data) ? data : (isArrayBuffer(data) ? new Blob([data]) : null);
  if (!blob) return;
  const link = document.createElement('a');
  const href = window.URL.createObjectURL(blob);
  link.href = href;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(link.href);
}

/**
 * ajax读取txt文件(本地或远程)
 * @param {string} url 路径
 */
export function readTxt(url: string) {
  let xhr = new XMLHttpRequest();
  let okStatus = document.location.protocol === "file:" ? 0 : 200;
  xhr.open('GET', url, false);
  // 强制解析为text/html
  xhr.overrideMimeType("text/html;charset=utf-8");
  xhr.send(null);
  return xhr.status === okStatus ? xhr.responseText : null;
}

// 格式化返回文件大小
export const formatFileSize = (size?: number, unitStr?: string) => {
  if (!size) return;
  const unitByPower = {
    1: "B",
    2: "KB",
    3: "MB",
    4: "GB"
  };
  const powerByUnit = Object.entries(unitByPower).reduce((acc, [k, v]) => ({ ...acc, [v]: k }), {});
  if (unitStr) {
    const power = powerByUnit[unitStr];
    const result = formatNumber(size / Math.pow(10, power), 2);
    return result + unitStr;
  } else {
    const power = getPower(size);
    const unit = unitByPower[power];
    const result = formatNumber(size / Math.pow(10, power), 2);
    return result + unit;
  }
};

// 保存文件
export const saveAsFile = (fileContent: string | File, fileName: string) => {
  const fileBlob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
  saveAs(fileBlob, fileName);
};
