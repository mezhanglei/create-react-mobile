// 获取视频时长
export function getVideoDuration(file: File | string) {
  return new Promise((resolve, reject) => {
    let audioElement: HTMLAudioElement;
    let url: string;
    if (typeof file == 'string') {
      audioElement = new Audio();
      audioElement.src = file
    } else {
      url = window.URL.createObjectURL(file);
      audioElement = new Audio(url);
    }

    audioElement.addEventListener("loadedmetadata", function () {
      let duration = audioElement.duration;
      // console.log("视频时长", duration);
      window.URL.revokeObjectURL(url);
      resolve(duration)
    });
  })
}