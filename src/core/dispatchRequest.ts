// 定义axios
import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import xhr from './xhr'
import { buildURL } from '../helpers/url'
import { transformRequest, transformReponse } from '../helpers/data'
import { processHeaders, flattenHeaders } from '../helpers/header'

// config为配置包含method,url,params等
// 通过AxiosRequestConfig接口来约束config的类型
export default function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
  // 先将config处理完毕再通过AJAX发送
  // 调用完xhr后对响应数据再做一次处理
  processConfig(config)
  // 在dispatchRequest函数中将请求config处理为响应res
  return xhr(config).then(res => {
    return transformResponseData(res)
  })
}

// 处理config中的url，params,data
function processConfig(config: AxiosRequestConfig): void {
  config.url = transformURL(config)
  // 要先处理headers，避免transformRequestData将其转换为JSON字符串
  config.headers = transformHeaders(config)
  config.data = transformRequestData(config)
  // 把headers中需要的属性值提取出来，不需要的删除
  config.headers = flattenHeaders(config.headers, config.method!)
}

// 处理url及params的函数
function transformURL(config: AxiosRequestConfig): string {
  const { url, params } = config
  return buildURL(url!, params)
}

function transformRequestData(config: AxiosRequestConfig): any {
  return transformRequest(config.data)
}

function transformHeaders(config: AxiosRequestConfig): any {
  // 不传headers时，默认为空对象（类型设置为普通对象才能继续后续逻辑）
  const { headers = {}, data } = config
  return processHeaders(headers, data)
}

// 将响应中的数据做处理，JSON字符串默认解析为对象
function transformResponseData(res: AxiosResponse): AxiosResponse {
  res.data = transformReponse(res.data)
  return res
}
