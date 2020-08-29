// 过渡动画
/**
 * 功能  让盒子水平匀速向指定位置移动后停止动画!
 * @param {DOM对象} ele 目标元素对象
 * @param {Number} target 目标的绝对定位位置
 * @param {Number} step 步长
 * @param {Number} time 时间间隔
 * 步长越短 则过渡越平滑
 * (步长 * 时间)越小 过渡越快
 */
export function animateMove(ele, target, step, time) {
    clearInterval(ele.timeID);
    ele.timeID = setInterval(function () {
        var currentLeft = ele.offsetLeft;
        //  向右运动
        if (currentLeft < target) {
            currentLeft += step;
            ele.style.left = currentLeft + "px";
            if (currentLeft > target) { //边界检测
                ele.style.left = target + "px";
                clearInterval(ele.timeID);
            }
            // 向左运动
        } else {
            currentLeft -= step;
            ele.style.left = currentLeft + "px";
            if (currentLeft <= target) { //边界检测
                ele.style.left = target + "px";
                clearInterval(ele.timeID);
            }
        }
    }, time);
}

/**
* 缓动动画
* @param {DOM 对象} ele 元素对象
* @param {Objet} obj 目标属性对象(如果是位置变换则为绝对定位时的位置)
* @param {Number} base 缓动基准,缓动基准越大,则越平滑,一般为10
* @param {Number} time 时间间隔,时间间隔越短,变换的速率越快.单位ms
* @param {function} callback 回调函数,如果不需要则可以省略
* 步长越多 过度越平滑
* (步长 * 时间)越小 则过渡越快
*/
export function animationSlow(ele, obj, base, time, callback) {
    clearInterval(ele.timeID);
    ele.timeID = setInterval(function () {
        var isAllok = true;
        for (var key in obj) {
            if (key == "opacity") {
                var target = obj[key];
                var current = parseFloat(window.getComputedStyle(ele, null)[key]) * 100;
                var step = (target * 100 - current) / base;
                step = step > 0 ? Math.ceil(step) : Math.floor(step);
                current += step;
                ele.style[key] = current / 100;
                if (current / 100 != target) {
                    isAllok = false;
                }
            } else if (key == "zIndex") {
                ele.style[key] = obj[key];
            } else {
                var target = obj[key];
                var current = parseInt(window.getComputedStyle(ele, null)[key]);
                var step = (target - current) / base;
                step = step > 0 ? Math.ceil(step) : Math.floor(step);
                current += step;
                ele.style[key] = current + "px";
                if (current != target) {
                    isAllok = false;
                }
            }
        }
        if (isAllok == true) {
            clearInterval(ele.timeID);
            if (typeof callback == "function") {
                callback();
            }
        }
    }, time);
}
