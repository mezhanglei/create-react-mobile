
/**
 * requestAnimationFrame兼容写法，用于执行动画操作，类似于setTimeout，但是只在显示频率刷新时候执行，递归调用时显示的刷新频率是一致
 */
let lastTime = 0;

let setAnimation = (callback) => {
    const currTime = new Date().getTime();
    const timeInterval = Math.max(0, 16.7 - (currTime - lastTime));
    const id = window.setTimeout(() => {
        callback(currTime + timeInterval);
    }, timeInterval);
    lastTime = currTime + timeInterval;
    return id;
};

let cancelAnimation = (id) => {
    return clearTimeout(id);
};

if (typeof window !== 'undefined' && 'requestAnimationFrame' in window) {
    setAnimation = (callback) => {
        return window.requestAnimationFrame(callback);
    };

    cancelAnimation = (id) => {
        return window.cancelAnimationFrame(id);
    };
}

export default { setAnimation, cancelAnimation };
