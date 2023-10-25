/**
 * 截取视频帧
*/
export function getVideoBase64(url: string, currentTime = 0.1) {
  return new Promise(function (resolve, reject) {
    let dataURL = ''
    let video = document.createElement('video')
    video.setAttribute('src', url)
    // 处理跨域
    video.setAttribute('crossOrigin', 'anonymous');
    // 自动加载
    video.setAttribute('autoplay', "true");
    video.setAttribute('muted', "true");
    // 行内播放
    video.setAttribute('playsinline', "true");
    video.setAttribute('webkit-playsinline', "true");
    video.setAttribute('width', "10");
    video.setAttribute('height', "10");
    video.currentTime = currentTime;
    video.addEventListener('loadeddata', function (e: any) {
      setTimeout(() => {
        let canvas = document.createElement('canvas')
        let width = e.target.videoWidth; // 视频的宽高
        let height = e.target.videoHeight;
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext('2d');
        context?.drawImage(video, 0, 0, width, height) // 绘制canvas
        dataURL = canvas.toDataURL('image/jpeg') // 转换为base64
        resolve(dataURL)
      }, 100)
    });
    // 视频加载错误时
    video.addEventListener('error', function (e) {
      reject();
      console.log(e)
    });
  })
}
