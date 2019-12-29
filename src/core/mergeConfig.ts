import { AxiosRequestConfig } from '../types'
import { isPlainObject, deepMerge } from '../helpers/util'

// 优先取config2的合并策略函数
function defaultStrat(val1: any, val2: any) {
  return typeof val2 !== 'undefined' ? val2 : val1
}

// 只取config2的合并策略函数
function fromVal2Strat(val1: any, val2: any): any {
  if (typeof val2 !== 'undefined') {
    return val2
  }
}

// 针对headers等的深度合并策略函数
function deepMergeStrat(val1: any, val2: any): any {
  if (isPlainObject(val2)) {
    return deepMerge(val1, val2)
  } else if (typeof val2 !== 'undefined') {
    return val2
  } else if (isPlainObject(val1)) {
    return deepMerge(val1)
  } else if (typeof val1 !== 'undefined') {
    return val1
  }
}

// 保存参数(key)与策略(value)的对象
const strats = Object.create(null)

// 需要指向合并策略2的参数
const stratKeysFromVal2 = ['url', 'params', 'data']

stratKeysFromVal2.forEach(key => {
  strats[key] = fromVal2Strat
})

// 需要指向深度合并策略的参数
const stratKeysDeepMerge = ['headers', 'auth']

stratKeysDeepMerge.forEach(key => {
  strats[key] = deepMergeStrat
})

// 将默认请求配置(config1)与传入请求配置(config2)做合并的函数
export default function mergeConfig(
  config1: AxiosRequestConfig,
  config2?: AxiosRequestConfig
): AxiosRequestConfig {
  if (!config2) {
    config2 = {}
  }

  // 存放合并后配置的对象
  const config = Object.create(null)

  for (let key in config2) {
    mergeField(key)
  }

  for (let key in config1) {
    if (!config2[key]) {
      mergeField(key)
    }
  }

  function mergeField(key: string): void {
    // 获取每个参数的合并策略函数
    const strat = strats[key] || defaultStrat
    // 针对合并后的配置调用每个参数对应的合并策略函数
    config[key] = strat(config1[key], config2![key])
  }

  // 返回合并后的结果
  return config
}
