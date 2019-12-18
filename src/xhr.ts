import { AxiosRequestConfig } from './types'

export default function xhr(config: AxiosRequestConfig): void {
  const { data = null, url, method = 'get' } = config

  const request = new XMLHttpRequest()

  // 默认async参数为true，即异步请求
  request.open(method.toUpperCase(), url, true)

  request.send(data)
}
