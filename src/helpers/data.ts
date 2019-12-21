import { isPlainObject } from './util'

export function transformRequest(data: any): any {
  // 若为普通对象，返回JSON字符串
  if (isPlainObject(data)) {
    return JSON.stringify(data)
  }
  // 否则原样返回
  return data
}

export function transformReponse(data: any): any {
  // 不一定是JSON字符串，用try catch包裹起来
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data)
    } catch (e) {
      // do nothing
    }
  }
  // 如果JSON解析不成功原样输出
  return data
}
