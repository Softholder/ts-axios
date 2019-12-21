import { isPlainObject } from './util'

export function transformRequest(data: any): any {
  // 若为普通对象，返回JSON字符串
  if (isPlainObject(data)) {
    return JSON.stringify(data)
  }
  // 否则原样返回
  return data
}
