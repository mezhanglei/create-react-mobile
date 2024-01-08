import CryptoJS from 'crypto-js';

//十六位十六进制数作为密钥
const key = CryptoJS.enc.Utf8.parse('0123456789ABCDEF');
//十六位十六进制数作为密钥偏移量
const iv = CryptoJS.enc.Utf8.parse('1234567812345678');
// 加密配置
const ECBconfig = { iv, mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 };

const handleCrypt = {
  // aes加密(cbc)
  encrypt(word: string | number) {
    // 字符串—> WordArray对象
    const srcs = CryptoJS.enc.Utf8.parse(word);
    const encrypted = CryptoJS.AES.encrypt(srcs, key, ECBconfig);
    return encrypted.toString();
  },
  // aes解密(cbc)
  decrypt(word: string | number) {
    // 加密字符串 -> 密码对象
    const decrypt = CryptoJS.AES.decrypt(word, key, ECBconfig);
    // 密码对象 -> utf8字符串
    return CryptoJS.enc.Utf8.stringify(decrypt).toString();
  },
  // aes + base64加密(cbc)
  encryptWithBase64(word: string | number) {
    // 字符串 —> WordArray对象
    const srcs = CryptoJS.enc.Utf8.parse(word);
    // WordArray对象 —> 密码对象
    const encrypted = CryptoJS.AES.encrypt(srcs, key, ECBconfig);
    // 密码对象 -> Base64编码字符串
    return encrypted.ciphertext.toString().toUpperCase();
  },
  // aes + base64解密(cbc)
  decryptWithBase64(word: string) {
    // 字符串 —> WordArray对象
    let encryptedHexStr = CryptoJS.enc.Hex.parse(word);
    // WordArray对象—> Base64字符串
    let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
    // base64字符串 -> 密码对象
    let decrypt = CryptoJS.AES.decrypt(srcs, key, ECBconfig);
    // 密码对象 -> utf8字符串
    return CryptoJS.enc.Utf8.stringify(decrypt).toString();
  }
};

export default handleCrypt;
