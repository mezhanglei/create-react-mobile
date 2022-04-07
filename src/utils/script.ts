// 加载js
export function loadScript(url: string) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    // IE
    if (script.readyState) {
      script.onreadystatechange = function (event) {
        if (script.readyState == 'loaded' || script.readyState == 'complete') {
          script.onreadystatechange = null;
          resolve(event);
        }
      };
    } else {
      //其他浏览器
      script.onload = function (event) {
        resolve(event);
      };
    }
    script.src = url;
    document.getElementsByTagName('head')[0].appendChild(script);
  });
};

// 加载link(加载完成各个浏览器实现不一样)
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



