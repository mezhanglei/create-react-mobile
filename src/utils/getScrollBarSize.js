// 获取滚动条宽度
let cached;
export default function getScrollBarSize(fresh) {
    if (typeof document === 'undefined') {
        return 0;
    }
    //一个div没有滚动条的,获取其宽度,然后再让其拥有滚动条,在获取宽度,取差值
    if (fresh || cached === undefined) {
        let box = document.createElement("div");
        box.style.cssText = "position:absolute; top:-1000px; width:100px; height:100px; overflow:hidden;";
        const noScroll = document.body.appendChild(box).clientWidth;
        box.style.overflowY = "scroll";
        const scroll = box.clientWidth;
        document.body.removeChild(box);
        return noScroll - scroll;
    }
    return cached;
}
