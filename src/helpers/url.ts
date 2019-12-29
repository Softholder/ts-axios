import { isDate, isPlainObject } from './util'

interface URLOrigin {
  protocol: string
  host: string
}

// 编码函数
function encode(val: string): string {
  return (
    encodeURIComponent(val)
      // 特殊字符不编码
      .replace(/%40/g, '@')
      .replace(/%3A/gi, ':')
      .replace(/%24/g, '$')
      // 编码后含字母的替换时不区分大小写，空格转为+
      .replace(/%2C/gi, ',')
      .replace(/%20/g, '+')
      .replace(/%5B/gi, '[')
      .replace(/%5D/gi, ']')
  )
}

export function buildURL(url: string, params?: any): string {
  // 如果params不存在，直接返回url
  if (!params) {
    return url
  }

  // 保存params键值对的数组
  const parts: string[] = []

  // 遍历params对象的键
  Object.keys(params).forEach(key => {
    // 获取键对应的值
    const val = params[key]
    // 若值为null或者undefined不往键值对数组中存，直接进入下一次循环
    if (val === null || typeof val === 'undefined') {
      return
    }
    // 临时数组
    let values = []
    if (Array.isArray(val)) {
      // 若值为数组，将其赋值给临时数组
      values = val
      // 将键处理为'key[]'的格式
      key += '[]'
    } else {
      // 若值不为数组，将其处理为数组
      values = [val]
    }
    values.forEach(val => {
      if (isDate(val)) {
        // 由于使用了类型谓词，编辑器会提示toISOString方法
        // 如果值是Date对象转换为ISOString
        val = val.toISOString()
      } else if (isPlainObject(val)) {
        // 如果是对象转换为JSON字符串
        val = JSON.stringify(val)
      }
      // 将键值对编码后存入数组
      parts.push(`${encode(key)}=${encode(val)}`)
    })
  })

  // 将键值对数组处理为由&连接的字符串
  let serializedParams = parts.join('&')

  if (serializedParams) {
    // 忽略hash
    const markIndex = url.indexOf('#')
    if (markIndex !== -1) {
      url = url.slice(0, markIndex)
    }
    // 若url中不含?则拼接?否则拼接&，?表示为query
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams
  }

  return url
}

// 判断URL是否同源
export function isURLSameOrigin(requestURL: string): boolean {
  // 解析传入的URL
  const parsedOrigin = resolveURL(requestURL)
  // 判断传入的URL与当前页面URL的协议和域名是否相同
  return (
    parsedOrigin.protocol === currentOrigin.protocol && parsedOrigin.host === currentOrigin.host
  )
}

// 创建一个a标签并获取其dom节点
const urlParsingNode = document.createElement('a')
// 获取当前页面的源
const currentOrigin = resolveURL(window.location.href)

// 解析URL的协议和域名
function resolveURL(url: string): URLOrigin {
  // 设置a标签的dom节点的href值
  urlParsingNode.setAttribute('href', url)
  // 通过结构获得协议和域名
  const { protocol, host } = urlParsingNode

  return {
    protocol,
    host
  }
}
