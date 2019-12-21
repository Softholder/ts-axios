import { AxiosRequestConfig } from './types'
import xhr from './xhr'
import { buildURL } from './helpers/url'
import { transformRequest } from './helpers/data'
import { processHeaders } from './helpers/header'

// config为配置包含method,url,params等
// 通过AxiosRequestConfig接口来约束config的类型
function axios(config: AxiosRequestConfig): void {
  // 先将config处理完毕再通过AJAX发送
  processConfig(config)
  xhr(config)
}

// 处理config中的url，params
function processConfig(config: AxiosRequestConfig): void {
  config.url = transformURL(config)
  // 要先处理headers，避免transformRequestData将其转换为JSON字符串
  config.headers = transformHeaders(config)
  config.data = transformRequestData(config)
}

// 处理url及params的函数
function transformURL(config: AxiosRequestConfig): string {
  const { url, params } = config
  return buildURL(url, params)
}

function transformRequestData(config: AxiosRequestConfig): any {
  return transformRequest(config.data)
}

function transformHeaders(config: AxiosRequestConfig): any {
  // 不传headers时，默认为空对象（类型设置为普通对象才能继续后续逻辑）
  const { headers = {}, data } = config
  return processHeaders(headers, data)
}

export default axios
