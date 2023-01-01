import * as devalue from 'devalue'
import { isEmpty } from './type'

// 将对象转化为json字符串
export function toJSON(val: any) {
  if (isEmpty(val)) return;
  try {
    return devalue.stringify(val)
  } catch (e) {
    console.error(e)
  }
}

// 解析json字符串
export function parseJSON(val: string) {
  if (isEmpty(val)) return;
  try {
    return devalue.parse(val)
  } catch (e) {
    console.error(e)
  }
}

// 将对象转化为普通字符串(非json格式)
export function toStringify(val: any) {
  if (isEmpty(val)) return;
  try {
    return devalue.uneval(val)
  } catch (e) {
    console.error(e)
  }
}

// 将普通字符串转化为js(非json格式)
export function parseStringify(val: string) {
  if (isEmpty(val)) return;
  try {
    return eval(`(function(){return ${val} })()`)
  } catch (e) {
    console.error(e)
  }
}