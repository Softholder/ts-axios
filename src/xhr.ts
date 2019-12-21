import { AxiosRequestConfig } from './types'

export default function xhr(config: AxiosRequestConfig): void {
  const { data = null, url, method = 'get', headers } = config

  const request = new XMLHttpRequest()

  // 默认async参数为true，即异步请求
  request.open(method.toUpperCase(), url, true)

  Object.keys(headers).forEach(name => {
    // 当data为null时不设置content-type
    if (data === null && name.toLocaleLowerCase() === 'content-type') {
      delete headers[name]
    } else {
      // 根据传入的配置参数设置请求头格式
      request.setRequestHeader(name, headers[name])
    }
  })

  request.send(data)
}
