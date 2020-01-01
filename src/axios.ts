import { AxiosRequestConfig, AxiosStatic } from './types'
import Axios from './core/Axios'
import { extend } from './helpers/util'
import defaults from './defaults'
import mergeConfig from './core/mergeConfig'
import CancelToken from './cancel/CancelToken'
import Cancel, { isCancel } from './cancel/Cancel'
import { createDiffieHellman } from 'crypto'

function createInstance(config: AxiosRequestConfig): AxiosStatic {
  const context = new Axios(config)
  // 将instance指定为Axios原型上的request方法且绑定this为context,因为request内部会访问this
  const instance = Axios.prototype.request.bind(context)
  // 将context上所有的属性及方法全部拷贝到instance上
  extend(instance, context)
  // 返回instance得到混合对象，同时具有Axios类的属性方法和Axios原型上的request方法
  return instance as AxiosStatic
}

// 创建axios实例时传入默认配置
const axios = createInstance(defaults)

axios.create = function create(config) {
  return createInstance(mergeConfig(defaults, config))
}

axios.CancelToken = CancelToken
axios.Cancel = Cancel
axios.isCancel = isCancel

// axios是AxiosStatic类型，可自动推断出all方法参数promises的类型
// all方法就是对Promise.all的封装
axios.all = function all(promises) {
  return Promise.all(promises)
}

// 接收一个函数，返回一个新的函数，新函数的结构满足then函数的参数结构
axios.spread = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr)
  }
}

axios.Axios = Axios

export default axios
