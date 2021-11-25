// 加载js
export function loadScript(url: string) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        // IE
        if (script.readyState) {
            script.onreadystatechange = function () {
                if (script.readyState == 'loaded' || script.readyState == 'complete') {
                    script.onreadystatechange = null;
                    resolve(null);
                }
            };
        } else {
            //其他浏览器
            script.onload = function () {
                resolve(null);
            };
        }
        script.src = url;
        document.getElementsByTagName('head')[0].appendChild(script);
    });
};

// 加载link
export function loadLink(url: string) {
    const link = document.createElement("link");
    link.setAttribute("rel", "stylesheet");
    link.setAttribute("type", "text/css");
    link.setAttribute("href", url);
    document.getElementsByTagName("head")[0].appendChild(link);
};

// 移除目标script
export function removeScriptItem(url: string) {
    const allScript = document.getElementsByTagName('script');
    for (let i = allScript.length; i >= 0; i--) {
        const element = allScript[i];
        if (element?.getAttribute('src')?.indexOf(url) != -1) {
            element?.parentNode?.removeChild(element);
        }
    }
}

// 移除所有script
export function removeAllScript() {
    const allScript = document.getElementsByTagName('script');
    for (let i = allScript.length; i >= 0; i--) {
        const element = allScript[i];
        element?.parentNode?.removeChild(element);
    }
}

// 移除目标link
export function removeLinkItem(url: string) {
    const allLink = document.getElementsByTagName('link');
    for (let i = allLink.length; i >= 0; i--) {
        const element = allLink[i];
        if (element?.getAttribute('href')?.indexOf(url) != -1) {
            element?.parentNode?.removeChild(element);
        }
    }
}

// 移除所有script
export function removeAllLink() {
    const allLink = document.getElementsByTagName('link');
    for (let i = allLink.length; i >= 0; i--) {
        const element = allLink[i];
        element?.parentNode?.removeChild(element);
    }
}

// 替换成新的js
export function replaceScript(oldUrl: string, newUrl: string) {
    const allScript = document.getElementsByTagName('script');
    for (let i = allScript.length; i >= 0; i--) {
        const elemnt = allScript[i];
        if (elemnt?.getAttribute('src')?.indexOf(oldUrl) != -1) {
            const newElement = document.createElement('script');
            newElement.setAttribute("type", "text/javascript");
            newElement.setAttribute("src", newUrl);
            elemnt?.parentNode?.replaceChild(newElement, elemnt);
        }
    }
}

// 替换成新的link
export function replaceLink(oldUrl: string, newUrl: string) {
    const allLink = document.getElementsByTagName('link');
    for (let i = allLink.length; i >= 0; i--) {
        const elemnt = allLink[i];
        if (elemnt?.getAttribute('href')?.indexOf(oldUrl) != -1) {
            const newElement = document.createElement("link");
            newElement.setAttribute("rel", "stylesheet");
            newElement.setAttribute("type", "text/css");
            newElement.setAttribute("href", newUrl);
            elemnt?.parentNode?.replaceChild(newElement, elemnt);
        }
    }
}



