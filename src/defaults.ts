import { AxiosRequestConfig } from './types'

// 默认请求配置类型
const defaults: AxiosRequestConfig = {
  method: 'get',
  timeout: 0,
  headers: {
    common: {
      Accept: 'application/json, text/plain, */*'
    }
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
