import CryptoJS from 'crypto-js'

export const handleCrypt = {
  // 加密
  encrypt(word, keyStr) {
    keyStr = keyStr || '_fuyuanai@Maige_'
    const key = CryptoJS.enc.Utf8.parse(keyStr) // Latin1 w8m31+Yy/Nw6thPsMpO5fg==
    const srcs = CryptoJS.enc.Utf8.parse(word)
    const encrypted = CryptoJS.AES.encrypt(srcs, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
    return encrypted.toString();
  },
  // 解密
  decrypt(word, keyStr) {
    keyStr = keyStr || '_fuyuanai@Maige_'
    const key = CryptoJS.enc.Utf8.parse(keyStr) // Latin1 w8m31+Yy/Nw6thPsMpO5fg==
    const decrypt = CryptoJS.AES.decrypt(word, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 })
    return CryptoJS.enc.Utf8.stringify(decrypt).toString();
  },
}