
import Fingerprint2 from "fingerprintjs2";

// 浏览器指纹

// 执行获取浏览器指纹的方法
export function getFinger() {
    return new Promise(resolve => {
        // 浏览器空闲时
        if (window.requestIdleCallback) {
            requestIdleCallback(function () {
                createFinger((data) => {
                    resolve(data);
                });
            });
        } else {
            // 或者延迟获取
            setTimeout(function () {
                createFinger((data) => {
                    resolve(data);
                });
            }, 500);
        }
    });
};

/**
 * 创建浏览器指纹
 * 优点：重复率低，收集目标组件配置化
 * 缺点：可能受某些因素影响不稳定，另外指纹是会出现重复的，可自行添加特征参数，比如ip等等
 * @param {*} callBack 获取浏览器指纹的回调
 */
export function createFinger(callBack: (data: string) => void) {
    // 排除作为指纹参考的组件，因为不稳定的选项会导致指纹不稳定，所以排除掉
    let excludes = {
        language: true,
        colorDepth: true,
        deviceMemory: true,
        pixelRatio: true,
        availableScreenResolution: true,
        timezoneOffset: true,
        timezone: true,
        sessionStorage: true,
        localStorage: true,
        indexedDb: true,
        addBehavior: true,
        openDatabase: true,
        cpuClass: true,
        doNotTrack: true,
        plugins: true,
        canvas: true,
        webglVendorAndRenderer: true,
        adBlock: true,
        hasLiedLanguages: true,
        hasLiedResolution: true,
        hasLiedOs: true,
        hasLiedBrowser: true,
        touchSupport: true,
        audio: false,
        enumerateDevices: true,
        hardwareConcurrency: true
    };
    let options = { excludes: excludes };
    Fingerprint2.get(options, function (components) {
        // components.push({
        //     // 可以在这里添加特征参数，降低重复用户
        // });
        // components为获取到的设备相关的信息列表
        const values = components.map(function (component) {
            return component.value;
        });
        // 创建hash指纹
        const murmur = Fingerprint2.x64hash128(values.join(''), 31);
        callBack(murmur);
    });
}
