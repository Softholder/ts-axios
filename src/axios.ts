import { AxiosRequestConfig, AxiosStatic } from './types'
import Axios from './core/Axios'
import { extend } from './helpers/util'
import defaults from './defaults'
import mergeConfig from './core/mergeConfig'
import CancelToken from './cancel/CancelToken'
import Cancel, { isCancel } from './cancel/Cancel'

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

export default axios
