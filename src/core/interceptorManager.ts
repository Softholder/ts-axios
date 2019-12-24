import { ResolvedFn, RejectedFn } from '../types'

// 仅在当前文件中使用的接口类型定义在该文件中即可
interface Interceptor<T> {
  // resolved必传，rejected可不传
  resolved: ResolvedFn<T>
  rejected?: RejectedFn
}

export default class InterceptorManager<T> {
  // 私有属性，存储拦截器
  private interceptors: Array<Interceptor<T> | null>
  constructor() {
    this.interceptors = []
  }

  use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number {
    this.interceptors.push({
      resolved,
      rejected
    })
    // 返回值id为interceptors数组的长度减1
    return this.interceptors.length - 1
  }

  // 遍历拦截器的函数，将每个拦截器作为fn的参数执行一次
  // 仅拦截器内部使用，不需要暴露给外部
  forEach(fn: (interceptor: Interceptor<T>) => void): void {
    this.interceptors.forEach(interceptor => {
      if (interceptor !== null) {
        fn(interceptor)
      }
    })
  }

  eject(id: number): void {
    // 删除时不能直接删除数组元素，会导致拦截器id错乱，而是将其置为null
    if (this.interceptors[id]) {
      this.interceptors[id] = null
    }
  }
}
