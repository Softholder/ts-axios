import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from './types'
import { parseHeaders } from './helpers/header'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  // 返回Promise对象，使得调用时可以使用then方法
  return new Promise(resolve => {
    const { data = null, url, method = 'get', headers, responseType } = config

    const request = new XMLHttpRequest()
    // 若请求配置中responseType存在，将其赋值给请求头
    if (responseType) {
      request.responseType = responseType
    }

    // 默认async参数为true，即异步请求
    request.open(method.toUpperCase(), url, true)

    request.onreadystatechange = function handleLoad() {
      // readyState为4表示能正确接收，不是4直接return
      if (request.readyState !== 4) {
        return
      }
      // 解析响应头
      const responseHeaders = parseHeaders(request.getAllResponseHeaders())
      // 响应数据
      const responseData = responseType !== 'text' ? request.response : request.responseText
      const response: AxiosResponse = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request
      }
      resolve(response)
    }

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
  })
}
