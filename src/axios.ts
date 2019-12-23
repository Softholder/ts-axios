import { AxiosInstance } from './types'
import Axios from './core/Axios'
import { extend } from './helpers/util'

function createInstance(): AxiosInstance {
  const context = new Axios()
  // 将instance指定为Axios原型上的request方法且绑定this为context,因为request内部会访问this
  const instance = Axios.prototype.request.bind(context)
  // 将context上所有的属性及方法全部拷贝到instance上
  extend(instance, context)
  // 返回instance得到混合对象，同时具有Axios类的属性方法和Axios原型上的request方法
  return instance as AxiosInstance
}

const axios = createInstance()

export default axios
