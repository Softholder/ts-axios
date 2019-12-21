// 缓存Object.prototype.toString
const toString = Object.prototype.toString

// 使用类型谓词的方式进行类型保护，使得其参数具有对应对象上的方法
// 是否为Date对象
export function isDate(val: any): val is Date {
  return toString.call(val) === '[object Date]'
}

// 是否为Object
// export function isObject(val: any): val is Object {
//   // typeof null === 'object'为true，需要先判断不是null
//   return val !== null && typeof val === 'object'
// }

// 是否为普通对象（不包含ArrayBuffer,Blob等）
export function isPlainObject(val: any): val is Object {
  return toString.call(val) === '[object Object]'
}
