import { CancelExecutor, CancelTokenSource, Canceler } from '../types'
// types中的定义只能当做类型，Cancel类可以当做值使用
import Cancel from './Cancel'

interface ResolvePromise {
  (reason?: Cancel): void
}

export default class CancelToken {
  promise: Promise<Cancel>
  reason?: Cancel

  constructor(executor: CancelExecutor) {
    let resolvePromise: ResolvePromise
    // 先实例化一个pending状态的Promise
    this.promise = new Promise<Cancel>(resolve => {
      resolvePromise = resolve
    })

    executor(message => {
      // 当this.reason存在时退出执行，保证只执行一次
      if (this.reason) {
        return
      }
      this.reason = new Cancel(message)
      // 将Promise从pending状态改变为resolved状态
      resolvePromise(this.reason)
    })
  }

  // 一旦Cancel执行过，this.reason将有值，此时抛出
  throwIfRequested() {
    if (this.reason) {
      throw this.reason
    }
  }

  static source(): CancelTokenSource {
    let cancel!: Canceler
    const token = new CancelToken(c => {
      cancel = c
    })
    return {
      cancel,
      token
    }
  }
}
