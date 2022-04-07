/**
 * 将一个对象里的参数以query参数拼接到目标url上
 * @param {*} url 目标url， 默认当前url
 * @param {*} query 参数对象
 */
export function setUrlQuery(query: object, url = location.href) {
  if (!url) return "";
  url = url?.lastIndexOf('&') === url?.length - 1 ? url.substring(0, url?.length - 1) : url;
  if (query) {
    let queryArr = [];
    for (const key in query) {
      if (query.hasOwnProperty(key)) {
        queryArr.push(`${key}=${query[key]}`);
      }
    }
    if (url.indexOf("?") !== -1) {
      url = `${url}&${queryArr.join("&")}`;
    } else {
      url = `${url}?${queryArr.join("&")}`;
    }
  }
  return url;
}

/**
 * 删除url中指定的query参数
 * @param {str} url 指定的url, 默认当前url
 * @param {str} name 要删除的指定的query参数名
 */
export function delUrlQuery(name: string, url = location.href) {
  let urlArr = url.split("?");
  if (urlArr.length > 1 && urlArr[1].indexOf(name) > -1) {
    let query = urlArr[1];
    let obj = {};
    let arr = query.split("&");
    for (let i = 0; i < arr.length; i++) {
      arr[i] = arr[i].split("=");
      obj[arr[i][0]] = arr[i][1];
    }
    delete obj[name];
    let resultUrl =
      urlArr[0] +
      "?" +
      JSON.stringify(obj)
        .replace(/[\"\{\}]/g, "")
        .replace(/\:/g, "=")
        .replace(/\,/g, "&");
    return resultUrl;
  } else {
    return url;
  }
}

/**
 * 根据参数名从而获取query参数的参数值
 * @param {*} name 目标参数的key
 */
export function getUrlQuery(name: string, url = location.href) {
  let urlArr = url.split("?");
  if (urlArr.length > 1 && urlArr[1].indexOf(name) > -1) {
    let query = urlArr[1];
    let obj = {};
    let arr = query.split("&");
    for (let i = 0; i < arr.length; i++) {
      arr[i] = arr[i].split("=");
      obj[arr[i][0]] = arr[i][1];
    }
    return decodeURIComponent(obj[name]);
  } else {
    return null;
  }
}

// 获取url中的相对路径
export function GetUrlRelativePath(url: string) {
  const arrUrl = url.split("//");
  const start = arrUrl[1].indexOf("/");
  let relUrl = arrUrl[1].substring(start);
  if (relUrl.indexOf("?") != -1) {
    relUrl = relUrl.split("?")[0];
  }
  return relUrl;
};
