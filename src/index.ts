import { AxiosRequestConfig } from './types'
import xhr from './xhr'
import { buildURL } from './helpers/url'

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
}

// 处理url及params的函数
function transformURL(config: AxiosRequestConfig): string {
  const { url, params } = config
  return buildURL(url, params)
}

export default axios
