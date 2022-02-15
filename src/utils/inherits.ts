/**
 * 这个方法用来实现类继承
 * @param {function} subClass 待继承的子类
 * @param {function} superClass 待被继承的父类
 * @exception {Error} 参数不合法时抛出异常
 */
export default function inherits(subClass: any, superClass: any) {
  if (arguments.length !== 2) {
    throw new Error("必须明确的指定子类和父类");
  }
  for (let i = 0, n = arguments.length; i < n; i++) {
    if (typeof arguments[i] !== "function") {
      throw new Errorr("所给的子类和父类必须都是function");
    }
  }

  // const oSuper = new superClass();
  // for (let key in oSuper) {
  //   if (!subClass.prototype[key]) {
  //     subClass.prototype[key] = oSuper[key];
  //   }
  // }
  
  subClass.prototype = superClass.prototype;
  subClass.prototype.constructor = subClass;
};
