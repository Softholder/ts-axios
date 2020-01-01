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

// 判断是否为FormData类型
export function isFormData(val: any): val is FormData {
  return typeof val !== 'undefined' && val instanceof FormData
}

// 判断是否为URLSearchParams类型(queryString序列化之后的类型)
export function isURLSearchParams(val: any): val is URLSearchParams {
  return typeof val !== 'undefined' && val instanceof URLSearchParams
}

export function extend<T, U>(to: T, from: U): T & U {
  for (const key in from) {
    // to断言为T & U类型以便赋值，括号开始前须有;
    ;(to as T & U)[key] = from[key] as any
  }
  return to as T & U
}

// 对象深拷贝函数
export function deepMerge(...objs: any[]): any {
  const result = Object.create(null)

  // 遍历参数
  objs.forEach(obj => {
    if (obj) {
      Object.keys(obj).forEach(key => {
        const val = obj[key]
        // 若参数的值仍为对象进行递归处理
        if (isPlainObject(val)) {
          // 结果中存在相同的key且其值为对象则再次合并
          if (isPlainObject(result[key])) {
            result[key] = deepMerge(result[key], val)
          } else {
            // 不为对象则直接保存递归结果
            result[key] = deepMerge(val)
          }
        } else {
          // 参数的值不为对象就直接保存至结果中
          result[key] = val
        }
      })
    }
  })

  return result
}
