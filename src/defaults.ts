import { AxiosRequestConfig } from './types'
import { processHeaders } from './helpers/headers'
import { transformRequest, transformReponse } from './helpers/data'

// 默认请求配置类型
const defaults: AxiosRequestConfig = {
  method: 'get',
  timeout: 0,
  headers: {
    common: {
      Accept: 'application/json, text/plain, */*'
    }
  },
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  transformRequest: [
    function(data: any, headers: any): any {
      // 先处理headers再返回处理后的请求数据
      processHeaders(headers, data)
      return transformRequest(data)
    }
  ],
  transformReponse: [
    function(data: any): any {
      // 直接返回处理后的响应数据
      return transformReponse(data)
    }
  ],

  validateStatus(status: number): boolean {
    return status >= 200 && status < 300
  }
}

// 没有请求数据的方法
const methodsNoData = ['delete', 'get', 'head', 'options']
// 在headers中添加方法对应的空对象
methodsNoData.forEach(method => {
  defaults.headers[method] = {}
})

// 带请求数据的方法
const methodsWithData = ['post', 'put', 'patch']

// 在headers中添加方法对应的Content-Type
methodsWithData.forEach(method => {
  defaults.headers[method] = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

export default defaults
